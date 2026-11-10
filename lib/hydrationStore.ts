import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface HydrationEntry {
  time: string;
  amount: number; // ml
}

interface HydrationState {
  dailyGoal: number;        // ml
  baseGoal: number;         // ml (before adjustments)
  consumed: number;         // ml today
  entries: HydrationEntry[];
  streak: number;
  lastGoalMetDate: string | null;
  bonusFromSession: number; // ml added post-session
  date: string;

  setBaseGoal: (weight: number, gender?: string) => void;
  addWater: (amount: number) => void;
  addSessionBonus: (isIntense: boolean) => void;
  resetDaily: () => void;
  getProgress: () => number;
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      dailyGoal: 2500,
      baseGoal: 2500,
      consumed: 0,
      entries: [],
      streak: 0,
      lastGoalMetDate: null,
      bonusFromSession: 0,
      date: new Date().toISOString().split('T')[0],

      setBaseGoal: (weight, gender) => {
        const mlPerKg = gender === 'female' ? 30 : 35;
        const base = Math.round(weight * mlPerKg);
        set({ baseGoal: base, dailyGoal: base });
      },

      addWater: (amount) => {
        const state = get();
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Auto-reset if new day
        if (state.date !== today) {
          set({
            consumed: 0,
            entries: [],
            bonusFromSession: 0,
            dailyGoal: state.baseGoal,
            date: today,
          });
        }

        const current = get();
        const newConsumed = current.consumed + amount;
        const entry: HydrationEntry = { time: now.toISOString(), amount };

        let newStreak = current.streak;
        let lastMet = current.lastGoalMetDate;
        if (newConsumed >= current.dailyGoal && current.consumed < current.dailyGoal) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          // Guard: if already met today, don't reset streak
          if (lastMet === today) {
            // streak already counted for today — no change
          } else {
            newStreak = lastMet === yesterday ? current.streak + 1 : 1;
            lastMet = today;
          }
        }

        set({
          consumed: newConsumed,
          entries: [...current.entries, entry],
          streak: newStreak,
          lastGoalMetDate: lastMet,
        });
      },

      addSessionBonus: (isIntense) => {
        const bonus = isIntense ? 500 : 300;
        const state = get();
        set({
          dailyGoal: state.baseGoal + bonus,
          bonusFromSession: bonus,
        });
      },

      resetDaily: () => {
        const state = get();
        set({
          consumed: 0,
          entries: [],
          bonusFromSession: 0,
          dailyGoal: state.baseGoal,
          date: new Date().toISOString().split('T')[0],
        });
      },

      getProgress: () => {
        const { consumed, dailyGoal } = get();
        return Math.min(100, Math.round((consumed / dailyGoal) * 100));
      },
    }),
    {
      name: 'calibodi-hydration',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
    }
  )
);
