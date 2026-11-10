import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SleepEntry {
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;     // minutes
  quality: number;      // 1-5
  score: number;        // 0-100
  isNap?: boolean;      // true for sieste
}

interface SleepState {
  entries: SleepEntry[];
  streak: number;
  lastLogDate: string | null;
  idealBedTime: string;
  idealWakeTime: string;

  logSleep: (entry: Omit<SleepEntry, 'score'>) => void;
  removeEntry: (date: string) => void;
  getLatestScore: () => number;
  getRecoveryScore: () => number;
  getSleepDebt: () => number;
  shouldReduceIntensity: () => boolean;
  getIntensityReduction: () => number;
  getCalixMessage: () => string;
  getAverageScore: (days: number) => number;
}

function calculateSleepScore(duration: number, quality: number): number {
  let durationScore = 0;
  const hours = duration / 60;
  if (hours >= 7 && hours <= 9) durationScore = 50;
  else if (hours >= 6) durationScore = 35;
  else if (hours >= 5) durationScore = 20;
  else durationScore = 10;

  const qualityScore = (quality / 5) * 50;
  return Math.round(durationScore + qualityScore);
}

export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      entries: [],
      streak: 0,
      lastLogDate: null,
      idealBedTime: '23:00',
      idealWakeTime: '07:00',

      logSleep: (entry) => {
        const score = calculateSleepScore(entry.duration, entry.quality);
        const fullEntry: SleepEntry = { ...entry, score, isNap: (entry as any).isNap || false };
        const state = get();
        const today = entry.date;
        const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().split('T')[0];
        const newStreak = state.lastLogDate === yesterday ? state.streak + 1 : 1;

        set({
          entries: [...state.entries, fullEntry],
          streak: newStreak,
          lastLogDate: today,
        });
      },

      removeEntry: (date) => {
        set({ entries: get().entries.filter(e => e.date !== date) });
      },

      getLatestScore: () => {
        const { entries } = get();
        // Only night entries, not naps
        const nights = entries.filter(e => !e.isNap);
        if (nights.length === 0) return 70;
        return nights[nights.length - 1].score;
      },

      getRecoveryScore: () => {
        const { entries } = get();
        // Only night entries
        const nights = entries.filter(e => !e.isNap);
        if (nights.length === 0) return 70;
        const recent = nights.slice(-3);
        const avg = recent.reduce((sum, e) => sum + e.score, 0) / recent.length;
        return Math.round(avg);
      },

      getSleepDebt: () => {
        const { entries } = get();
        const recent = entries.slice(-14); // Look at last 2 weeks
        const idealHours = 7.5;
        
        // Calculate debt from NIGHTS only (not naps)
        const nights = recent.filter(e => !e.isNap);
        let debt = 0;
        for (const night of nights.slice(-7)) {
          const hours = night.duration / 60;
          debt += Math.max(0, idealHours - hours);
        }
        
        // Naps REDUCE debt
        const naps = recent.filter(e => e.isNap);
        const napHours = naps.reduce((s, n) => s + n.duration / 60, 0);
        debt = Math.max(0, debt - napHours);
        
        return Math.round(debt * 10) / 10;
      },

      shouldReduceIntensity: () => {
        const score = get().getLatestScore();
        return score < 55;
      },

      getIntensityReduction: () => {
        const score = get().getLatestScore();
        if (score >= 55) return 0;
        if (score >= 40) return 25;
        return 40;
      },

      getCalixMessage: () => {
        const score = get().getLatestScore();
        const debt = get().getSleepDebt();
        if (score >= 80) return '🌟 Super nuit ! Ton corps est prêt pour une séance intense.';
        if (score >= 55) return '👍 Sommeil correct. On maintient le programme.';
        if (debt > 5) return '😴 Tu accumules une dette de sommeil. On allège la séance et on privilégie la récupération.';
        return '⚠️ Ton sommeil est insuffisant. On réduit l\'intensité pour protéger ta progression.';
      },

      getAverageScore: (days) => {
        const { entries } = get();
        const nights = entries.filter(e => !e.isNap);
        const recent = nights.slice(-days);
        if (recent.length === 0) return 70;
        return Math.round(recent.reduce((s, e) => s + e.score, 0) / recent.length);
      },
    }),
    {
      name: 'calibodi-sleep',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
    }
  )
);
