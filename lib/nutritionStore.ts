import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateTDEE } from './calculations';

export type { Recipe } from './recipes';
export { RECIPES, RECIPE_CATEGORIES, searchRecipes } from './recipes';

export interface MealEntry {
  id: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FavoriteFood {
  id: string;
  name: string;
  brand?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  source: 'ciqual' | 'openfoodfacts';
}

interface NutritionState {
  dailyGoalKcal: number;
  dailyGoalProtein: number;
  dailyGoalCarbs: number;
  dailyGoalFat: number;
  currentGoal: string;
  meals: MealEntry[];
  streak: number;
  lastLogDate: string | null;
  favoriteFoods: FavoriteFood[];

  setDailyGoals: (weight: number, goal: string, gender?: string, age?: number, height?: number, activityLevel?: number) => void;
  addMeal: (meal: Omit<MealEntry, 'id' | 'date'>) => void;
  removeMeal: (id: string) => void;
  addFavorite: (food: FavoriteFood) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getTodayTotals: () => { kcal: number; protein: number; carbs: number; fat: number };
  getRemaining: () => { kcal: number; protein: number; carbs: number; fat: number };
  getCalixMessage: () => string;
  getTodayMeals: () => MealEntry[];
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      dailyGoalKcal: 2000,
      dailyGoalProtein: 120,
      dailyGoalCarbs: 250,
      dailyGoalFat: 65,
      currentGoal: 'health',
      meals: [],
      streak: 0,
      lastLogDate: null,
      favoriteFoods: [],

      setDailyGoals: (weight, goal, gender, age, height, activityLevel) => {
        let kcal: number;
        // Use full TDEE when all params available, otherwise fall back to weight multiplier
        if (gender && age && height) {
          const tdee = calculateTDEE(weight, height, age, gender, activityLevel ?? 2);
          switch (goal) {
            case 'weight_loss': kcal = Math.round(tdee * 0.80); break;
            case 'muscle': kcal = Math.round(tdee * 1.10); break;
            case 'endurance': kcal = Math.round(tdee * 1.00); break;
            default: kcal = Math.round(tdee * 0.95); break;
          }
        } else {
          switch (goal) {
            case 'weight_loss': kcal = Math.round(weight * 24); break;
            case 'muscle': kcal = Math.round(weight * 32); break;
            case 'endurance': kcal = Math.round(weight * 30); break;
            default: kcal = Math.round(weight * 28); break;
          }
        }
        // Macro split: protein 25%, carbs 45%, fat 30% of kcal
        const proteinG = goal === 'muscle' ? Math.round(weight * 2) : Math.round(kcal * 0.25 / 4);
        const carbsG = Math.round(kcal * 0.45 / 4);
        const fatG = Math.round(kcal * 0.30 / 9);
        set({
          dailyGoalKcal: kcal,
          dailyGoalProtein: proteinG,
          dailyGoalCarbs: carbsG,
          dailyGoalFat: fatG,
          currentGoal: goal,
        });
      },

      addMeal: (meal) => {
        const today = new Date().toISOString().split('T')[0];
        const id = `meal_${Date.now()}`;
        const state = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = state.lastLogDate === yesterday || state.lastLogDate === today
          ? (state.lastLogDate === today ? state.streak : state.streak + 1) : 1;
        set({
          meals: [...state.meals, { ...meal, id, date: today }],
          streak: newStreak,
          lastLogDate: today,
        });
      },

      removeMeal: (id) => {
        set({ meals: get().meals.filter(m => m.id !== id) });
      },

      addFavorite: (food) => {
        const state = get();
        if (!state.favoriteFoods.find(f => f.id === food.id)) {
          set({ favoriteFoods: [...state.favoriteFoods, food] });
        }
      },

      removeFavorite: (id) => {
        set({ favoriteFoods: get().favoriteFoods.filter(f => f.id !== id) });
      },

      isFavorite: (id) => {
        return get().favoriteFoods.some(f => f.id === id);
      },

      getTodayTotals: () => {
        const today = new Date().toISOString().split('T')[0];
        const { meals } = get();
        const t = meals.filter(m => m.date === today);
        return {
          kcal: t.reduce((s, m) => s + m.kcal, 0),
          protein: t.reduce((s, m) => s + m.protein, 0),
          carbs: t.reduce((s, m) => s + m.carbs, 0),
          fat: t.reduce((s, m) => s + m.fat, 0),
        };
      },

      getRemaining: () => {
        const totals = get().getTodayTotals();
        const s = get();
        // Negative values = surplus (intentional — UI should display warning)
        return {
          kcal: s.dailyGoalKcal - totals.kcal,
          protein: s.dailyGoalProtein - totals.protein,
          carbs: s.dailyGoalCarbs - totals.carbs,
          fat: s.dailyGoalFat - totals.fat,
        };
      },

      getCalixMessage: () => {
        const totals = get().getTodayTotals();
        const s = get();
        const goal = s.currentGoal;
        if (totals.kcal === 0) return '🍽️ N\'oublie pas de logger tes repas pour un suivi précis.';
        const surplus = totals.kcal - s.dailyGoalKcal;
        if (surplus > 300) {
          if (goal === 'weight_loss') return `🚨 ${surplus} kcal de surplus ! Ton objectif perte de poids est compromis. Évite les extras ce soir.`;
          if (goal === 'muscle') return `💪 Bon surplus de ${surplus} kcal — parfait pour la prise de masse si c'est voulu.`;
          return `⚠️ Tu as dépassé ton objectif de ${surplus} kcal aujourd'hui. Pense à ajuster ton prochain repas.`;
        }
        if (surplus > 0) {
          if (goal === 'weight_loss') return '⚠️ Légèrement au-dessus de ton objectif. Reste vigilant ce soir.';
          return '⚠️ Tu es légèrement au-dessus de ton objectif calorique. Reste attentif au prochain repas.';
        }
        const remaining = s.dailyGoalKcal - totals.kcal;
        const proteinRemaining = s.dailyGoalProtein - totals.protein;
        if (proteinRemaining > 40) {
          if (goal === 'muscle') return '🥩 Priorité protéines ! Il t\'en manque encore pour soutenir ta prise de masse.';
          return '🥩 Tes muscles manquent de protéines. Privilégie un repas riche en protéines.';
        }
        if (remaining < 200) {
          if (s.streak >= 3) return `✅ Excellent ! Objectifs presque atteints — ${s.streak} jours de suite que tu es au top 🔥`;
          return '✅ Excellent ! Tu as presque atteint tes objectifs nutritionnels du jour.';
        }
        if (goal === 'weight_loss') return `🥗 ${remaining} kcal restantes pour aujourd'hui. Reste dans ton déficit, tu es sur la bonne voie.`;
        return '👍 Continue comme ça, ton alimentation est sur la bonne voie.';
      },

      getTodayMeals: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().meals.filter(m => m.date === today);
      },
    }),
    {
      name: 'calibodi-nutrition',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
    }
  )
);
