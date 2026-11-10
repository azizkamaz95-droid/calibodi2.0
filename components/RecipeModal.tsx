'use client';
import { useState } from 'react';
import { X, Clock, ChefHat, ShoppingCart, Check } from 'lucide-react';
import type { Recipe } from '@/lib/nutritionStore';
import { useShoppingList } from '@/lib/shoppingListStore';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: Props) {
  const { addFromRecipe } = useShoppingList();
  const [added, setAdded] = useState(false);

  const handleAddToList = () => {
    addFromRecipe(recipe.name, recipe.ingredients);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const diffBadge = {
    easy: { label: '🟢 Facile', color: 'bg-green-500/20 text-green-400' },
    medium: { label: '🟡 Moyen', color: 'bg-yellow-500/20 text-yellow-400' },
    hard: { label: '🔴 Difficile', color: 'bg-red-500/20 text-red-400' },
  }[recipe.difficulty];

  const budgetBadge = {
    low: { label: '€ Petit', color: 'bg-green-500/20 text-green-400' },
    medium: { label: '€€ Moyen', color: 'bg-yellow-500/20 text-yellow-400' },
    high: { label: '€€€ Élevé', color: 'bg-red-500/20 text-red-400' },
  }[recipe.budget];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-cali-card rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-cali-card/95 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/5">
          <h2 className="text-lg font-display font-bold text-white">{recipe.image} {recipe.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-5 pb-28">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${diffBadge.color}`}>{diffBadge.label}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${budgetBadge.color}`}>{budgetBadge.label}</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cali-blue/20 text-cali-blue flex items-center gap-1">
              <Clock size={12} /> {recipe.prepTime} min
            </span>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Kcal', value: recipe.kcal, color: 'text-cali-orange' },
              { label: 'Prot', value: `${recipe.protein}g`, color: 'text-cali-red' },
              { label: 'Gluc', value: `${recipe.carbs}g`, color: 'text-cali-blue' },
              { label: 'Lip', value: `${recipe.fat}g`, color: 'text-cali-orange' },
            ].map((m) => (
              <div key={m.label} className="bg-cali-surface rounded-2xl p-3 text-center">
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-gray-300">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ChefHat size={16} className="text-cali-green" /> Ingrédients
            </h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between items-center bg-cali-surface rounded-xl px-3 py-2">
                  <span className="text-sm text-gray-100">{ing.name}</span>
                  <span className="text-sm text-cali-blue font-medium">{ing.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">📋 Préparation</h3>
            <div className="space-y-3">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-cali-blue/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-cali-blue">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-100 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Substitutions */}
          {recipe.substitutions.length > 0 && (
            <div className="bg-cali-blue/5 border border-cali-blue/20 rounded-2xl p-3">
              <p className="text-xs font-bold text-cali-blue mb-1">💡 Alternatives</p>
              {recipe.substitutions.map((s, i) => (
                <p key={i} className="text-sm text-gray-200">{s}</p>
              ))}
            </div>
          )}

          {/* Bouton liste de courses */}
          <button
            onClick={handleAddToList}
            className={`w-full py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              added
                ? 'bg-cali-green/20 border border-cali-green/40 text-cali-green'
                : 'bg-cali-surface border border-white/10 text-white'
            }`}
          >
            {added ? <><Check size={16} /> Ajouté à la liste !</> : <><ShoppingCart size={16} /> Ajouter à la liste de courses</>}
          </button>
        </div>
      </div>
    </div>
  );
}
