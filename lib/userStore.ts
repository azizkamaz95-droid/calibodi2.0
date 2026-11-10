import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InjuryZone, Difficulty } from './exerciseLibrary';

export type Gender = 'male' | 'female' | 'other';
export type Goal = 'weight_loss' | 'muscle' | 'endurance' | 'health';
export type SessionMode = 'normal' | 'voyage' | 'fatigue' | 'express' | 'cycle';
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
export type FeedbackLevel = 'easy' | 'normal' | 'hard';
export type DietaryPref = 'none' | 'vegetarian' | 'vegan' | 'lactose_free' | 'gluten_free' | 'tayyibat';
export type ExpressDuration = 5 | 10 | 15;

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  goal: Goal;
  weight: number;
  height: number;
  targetWeight: number;
  sessionsPerWeek: number;
  level: Difficulty;
  injuries: InjuryZone[];
  programDuration: 30 | 60 | 90;
  personalLetter: string;
  // New fields
  limitations: string[];        // physical limitations
  chronicPain: string[];        // chronic pain zones
  dietaryPrefs: DietaryPref[];
  allergies: string[];
}

export interface SessionResult {
  id: string;
  date: string;
  duration: number;
  calories: number;
  exerciseCount: number;
  mode: SessionMode;
  feedback: FeedbackLevel;
  energyLevel: number;
  exercises?: string[];
}

export interface Mensuration {
  date: string;
  waist: number;      // tour de taille cm
  chest: number;      // poitrine cm
  arms: number;       // bras cm
  thighs: number;     // cuisses cm
  hips: number;       // hanches cm
}

export interface ProgressPhoto {
  id: string;
  date: string;
  dataUrl: string;    // base64
  type: 'front' | 'side' | 'back';
}

export interface CycleEntry {
  startDate: string;
  cycleLength: number;  // typical cycle length in days
}

export interface WeeklyRecap {
  weekStart: string;
  sessions: number;
  totalMinutes: number;
  totalCalories: number;
  avgSleepScore: number;
  avgHydration: number;
  nutritionScore: number;
  streakDays: number;
}

interface UserState {
  onboardingComplete: boolean;
  profile: UserProfile;
  currentMode: SessionMode;
  cyclePhase: CyclePhase;
  cycleEntries: CycleEntry[];
  expressDuration: ExpressDuration;
  streak: number;
  lastSessionDate: string | null;
  totalSessions: number;
  sessionHistory: SessionResult[];
  xp: number;
  level: number;
  dailyScore: number;
  mensurations: Mensuration[];
  photos: ProgressPhoto[];
  letterUnlocked: boolean;
  favoriteRecipeIds: string[];
  favoriteFoodIds: number[];
  recentFoodIds: number[];
  weeklyRecaps: WeeklyRecap[];
  emotionalMomentsShown: string[];
  lastActiveDate: string | null;
  programStartDate: string | null;
  weightHistory: { date: string; weight: number }[];

  // Notifications preferences
  notifHydration: boolean;
  notifNutrition: boolean;
  notifSleep: boolean;
  notifTraining: boolean;
  notifMotivation: boolean;
  notifSleepTime: string;  // "22:30"
  notifWakeTime: string;

  setOnboardingComplete: (v: boolean) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  setCurrentMode: (m: SessionMode) => void;
  setCyclePhase: (p: CyclePhase) => void;
  setExpressDuration: (d: ExpressDuration) => void;
  addSessionResult: (r: SessionResult) => void;
  addXP: (amount: number) => void;
  setDailyScore: (s: number) => void;
  addMensuration: (m: Omit<Mensuration, 'date'>) => void;
  addPhoto: (p: Omit<ProgressPhoto, 'id' | 'date'>) => void;
  removePhoto: (id: string) => void;
  addCycleEntry: (e: CycleEntry) => void;
  getCurrentCyclePhase: () => CyclePhase;
  getCurrentCycleDay: () => number;
  toggleFavoriteRecipe: (id: string) => void;
  toggleFavoriteFood: (id: number) => void;
  addRecentFood: (id: number) => void;
  getDaysAbsent: () => number;
  getDaysSinceStart: () => number;
  checkLetterUnlock: () => boolean;
  markEmotionalMoment: (id: string) => void;
  addWeightEntry: (weight: number) => void;
  hasShownMoment: (id: string) => boolean;
  generateWeeklyRecap: (data: Omit<WeeklyRecap, 'weekStart'>) => void;
  updateNotifPrefs: (prefs: Partial<{notifHydration:boolean;notifNutrition:boolean;notifSleep:boolean;notifTraining:boolean;notifMotivation:boolean;notifSleepTime:string;notifWakeTime:string}>) => void;
  resetStore: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  gender: 'male',
  age: 25,
  goal: 'health',
  weight: 70,
  height: 175,
  targetWeight: 70,
  sessionsPerWeek: 3,
  level: 'beginner',
  injuries: [],
  programDuration: 30,
  personalLetter: '',
  limitations: [],
  chronicPain: [],
  dietaryPrefs: [],
  allergies: [],
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      profile: { ...defaultProfile },
      currentMode: 'normal',
      cyclePhase: 'follicular',
      cycleEntries: [],
      expressDuration: 15,
      streak: 0,
      lastSessionDate: null,
      totalSessions: 0,
      sessionHistory: [],
      xp: 0,
      level: 1,
      dailyScore: 75,
      mensurations: [],
      photos: [],
      letterUnlocked: false,
      favoriteRecipeIds: [],
      favoriteFoodIds: [],
      recentFoodIds: [],
      weeklyRecaps: [],
      emotionalMomentsShown: [],
      lastActiveDate: null,
      programStartDate: null,
      weightHistory: [],
      notifHydration: true,
      notifNutrition: true,
      notifSleep: true,
      notifTraining: true,
      notifMotivation: true,
      notifSleepTime: '22:30',
      notifWakeTime: '07:00',

