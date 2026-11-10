'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNutritionStore, RECIPES, RECIPE_CATEGORIES, searchRecipes } from '@/lib/nutritionStore';
import { searchCiqualFoods, FOOD_CATEGORIES } from '@/lib/ciqualDatabase';
import type { CiqualFood } from '@/lib/ciqualDatabase';
import { useUserStore } from '@/lib/userStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useFreemiumStore, FREE_LIMITS } from '@/lib/freemiumStore';
import { useGameStore } from '@/lib/gameStore';
import type { Recipe } from '@/lib/recipes';


import CalixCoach from '@/components/CalixCoach';
import RecipeModal from '@/components/RecipeModal';
import BarcodeScanner from '@/components/BarcodeScanner';
import type { ScannedFood } from '@/components/BarcodeScanner';
import PhotoFoodScanner from '@/components/PhotoFoodScanner';
import { Plus, Search, ChevronRight, X, Apple, ChefHat, Scale, Droplets, Lock, Camera, Flame, Utensils, Star, Trash2, ShoppingCart } from 'lucide-react';
import ShoppingList from '@/components/ShoppingList';
import { useShoppingList } from '@/lib/shoppingListStore';
import type { FavoriteFood } from '@/lib/nutritionStore';

const MEAL_TYPES = [
  { id: 'breakfast' as const, label: '🌅 Petit-déj' },
  { id: 'lunch' as const, label: '☀️ Déjeuner' },
  { id: 'dinner' as const, label: '🌙 Dîner' },
  { id: 'snack' as const, label: '🍎 Snack' },
];

type MainTab = 'foods' | 'recipes' | 'hydration';

const QUICK_WATER = [
  { label: '🥤 Verre', amount: 250 },
  { label: '🍶 Bouteille', amount: 500 },
  { label: '☕ Café', amount: 150 },
  { label: '🫖 Thé', amount: 200 },
];

// Open Food Facts text search
interface OFFSearchResult {
  id: string;
  name: string;
  brand: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  image?: string;
  nutriscore?: string;
}

