import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PlanType = 'free' | 'monthly' | 'annual_monthly' | 'annual_once';

// All premium features
export type PremiumFeature =
  | 'voice_coaching'       // Calix parle pendant les séances
  | 'unlimited_sessions'   // Plus d'1 séance/jour
  | 'special_modes'        // Voyage, Express, Fatigue, Cycle
  | 'all_recipes'          // 100 recettes (gratuit = 3 par catégorie)
  | 'unlimited_search'     // CIQUAL illimité (gratuit = 5 résultats)
  | 'advanced_analytics'   // Heatmap, mensurations, photos, récap hebdo
  | 'recovery_advanced'    // Sieste, conseils sommeil, score récup, dette
  | 'hydration_smart'      // Bonus post-séance, rappels contextuels
  | 'module_connections'   // Sommeil→séance, séance→eau, nutrition→coaching
  | 'letter_j30'           // Lettre personnelle J30
  | 'all_badges'           // 18 badges (gratuit = 3 premiers)
  | 'express_modes'        // Mode Express 5/10/15
  | 'cycle_mode'           // Mode Cycle menstruel
  | 'voyage_mode'          // Mode Voyage
  | 'photo_scan'           // Scan photo IA
  | 'share_social'         // Partage réseaux sociaux (images)
  | 'shopping_list';       // Liste de courses

// Free limits
export const FREE_LIMITS = {
  sessionsPerDay: 1,
  recipesPerCategory: 3,
  searchResults: 5,
  badgesVisible: 3,
};

interface FreemiumState {
  isPremium: boolean;
  trialStartDate: string | null;
  trialDaysTotal: number;
  plan: PlanType;
  trialDaysRemaining: number;
  trialExpired: boolean;
  sessionsToday: number;
  lastSessionCountDate: string | null;

  startTrial: () => void;
  setTrialStartFromFirebase: (date: string) => void;
  setPremium: (plan: PlanType) => void;
  cancelPremium: () => void;
  computeTrialStatus: () => void;
  simulateTrialEnd: () => void;
  canAccess: (feature: PremiumFeature) => boolean;
  incrementSessionCount: () => boolean; // returns false if limit reached
  getTrialDaysRemaining: () => number;
}

export const useFreemiumStore = create<FreemiumState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      trialStartDate: null,
      trialDaysTotal: 7,
      plan: 'free',
      trialDaysRemaining: 7,
      trialExpired: false,
      sessionsToday: 0,
      lastSessionCountDate: null,

      startTrial: () => {
        const today = new Date().toISOString();
        set({ trialStartDate: today, isPremium: true, trialDaysRemaining: 7 });
      },

      setTrialStartFromFirebase: (date: string) => {
        // Override local trial date with Firebase date to prevent reinstall abuse
        set({ trialStartDate: date });
      },

      setPremium: (plan) => set({ isPremium: true, plan, trialExpired: false }),

      cancelPremium: () => set({ isPremium: false, plan: 'free' }),

      // For testing: simulate trial expiry
      simulateTrialEnd: () => set({
        isPremium: false,
        plan: 'free',
        trialExpired: true,
        trialDaysRemaining: 0,
        trialStartDate: '2020-01-01T00:00:00.000Z', // Force old date
      }),

      computeTrialStatus: () => {
        const { trialStartDate, plan } = get();
        if (plan !== 'free') return;
        if (!trialStartDate) return;
        const start = new Date(trialStartDate).getTime();
        const now = Date.now();
        const daysPassed = Math.floor((now - start) / 86400000);
        const remaining = Math.max(0, 7 - daysPassed);
        set({
          trialDaysRemaining: remaining,
          trialExpired: remaining <= 0,
          isPremium: remaining > 0,
        });
      },

      canAccess: (feature) => {
        const { isPremium } = get();
        if (isPremium) return true;
        // Free users have NO premium features
        return false;
      },

      incrementSessionCount: () => {
        const { isPremium, sessionsToday, lastSessionCountDate } = get();
        if (isPremium) return true;

        const today = new Date().toISOString().split('T')[0];
        const currentCount = lastSessionCountDate === today ? sessionsToday : 0;

        if (currentCount >= FREE_LIMITS.sessionsPerDay) return false;

        set({
          sessionsToday: currentCount + 1,
          lastSessionCountDate: today,
        });
        return true;
      },

      getTrialDaysRemaining: () => get().trialDaysRemaining,
    }),
    {
      name: 'calibodi-freemium',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.computeTrialStatus();
      },
    }
  )
);