      setOnboardingComplete: (v) => set({ onboardingComplete: v, programStartDate: new Date().toISOString().split('T')[0] }),
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setCurrentMode: (m) => set({ currentMode: m }),
      setCyclePhase: (p) => set({ cyclePhase: p }),
      setExpressDuration: (d) => set({ expressDuration: d }),

      addSessionResult: (r) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = state.lastSessionDate === yesterday || state.lastSessionDate === today
          ? state.streak + (state.lastSessionDate === today ? 0 : 1) : 1;
        set({
          sessionHistory: [...state.sessionHistory, r],
          totalSessions: state.totalSessions + 1,
          lastSessionDate: today,
          lastActiveDate: today,
          streak: newStreak,
        });
      },

      addXP: (amount) => {
        const state = get();
        const newXP = state.xp + amount;
        set({ xp: newXP, level: Math.floor(newXP / 200) + 1 });
      },

      setDailyScore: (s) => set({ dailyScore: s }),

      addMensuration: (m) => {
        const date = new Date().toISOString().split('T')[0];
        set((s) => ({ mensurations: [...s.mensurations, { ...m, date }] }));
      },

      addPhoto: (p) => {
        const id = `photo_${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        set((s) => ({ photos: [...s.photos, { ...p, id, date }] }));
      },

      removePhoto: (id) => set((s) => ({ photos: s.photos.filter(p => p.id !== id) })),

      addCycleEntry: (e) => set((s) => ({ cycleEntries: [...s.cycleEntries, e] })),

      getCurrentCyclePhase: () => {
        const { cycleEntries } = get();
        if (cycleEntries.length === 0) return 'follicular';
        const last = cycleEntries[cycleEntries.length - 1];
        const daysSince = Math.floor((Date.now() - new Date(last.startDate).getTime()) / 86400000);
        const dayInCycle = daysSince % (last.cycleLength || 28);
        if (dayInCycle <= 5) return 'menstrual';
        if (dayInCycle <= 13) return 'follicular';
        if (dayInCycle <= 16) return 'ovulation';
        return 'luteal';
      },

      getCurrentCycleDay: () => {
        const { cycleEntries } = get();
        if (cycleEntries.length === 0) return 1;
        const last = cycleEntries[cycleEntries.length - 1];
        const daysSince = Math.floor((Date.now() - new Date(last.startDate).getTime()) / 86400000);
        return (daysSince % (last.cycleLength || 28)) + 1;
      },

      toggleFavoriteRecipe: (id) => set((s) => ({
        favoriteRecipeIds: s.favoriteRecipeIds.includes(id)
          ? s.favoriteRecipeIds.filter(r => r !== id)
          : [...s.favoriteRecipeIds, id],
      })),

      toggleFavoriteFood: (id) => set((s) => ({
        favoriteFoodIds: s.favoriteFoodIds.includes(id)
          ? s.favoriteFoodIds.filter(f => f !== id)
          : [...s.favoriteFoodIds, id],
      })),

      addRecentFood: (id) => set((s) => ({
        recentFoodIds: [id, ...s.recentFoodIds.filter(f => f !== id)].slice(0, 20),
      })),

      getDaysAbsent: () => {
        const { lastActiveDate } = get();
        if (!lastActiveDate) return 0;
        return Math.floor((Date.now() - new Date(lastActiveDate).getTime()) / 86400000);
      },

      getDaysSinceStart: () => {
        const { programStartDate } = get();
        if (!programStartDate) return 0;
        return Math.floor((Date.now() - new Date(programStartDate).getTime()) / 86400000);
      },

      checkLetterUnlock: () => {
        const days = get().getDaysSinceStart();
        if (days >= 30 && !get().letterUnlocked) {
          set({ letterUnlocked: true });
          return true;
        }
        return get().letterUnlocked;
      },

      markEmotionalMoment: (id) => set((s) => ({
        emotionalMomentsShown: [...s.emotionalMomentsShown, id],
      })),

      addWeightEntry: (weight) => {
        const today = new Date().toISOString().split('T')[0];
        set((s) => ({
          weightHistory: [...s.weightHistory.filter(w => w.date !== today), { date: today, weight }],
          profile: { ...s.profile, weight },
        }));
      },

      hasShownMoment: (id) => get().emotionalMomentsShown.includes(id),

      generateWeeklyRecap: (data) => {
        const weekStart = new Date().toISOString().split('T')[0];
        set((s) => ({ weeklyRecaps: [...s.weeklyRecaps, { ...data, weekStart }] }));
      },

      updateNotifPrefs: (prefs) => set((s) => ({ ...s, ...prefs })),

      resetStore: () => set({
        onboardingComplete: false,
        profile: { ...defaultProfile },
        currentMode: 'normal',
        streak: 0,
        lastSessionDate: null,
        totalSessions: 0,
        sessionHistory: [],
        xp: 0,
        level: 1,
        dailyScore: 75,
        mensurations: [],
        photos: [],
        letterUnlocked: false,
        favoriteRecipeIds: [],
        favoriteFoodIds: [],
        recentFoodIds: [],
        weeklyRecaps: [],
        emotionalMomentsShown: [],
        lastActiveDate: null,
        programStartDate: null,
        weightHistory: [],
      }),
    }),
    {
      name: 'calibodi-user',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
    }
  )
);