async function searchOpenFoodFacts(query: string): Promise<OFFSearchResult[]> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,brands,nutriments,nutriscore_grade,image_front_small_url,categories`);
    const data = await res.json();
    if (!data.products) return [];
    return data.products
      .filter((p: Record<string, unknown>) => p.product_name && (p.nutriments as Record<string, number>)?.['energy-kcal_100g'])
      .map((p: Record<string, unknown>) => {
        const n = p.nutriments as Record<string, number>;
        return {
          id: `off_${p.code || Math.random().toString(36)}`,
          name: p.product_name as string,
          brand: (p.brands as string) || '',
          kcal: Math.round(n['energy-kcal_100g'] || 0),
          protein: Math.round((n.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
          fat: Math.round((n.fat_100g || 0) * 10) / 10,
          category: (p.categories as string)?.split(',')[0] || 'Open Food Facts',
          image: p.image_front_small_url as string || undefined,
          nutriscore: p.nutriscore_grade as string || undefined,
        };
      }).slice(0, 10);
  } catch { return []; }
}

export default function NutritionPage() {
  const router = useRouter();
  const totals = useNutritionStore((s) => s.getTodayTotals());
  const remaining = useNutritionStore((s) => s.getRemaining());
  const goals = useNutritionStore((s) => ({
    kcal: s.dailyGoalKcal, protein: s.dailyGoalProtein, carbs: s.dailyGoalCarbs, fat: s.dailyGoalFat,
  }));
  const todayMeals = useNutritionStore((s) => s.getTodayMeals());
  const addMeal = useNutritionStore((s) => s.addMeal);
  const removeMeal = useNutritionStore((s) => s.removeMeal);
  const calixMsg = useNutritionStore((s) => s.getCalixMessage());
  const favoriteFoods = useNutritionStore((s) => s.favoriteFoods);
  const addFavorite = useNutritionStore((s) => s.addFavorite);
  const removeFavorite = useNutritionStore((s) => s.removeFavorite);
  const isFavorite = useNutritionStore((s) => s.isFavorite);
  const dietaryPrefs = useUserStore((s) => s.profile.dietaryPrefs);
  const allergies = useUserStore((s) => s.profile.allergies);
  const waterConsumed = useHydrationStore((s) => s.consumed);
  const waterGoal = useHydrationStore((s) => s.dailyGoal);
  const waterEntries = useHydrationStore((s) => s.entries);
  const waterBonus = useHydrationStore((s) => s.bonusFromSession);
  const waterStreak = useHydrationStore((s) => s.streak);
  const addWater = useHydrationStore((s) => s.addWater);
  const waterProgress = useHydrationStore((s) => s.getProgress());
  const isPremiumUser = useFreemiumStore((s) => s.isPremium);
  const canAccessRecipes = isPremiumUser;
  const canAccessSearch = isPremiumUser;
  const canAccessPhotoScan = isPremiumUser;
  const canAccessShopping = isPremiumUser;
  const visitPage = useGameStore((s) => s.visitPage);
  const checkBadges = useGameStore((s) => s.checkBadges);

  const [mainTab, setMainTab] = useState<MainTab>('foods');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [foodQuery, setFoodQuery] = useState('');
  const [foodCategory, setFoodCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<CiqualFood | null>(null);
  const [foodGrams, setFoodGrams] = useState(100);
  const [offGrams, setOffGrams] = useState(100);
  const [foodMealType, setFoodMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [recipeQuery, setRecipeQuery] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('all');
  const [showScanner, setShowScanner] = useState(false);
  const [showPhotoScanner, setShowPhotoScanner] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const { items: shoppingItems } = useShoppingList();
  const [offResults, setOffResults] = useState<OFFSearchResult[]>([]);
  const [offLoading, setOffLoading] = useState(false);
  const [selectedOFF, setSelectedOFF] = useState<OFFSearchResult | null>(null);

  useEffect(() => { visitPage('nutrition'); }, []);

  // CIQUAL local search
  const ciqualResults = useMemo(() => {
    if (!foodQuery.trim() && foodCategory === 'all') return [];
    const results = searchCiqualFoods(foodQuery, foodCategory);
    return canAccessSearch ? results : results.slice(0, FREE_LIMITS.searchResults);
  }, [foodQuery, foodCategory, canAccessSearch]);

  // Combined search: CIQUAL first, then Open Food Facts if CIQUAL has <3 results
  const doOFFSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) { setOffResults([]); return; }
    setOffLoading(true);
    const results = await searchOpenFoodFacts(query);
    setOffResults(results);
    setOffLoading(false);
  }, []);

  // Trigger OFF search always when query is long enough
  useEffect(() => {
    if (foodQuery.trim().length >= 3) {
      const timer = setTimeout(() => doOFFSearch(foodQuery), 600);
      return () => clearTimeout(timer);
    } else {
      setOffResults([]);
    }
  }, [foodQuery, doOFFSearch]);

  const showFoodResults = foodQuery.trim().length > 0 || foodCategory !== 'all';

  const recipeResults = useMemo(() => {
    const all = searchRecipes(recipeQuery, recipeCategory, dietaryPrefs, allergies);
    if (canAccessRecipes) return all;
    if (recipeCategory !== 'all') return all.slice(0, FREE_LIMITS.recipesPerCategory);
    const seen: Record<string, number> = {};
    return all.filter(r => {
      seen[r.category] = (seen[r.category] || 0) + 1;
      return seen[r.category] <= FREE_LIMITS.recipesPerCategory;
    });
  }, [recipeQuery, recipeCategory, dietaryPrefs, allergies, canAccessRecipes]);

  const foodMacros = useMemo(() => {
    if (!selectedFood) return null;
    const m = foodGrams / 100;
    return {
      kcal: Math.round(selectedFood.kcal * m),
      protein: Math.round(selectedFood.protein * m * 10) / 10,
      carbs: Math.round(selectedFood.carbs * m * 10) / 10,
      fat: Math.round(selectedFood.fat * m * 10) / 10,
    };
  }, [selectedFood, foodGrams]);

  const offMacros = useMemo(() => {
    if (!selectedOFF) return null;
    const m = offGrams / 100;
    return {
      kcal: Math.round(selectedOFF.kcal * m),
      protein: Math.round(selectedOFF.protein * m * 10) / 10,
      carbs: Math.round(selectedOFF.carbs * m * 10) / 10,
      fat: Math.round(selectedOFF.fat * m * 10) / 10,
    };
  }, [selectedOFF, offGrams]);

  const triggerNutritionBadgeCheck = () => {
    const nStore = useNutritionStore.getState();
    const uStore = useUserStore.getState();
    checkBadges({
      totalSessions: uStore.totalSessions, streak: uStore.streak,
      hasInjury: uStore.profile.injuries.length > 0,
      hydrationStreak: useHydrationStore.getState().streak,
      nutritionStreak: nStore.streak,
      sleepStreak: 0, level: uStore.level,
      usedVoyageMode: uStore.sessionHistory.some(s => s.mode === 'voyage'),
      usedCycleMode: uStore.sessionHistory.some(s => s.mode === 'cycle'),
      sessionHour: new Date().getHours(), daysAbsent: uStore.getDaysAbsent(),
    });
  };

  const addFoodAsMeal = () => {
    if (selectedFood && foodMacros) {
      addMeal({
        type: foodMealType, name: `${selectedFood.name} (${foodGrams}g)`,
        kcal: foodMacros.kcal, protein: Math.round(foodMacros.protein),
        carbs: Math.round(foodMacros.carbs), fat: Math.round(foodMacros.fat),
      });
      setSelectedFood(null);
      setFoodGrams(100);
    } else if (selectedOFF && offMacros) {
      addMeal({
        type: foodMealType, name: `${selectedOFF.name}${selectedOFF.brand ? ' ('+selectedOFF.brand+')' : ''} (${offGrams}g)`,
        kcal: offMacros.kcal, protein: Math.round(offMacros.protein),
        carbs: Math.round(offMacros.carbs), fat: Math.round(offMacros.fat),
      });
      setSelectedOFF(null);
      setOffGrams(100);
    }
    triggerNutritionBadgeCheck();
  };

  const addRecipeAsMeal = (recipe: Recipe, type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    addMeal({ type, name: recipe.name, kcal: recipe.kcal, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat });
    setSelectedRecipe(null);
  };

  const macroBar = (value: number, goal: number, color: string) => (
    <div className="h-1.5 bg-theme-surface rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(100, (value / goal) * 100)}%` }} />
    </div>
  );

  const kcalPercent = Math.min(100, Math.round((totals.kcal / goals.kcal) * 100));

  return (
    <div className="pb-20 page-enter relative">
      
      <div className="relative z-10 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-black text-white">Nutrition</h1>
            <p className="text-xs text-secondary mt-0.5 capitalize">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <CalixCoach message={calixMsg} type="info" />

        {/* CLEAR Calorie summary */}
        <div className="relative bg-theme-card rounded-3xl p-5 border border-cali-orange/15">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cali-red via-cali-orange to-transparent rounded-t-3xl" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cali-red/20 to-cali-orange/20 flex items-center justify-center">
              <Flame size={20} className="text-cali-orange" />
            </div>
            <div>
              <p className="text-xs text-secondary">Tu as consommé aujourd&apos;hui</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-display font-black text-cali-orange">{totals.kcal}</span>
                <span className="text-sm text-secondary">/ {goals.kcal} kcal</span>
                <span className="text-xs text-secondary ml-1">({kcalPercent}%)</span>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-3 bg-theme-surface rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full bg-gradient-to-r from-cali-red to-cali-orange transition-all duration-700" style={{ width: `${kcalPercent}%` }} />
          </div>
          {remaining.kcal > 0 && totals.kcal > 0 && (
            <p className="text-xs text-center text-secondary">
              Il te reste <span className="font-bold text-cali-green">{remaining.kcal} kcal</span> · <span className="font-bold text-cali-red">{remaining.protein}g prot</span>
            </p>
          )}
          {remaining.kcal < 0 && (
            <p className="text-xs text-center text-cali-orange font-medium">
              ⚠️ Surplus de <span className="font-bold">{Math.abs(remaining.kcal)} kcal</span> aujourd'hui
            </p>
          )}
          {/* Macros */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Protéines', value: totals.protein, goal: goals.protein, color: 'text-cali-red', bg: 'bg-cali-red' },
              { label: 'Glucides', value: totals.carbs, goal: goals.carbs, color: 'text-cali-blue', bg: 'bg-cali-blue' },
              { label: 'Lipides', value: totals.fat, goal: goals.fat, color: 'text-cali-orange', bg: 'bg-cali-orange' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`text-lg font-bold ${m.color}`}>{m.value}g</span>
                  <span className="text-[10px] text-secondary">/{m.goal}g</span>
                </div>
                {macroBar(m.value, m.goal, m.bg)}
                <p className="text-[10px] text-secondary mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today Meals */}
        {todayMeals.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Utensils size={14} className="text-cali-orange" />
              <p className="text-sm font-bold text-white">Repas du jour</p>
              <span className="ml-auto text-xs text-secondary">{todayMeals.length} repas · {totals.kcal} kcal</span>
            </div>
            <div className="space-y-1.5">{todayMeals.map((meal) => {
              const mealBorder: Record<string, string> = { breakfast: 'border-l-2 border-l-yellow-500', lunch: 'border-l-2 border-l-cali-blue', dinner: 'border-l-2 border-l-purple-500', snack: 'border-l-2 border-l-cali-green' };
              return (
              <div key={meal.id} className={`bg-theme-surface rounded-xl px-3 py-2.5 flex items-center justify-between ${mealBorder[meal.type] || ''}`}>
                <div className="flex-1 min-w-0"><p className="text-sm text-white font-medium truncate">{meal.name}</p>
                <p className="text-[10px] text-secondary">{MEAL_TYPES.find(t => t.id === meal.type)?.label}</p></div>
                <div className="text-right flex-shrink-0 ml-2 flex items-center gap-2">
                  <div><p className="text-sm text-cali-orange font-bold">{meal.kcal}</p>
                  <p className="text-[10px] text-secondary">kcal</p></div>
                  <button onClick={() => removeMeal(meal.id)} className="w-7 h-7 rounded-lg bg-cali-red/10 flex items-center justify-center active:scale-90">
                    <X size={14} className="text-cali-red" />
                  </button>
                </div>
              </div>
            );})}</div>
          </div>
        )}

        {/* ═══ TABS — VISIBLE BUTTONS ═══ */}
        <div className="flex gap-2">
          {([
            { id: 'foods' as MainTab, icon: '🍎', label: 'Aliments', color: 'cali-orange', activeFrom: 'from-cali-red', activeTo: 'to-cali-orange' },
            { id: 'recipes' as MainTab, icon: '👨‍🍳', label: 'Recettes', color: 'cali-green', activeFrom: 'from-cali-green', activeTo: 'to-emerald-500' },
            { id: 'hydration' as MainTab, icon: '💧', label: 'Eau', color: 'cali-blue', activeFrom: 'from-cali-blue', activeTo: 'to-blue-400' },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setMainTab(tab.id)}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                mainTab === tab.id
                  ? `bg-gradient-to-r ${tab.activeFrom} ${tab.activeTo} text-white border-transparent shadow-lg`
                  : `bg-theme-card border-theme text-${tab.color} hover:border-white/20`
              }`}>
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══ TAB ALIMENTS ═══ */}
        {mainTab === 'foods' && (
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input type="text" value={foodQuery} onChange={(e) => setFoodQuery(e.target.value)}
                placeholder="Rechercher un aliment (CIQUAL + Open Food Facts)..."
                className="w-full bg-theme-surface rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder:text-tertiary border border-theme focus:border-cali-orange/40 focus:outline-none" autoComplete="off" />
              {foodQuery && <button onClick={() => setFoodQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"><X size={16} /></button>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowScanner(true)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-br from-cali-red/20 to-cali-orange/20 border border-cali-orange/30 flex flex-col items-center justify-center gap-1 active:scale-95">
                <Camera size={20} className="text-cali-orange" />
                <span className="text-[10px] font-bold text-cali-orange">Code-barres</span>
              </button>
              <button onClick={() => canAccessPhotoScan ? setShowPhotoScanner(true) : router.push('/premium')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-br from-cali-red/20 to-cali-orange/20 border border-cali-orange/30 flex flex-col items-center justify-center gap-1 active:scale-95 relative">
                {canAccessPhotoScan ? <Camera size={20} className="text-cali-orange" /> : <Lock size={16} className="text-cali-orange" />}
                <span className="text-[10px] font-bold text-cali-orange">Scan IA ✨</span>
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              <button onClick={() => setFoodCategory('all')}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${foodCategory === 'all' ? 'bg-cali-orange/20 text-cali-orange border border-cali-orange/40' : 'bg-theme-surface text-secondary border border-theme'}`}>
                Tout
              </button>
              {FOOD_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setFoodCategory(cat)}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap ${foodCategory === cat ? 'bg-cali-orange/20 text-cali-orange border border-cali-orange/40' : 'bg-theme-surface text-secondary border border-theme'}`}>
                  {cat}
                </button>
              ))}
            </div>
            {!showFoodResults ? (
              <div className="space-y-4">
                {/* Mes favoris */}
                {favoriteFoods.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-cali-orange mb-2">⭐ Mes favoris</p>
                    <div className="space-y-1.5">
                      {favoriteFoods.map((fav) => (
                        <div key={fav.id} className="bg-theme-card rounded-xl px-3 py-2.5 border border-cali-orange/10 flex items-center gap-2">
                          <button onClick={() => {
                            if (fav.source === 'ciqual') {
                              setSelectedFood({ id: fav.id, name: fav.name, kcal: fav.kcal, protein: fav.protein, carbs: fav.carbs, fat: fav.fat, fiber: 0, category: '' } as unknown as CiqualFood);
                            } else {
                              setSelectedOFF({ id: fav.id, name: fav.name, brand: fav.brand || '', kcal: fav.kcal, protein: fav.protein, carbs: fav.carbs, fat: fav.fat, category: '' });
                            }
                            setFoodGrams(100);
                          }} className="flex-1 min-w-0 text-left">
                            <p className="text-sm text-white font-medium truncate">{fav.name}</p>
                            <p className="text-[10px] text-secondary">{fav.kcal} kcal · P:{fav.protein}g</p>
                          </button>
                          <button onClick={() => removeFavorite(fav.id)} className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90">
                            <Star size={16} className="text-cali-orange fill-cali-orange" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-theme-surface rounded-2xl p-6 text-center">
                  <Apple size={24} className="text-cali-orange mx-auto mb-2" />
                  <p className="text-secondary text-sm">Tape le nom d&apos;un aliment</p>
                  <p className="text-secondary text-xs mt-1 opacity-60">Base CIQUAL 2025 + Open Food Facts (3M+ produits)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pb-24">
                {/* CIQUAL results */}
                {ciqualResults.length > 0 && (
                  <>
                    <p className="text-[10px] text-cali-orange font-bold">📋 CIQUAL — {ciqualResults.length} résultat{ciqualResults.length > 1 ? 's' : ''}{!canAccessSearch ? ' (max 5 en gratuit)' : ''}</p>
                    {ciqualResults.map((food) => (
                      <div key={food.id} className="bg-theme-card rounded-xl px-3 py-3 border border-theme flex items-center gap-2">
                        <button onClick={() => { setSelectedFood(food); setSelectedOFF(null); setFoodGrams(100); }}
                          className="flex-1 min-w-0 text-left flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{food.name}</p>
                            <p className="text-[10px] text-secondary">{food.category} · P:{food.protein}g G:{food.carbs}g L:{food.fat}g</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-cali-orange font-bold">{food.kcal}</p>
                            <p className="text-[10px] text-secondary">kcal/100g</p>
                          </div>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); const fav: FavoriteFood = { id: String(food.id), name: food.name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat, source: 'ciqual' }; isFavorite(String(food.id)) ? removeFavorite(String(food.id)) : addFavorite(fav); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 active:scale-90">
                          <Star size={16} className={isFavorite(String(food.id)) ? 'text-cali-orange fill-cali-orange' : 'text-tertiary'} />
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {/* Open Food Facts results */}
                {offLoading && (
                  <p className="text-[10px] text-cali-blue text-center py-2">🔍 Recherche dans Open Food Facts...</p>
                )}
                {offResults.length > 0 && (
                  <>
                    <p className="text-[10px] text-cali-green font-bold mt-3">🌍 Open Food Facts — {offResults.length} résultat{offResults.length > 1 ? 's' : ''}</p>
                    {offResults.map((food) => (
                      <div key={food.id} className="bg-theme-card rounded-xl px-3 py-3 border border-theme flex items-center gap-2">
                        <button onClick={() => { setSelectedOFF(food); setSelectedFood(null); setFoodGrams(100); }}
                          className="flex-1 min-w-0 text-left flex items-center gap-3">
                          {food.image && <img src={food.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{food.name}</p>
                            <p className="text-[10px] text-secondary">{food.brand || food.category} · P:{food.protein}g G:{food.carbs}g L:{food.fat}g</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-cali-orange font-bold">{food.kcal}</p>
                            <p className="text-[10px] text-secondary">kcal/100g</p>
                          </div>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); const fav: FavoriteFood = { id: food.id, name: food.name, brand: food.brand, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat, source: 'openfoodfacts' }; isFavorite(String(food.id)) ? removeFavorite(String(food.id)) : addFavorite(fav); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 active:scale-90">
                          <Star size={16} className={isFavorite(food.id) ? 'text-cali-orange fill-cali-orange' : 'text-tertiary'} />
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {ciqualResults.length === 0 && offResults.length === 0 && !offLoading && (
                  <div className="bg-theme-surface rounded-2xl p-6 text-center">
                    <p className="text-secondary text-sm">Aucun aliment trouvé</p>
                    <p className="text-secondary text-xs mt-1 opacity-60">Essaie un autre terme ou scanne le code-barres</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB RECETTES ═══ */}
        {mainTab === 'recipes' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input type="text" value={recipeQuery} onChange={(e) => setRecipeQuery(e.target.value)}
                  placeholder="Rechercher par nom, ingrédient, tag..."
                  className="w-full bg-theme-surface rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder:text-tertiary border border-theme focus:border-cali-green/40 focus:outline-none" />
                {recipeQuery && <button onClick={() => setRecipeQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"><X size={16} /></button>}
              </div>
              <button onClick={() => canAccessShopping ? setShowShoppingList(true) : router.push('/premium')}
                className="px-4 py-3 rounded-xl bg-gradient-to-br from-cali-blue/20 to-cali-green/20 border border-cali-blue/30 flex flex-col items-center justify-center gap-0.5 active:scale-95 relative flex-shrink-0">
                {canAccessShopping ? <ShoppingCart size={18} className="text-cali-blue" /> : <Lock size={16} className="text-cali-blue" />}
                <span className="text-[9px] font-bold text-cali-blue flex items-center gap-0.5">
                  Courses
                  {canAccessShopping && shoppingItems.length > 0 && (
                    <span className="w-3.5 h-3.5 rounded-full bg-cali-blue text-[8px] font-bold text-white flex items-center justify-center">{shoppingItems.length > 9 ? '9+' : shoppingItems.length}</span>
                  )}
                </span>
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {RECIPE_CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setRecipeCategory(cat.id)}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap ${
                    recipeCategory === cat.id ? 'bg-cali-green/20 border border-cali-green/40 text-cali-green' : 'bg-theme-surface border border-theme text-secondary'
                  }`}>
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
            <p className="text-[10px] text-secondary">{recipeResults.length} recette{recipeResults.length > 1 ? 's' : ''}</p>
            <div className="space-y-2">
              {recipeResults.map((recipe) => {
                const dc = { easy: 'text-green-400', medium: 'text-cali-orange', hard: 'text-cali-red' };
                const bl = { low: '€', medium: '€€', high: '€€€' };
                const cl = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎', pre_workout: '⚡', post_workout: '💪' };
                return (
                  <button key={recipe.id} onClick={() => setSelectedRecipe(recipe)}
                    className="w-full bg-theme-card rounded-2xl p-4 border border-theme text-left flex items-center gap-3 hover:border-theme active:scale-[0.99]">
                    <span className="text-3xl">{recipe.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{recipe.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-secondary">{cl[recipe.category]}</span>
                        <span className="text-[10px] text-cali-orange font-bold">{recipe.kcal} kcal</span>
                        <span className="text-[10px] text-cali-red font-bold">{recipe.protein}g prot</span>
                        <span className={`text-[10px] ${dc[recipe.difficulty]}`}>{recipe.difficulty === 'easy' ? '🟢' : recipe.difficulty === 'medium' ? '🟡' : '🔴'}</span>
                        <span className="text-[10px] text-secondary">{bl[recipe.budget]}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-secondary flex-shrink-0" />
                  </button>
                );
              })}
            </div>
            {!canAccessRecipes && (
              <button onClick={() => router.push('/premium')} className="w-full bg-gradient-to-r from-cali-red/10 to-cali-orange/10 border border-cali-orange/30 rounded-2xl p-4 text-center mt-3">
                <Lock size={16} className="text-cali-orange mx-auto mb-1" />
                <p className="text-sm font-bold text-white">Débloquer les 300 recettes</p>
                <p className="text-[10px] text-secondary mt-0.5">Prise de masse, sèche, pré/post training...</p>
                <p className="text-xs text-cali-orange font-bold mt-2">Passer Premium →</p>
              </button>
            )}
          </div>
        )}

        {/* ═══ TAB HYDRATION ═══ */}
        {mainTab === 'hydration' && (
          <div className="space-y-4">
            <div className="bg-theme-card rounded-3xl p-6 border border-theme flex flex-col items-center">
              <div className="relative">
                <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
                  <circle cx="90" cy="90" r={70} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle cx="90" cy="90" r={70} fill="none" stroke="#00D4FF" strokeWidth="12"
                    strokeLinecap="round" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - waterProgress / 100)}
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.4))' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Droplets size={22} className="text-cali-blue mb-1" />
                  <p className="text-2xl font-display font-black text-white">{waterConsumed}</p>
                  <p className="text-[10px] text-secondary">/ {waterGoal} ml</p>
                </div>
              </div>
              <p className="text-sm text-secondary mt-2">{waterProgress}% · Reste {Math.max(0, waterGoal - waterConsumed)} ml</p>
              {waterBonus > 0 && (
                <p className="text-[10px] text-cali-orange mt-1">🏋️ +{waterBonus} ml ajoutés post-séance</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_WATER.map((item) => (
                <button key={item.label} onClick={() => addWater(item.amount)}
                  className="bg-theme-card rounded-2xl p-3 border border-theme flex items-center gap-3 active:scale-[0.97] hover:border-cali-blue/30">
                  <span className="text-xl">{item.label.split(' ')[0]}</span>
                  <div className="text-left"><p className="text-sm font-bold text-white">{item.label.split(' ')[1]}</p>
                    <p className="text-xs text-cali-blue">+{item.amount} ml</p></div>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {[100, 200, 300, 500].map((ml) => (
                <button key={ml} onClick={() => addWater(ml)}
                  className="flex-1 py-3 rounded-xl bg-theme-surface border border-theme text-center active:scale-[0.95] hover:border-cali-blue/30">
                  <p className="text-sm font-bold text-cali-blue">+{ml}</p>
                  <p className="text-[10px] text-secondary">ml</p>
                </button>
              ))}
            </div>
            {waterEntries.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary font-medium">HISTORIQUE DU JOUR</p>
                  <p className="text-xs text-cali-blue font-bold">{waterStreak}j streak</p>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {[...waterEntries].reverse().map((entry, i) => (
                    <div key={i} className="flex justify-between items-center bg-theme-surface rounded-xl px-3 py-2">
                      <span className="text-xs text-secondary">
                        {new Date(entry.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-sm text-cali-blue font-medium">+{entry.amount} ml</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Food Modal (CIQUAL) */}
      {selectedFood && foodMacros && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedFood(null)}>
          <div className="w-full max-w-lg bg-theme-card rounded-t-3xl p-5 animate-slide-up space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div><h3 className="text-lg font-display font-bold text-white">{selectedFood.name}</h3>
              <p className="text-xs text-secondary">{selectedFood.category}</p></div>
              <button onClick={() => setSelectedFood(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16} className="text-tertiary" /></button>
            </div>
            <div className="bg-theme-surface rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Scale size={16} className="text-cali-orange" /><span className="text-sm text-secondary">Quantité</span></div>
                <span className="text-xl font-display font-black text-white">{foodGrams}g</span>
              </div>
              <input type="range" min="10" max="500" step="5" value={foodGrams} onChange={(e) => setFoodGrams(Number(e.target.value))} className="w-full accent-cali-orange" />
              <div className="flex justify-between mt-1">
                {[50, 100, 150, 200, 300].map((g) => (
                  <button key={g} onClick={() => setFoodGrams(g)} className={`text-[10px] px-2 py-1 rounded-lg ${foodGrams === g ? 'bg-cali-orange/20 text-cali-orange' : 'text-secondary'}`}>{g}g</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[{l:'Kcal',v:foodMacros.kcal,c:'text-cali-orange'},{l:'Prot',v:`${foodMacros.protein}g`,c:'text-cali-red'},{l:'Gluc',v:`${foodMacros.carbs}g`,c:'text-cali-blue'},{l:'Lip',v:`${foodMacros.fat}g`,c:'text-cali-orange'}].map(m=>(
                <div key={m.l} className="bg-theme-surface rounded-xl p-3 text-center"><p className={`text-lg font-bold ${m.c}`}>{m.v}</p><p className="text-[10px] text-secondary">{m.l}</p></div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {MEAL_TYPES.map((t) => (
                <button key={t.id} onClick={() => setFoodMealType(t.id)}
                  className={`py-2 rounded-xl text-[10px] font-bold ${foodMealType === t.id ? 'bg-cali-orange/20 border border-cali-orange/40 text-cali-orange' : 'bg-theme-surface border border-theme text-secondary'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={addFoodAsMeal}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-display font-bold flex items-center justify-center gap-2">
              <Plus size={18} /> Ajouter {foodMacros.kcal} kcal
            </button>
          </div>
        </div>
      )}

      {/* Food Modal (Open Food Facts) */}
      {selectedOFF && offMacros && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOFF(null)}>
          <div className="w-full max-w-lg bg-theme-card rounded-t-3xl p-5 animate-slide-up space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedOFF.image && <img src={selectedOFF.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-white" />}
                <div><h3 className="text-lg font-display font-bold text-white">{selectedOFF.name}</h3>
                <p className="text-xs text-secondary">{selectedOFF.brand || selectedOFF.category}</p></div>
              </div>
              <button onClick={() => setSelectedOFF(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16} className="text-tertiary" /></button>
            </div>
            <div className="bg-theme-surface rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Scale size={16} className="text-cali-orange" /><span className="text-sm text-secondary">Quantité</span></div>
                <span className="text-xl font-display font-black text-white">{offGrams}g</span>
              </div>
              <input type="range" min="10" max="500" step="5" value={offGrams} onChange={(e) => setOffGrams(Number(e.target.value))} className="w-full accent-cali-orange" />
              <div className="flex justify-between mt-1">
                {[50, 100, 150, 200, 300].map((g) => (
                  <button key={g} onClick={() => setOffGrams(g)} className={`text-[10px] px-2 py-1 rounded-lg ${offGrams === g ? 'bg-cali-orange/20 text-cali-orange' : 'text-secondary'}`}>{g}g</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[{l:'Kcal',v:offMacros.kcal,c:'text-cali-orange'},{l:'Prot',v:`${offMacros.protein}g`,c:'text-cali-red'},{l:'Gluc',v:`${offMacros.carbs}g`,c:'text-cali-blue'},{l:'Lip',v:`${offMacros.fat}g`,c:'text-cali-orange'}].map(m=>(
                <div key={m.l} className="bg-theme-surface rounded-xl p-3 text-center"><p className={`text-lg font-bold ${m.c}`}>{m.v}</p><p className="text-[10px] text-secondary">{m.l}</p></div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {MEAL_TYPES.map((t) => (
                <button key={t.id} onClick={() => setFoodMealType(t.id)}
                  className={`py-2 rounded-xl text-[10px] font-bold ${foodMealType === t.id ? 'bg-cali-orange/20 border border-cali-orange/40 text-cali-orange' : 'bg-theme-surface border border-theme text-secondary'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={addFoodAsMeal}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-display font-bold flex items-center justify-center gap-2">
              <Plus size={18} /> Ajouter {offMacros.kcal} kcal
            </button>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div>
          <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
          <div className="fixed bottom-0 left-0 right-0 z-[110] p-4 bg-theme/95 backdrop-blur-xl border-t border-theme">
            <div className="max-w-lg mx-auto grid grid-cols-2 gap-2">
              {MEAL_TYPES.map((type) => (
                <button key={type.id} onClick={() => addRecipeAsMeal(selectedRecipe, type.id)}
                  className="py-2.5 rounded-xl bg-cali-green/15 border border-cali-green/30 text-xs font-bold text-cali-green">
                  <Plus size={12} className="inline mr-1" /> {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showShoppingList && <ShoppingList onClose={() => setShowShoppingList(false)} />}

      {showPhotoScanner && (
        <PhotoFoodScanner
          onClose={() => setShowPhotoScanner(false)}
          onFoodFound={(food) => {
            addMeal({
              type: foodMealType,
              name: `${food.name} (${food.estimatedGrams}g) 📸`,
              kcal: food.kcal,
              protein: Math.round(food.protein),
              carbs: Math.round(food.carbs),
              fat: Math.round(food.fat),
            });
            setShowPhotoScanner(false);
          }}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onFoodFound={(food: ScannedFood, grams: number) => {
            addMeal({
              type: foodMealType, name: `${food.name}${food.brand ? ' - '+food.brand : ''} (${grams}g)`,
              kcal: food.kcal, protein: Math.round(food.protein),
              carbs: Math.round(food.carbs), fat: Math.round(food.fat),
            });
            setShowScanner(false);
          }}
        />
      )}


    </div>
  );
}
