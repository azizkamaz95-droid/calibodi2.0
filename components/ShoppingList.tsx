'use client';
import { useState, useRef } from 'react';
import { X, Share2, Trash2, Plus, Check, ShoppingCart } from 'lucide-react';
import { Share } from '@capacitor/share';
import { useShoppingList } from '@/lib/shoppingListStore';

interface Props {
  onClose: () => void;
}

export default function ShoppingList({ onClose }: Props) {
  const { items, addItem, toggleItem, removeItem, clearChecked, clearAll } = useShoppingList();
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addItem(newName.trim());
    setNewName('');
    inputRef.current?.focus();
  };

  const handleShare = async () => {
    const text = [
      '🛒 Liste de courses CaliBodi\n',
      ...unchecked.map((i) => `• ${i.name}${i.quantity ? ` — ${i.quantity}` : ''}`),
      checked.length ? `\n✅ Déjà achetés : ${checked.map((i) => i.name).join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await Share.share({ text });
    } catch {
      if (navigator.share) {
        await navigator.share({ text }).catch(() => null);
      } else {
        await navigator.clipboard.writeText(text).catch(() => null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-cali-card rounded-t-3xl animate-slide-up flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cali-blue/20 to-cali-green/20 flex items-center justify-center">
              <ShoppingCart size={18} className="text-cali-blue" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">Liste de courses</h3>
              <p className="text-[10px] text-cali-light-text">{items.length} article{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={handleShare} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Share2 size={15} className="text-cali-blue" />
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Ajouter un article */}
        <div className="p-4 border-b border-white/5 flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Ajouter un article..."
              className="flex-1 bg-cali-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-cali-blue/50"
            />
            <button
              onClick={handleAdd}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cali-blue/30 to-cali-green/20 flex items-center justify-center flex-shrink-0"
            >
              <Plus size={18} className="text-cali-blue" />
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="text-4xl">🛒</p>
              <p className="text-sm font-bold text-white">Liste vide</p>
              <p className="text-xs text-cali-light-text">Ajoute des articles manuellement ou depuis une recette</p>
            </div>
          )}

          {/* Articles non cochés */}
          {unchecked.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-cali-surface rounded-xl px-4 py-3">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-6 h-6 rounded-full border-2 border-white/20 flex-shrink-0 flex items-center justify-center"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.name}</p>
                {item.quantity && <p className="text-[10px] text-cali-light-text">{item.quantity}</p>}
              </div>
              <button onClick={() => removeItem(item.id)}>
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          ))}

          {/* Articles cochés */}
          {checked.length > 0 && (
            <>
              <div className="flex items-center justify-between pt-2 pb-1">
                <p className="text-[10px] font-bold text-cali-light-text uppercase tracking-wider">Achetés ({checked.length})</p>
                <button onClick={clearChecked} className="text-[10px] text-red-400 font-bold">Supprimer</button>
              </div>
              {checked.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-cali-surface/50 rounded-xl px-4 py-3 opacity-50">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full bg-cali-green/30 border-2 border-cali-green flex-shrink-0 flex items-center justify-center"
                  >
                    <Check size={12} className="text-cali-green" />
                  </button>
                  <p className="text-sm text-white line-through truncate flex-1">{item.name}</p>
                  <button onClick={() => removeItem(item.id)}>
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/5 flex-shrink-0">
            <button
              onClick={clearAll}
              className="w-full py-3 rounded-2xl bg-cali-surface border border-white/10 text-sm font-bold text-red-400 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Vider la liste
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
