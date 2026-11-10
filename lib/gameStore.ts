import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  condition: string;
  xp: number;
  unlocked: boolean;
  unlockedDate: string | null;
}

const BADGES_TEMPLATE: Omit<Badge, 'unlocked' | 'unlockedDate'>[] = [
  { id: 'first_step', name: 'Premier pas', icon: '👟', condition: '1ère séance', xp: 50 },
  { id: 'on_fire', name: 'En feu', icon: '🔥', condition: 'Streak 3j', xp: 75 },
  { id: 'perfect_week', name: 'Sem. parfaite', icon: '⚡', condition: 'Streak 7j', xp: 150 },
  { id: 'iron_month', name: 'Mois de fer', icon: '🏆', condition: 'Streak 30j', xp: 500 },
  { id: 'hydrated', name: 'Hydraté', icon: '💧', condition: 'Objectif eau 7j', xp: 75 },
  { id: 'ten_sessions', name: '10 séances', icon: '💪', condition: '10 séances', xp: 150 },
  { id: 'thirty_sessions', name: '30 séances', icon: '🏋️', condition: '30 séances', xp: 400 },
  { id: 'inspiring', name: 'Inspirant', icon: '📱', condition: 'Premier partage', xp: 30 },
  { id: 'warrior', name: 'Guerrier', icon: '🦾', condition: '30 séances + blessure', xp: 100 },
  { id: 'early_bird', name: 'Lève-tôt', icon: '🌅', condition: 'Séance avant 8h', xp: 75 },
  { id: 'nutritionist', name: 'Nutritionniste', icon: '🥗', condition: 'Journal 7 jours', xp: 100 },
  { id: 'sleep_king', name: 'Roi du sommeil', icon: '🌙', condition: 'Sommeil logué 7 nuits', xp: 75 },
  { id: 'comeback', name: 'Le Retour', icon: '💫', condition: 'Retour après 7j', xp: 60 },
  { id: 'explorer', name: 'Explorateur', icon: '🗺️', condition: 'Toutes pages visitées', xp: 100 },
  { id: 'personal_record', name: 'Record perso', icon: '🚀', condition: 'Nouveau record', xp: 80 },
  { id: 'level_10', name: 'Niveau 10', icon: '⭐', condition: 'Niveau 10 atteint', xp: 200 },
  { id: 'nomad', name: 'Nomade', icon: '✈️', condition: 'Séance mode voyage', xp: 50 },
  { id: 'harmony', name: 'En Harmonie', icon: '🌸', condition: 'Séance mode cycle', xp: 50 },
];

export interface BadgeHint {
  badge: Badge;
  message: string;
  progress: number; // 0-100
}

interface GameState {
  badges: Badge[];
  pagesVisited: string[];
  sharedOnce: boolean;

  unlockBadge: (id: string) => number;
  markShared: () => void;
  getNextBadgeHint: (context: {
    totalSessions: number;
    streak: number;
    hydrationStreak: number;
    nutritionStreak: number;
    sleepStreak: number;
    level: number;
    pagesVisited: number;
  }) => BadgeHint | null;
  checkBadges: (context: {
    totalSessions: number;
    streak: number;
    hasInjury: boolean;
    hydrationStreak: number;
    nutritionStreak: number;
    sleepStreak: number;
    level: number;
    usedVoyageMode: boolean;
    usedCycleMode: boolean;
    sessionHour: number;
    daysAbsent: number;
    bestSessionDuration?: number;
    currentSessionDuration?: number;
  }) => string[];
  visitPage: (page: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      badges: BADGES_TEMPLATE.map(b => ({ ...b, unlocked: false, unlockedDate: null })),
      pagesVisited: [],
      sharedOnce: false,

      markShared: () => set({ sharedOnce: true }),

      getNextBadgeHint: (ctx) => {
        const { badges } = get();
        const locked = badges.filter(b => !b.unlocked);
        if (locked.length === 0) return null;

        // Each candidate: { id, progress 0-100, message }
        const candidates: { id: string; progress: number; message: string }[] = [];

        const add = (id: string, current: number, target: number, msg: (rem: number) => string) => {
          if (badges.find(b => b.id === id)?.unlocked) return;
          const progress = Math.min(99, Math.round((current / target) * 100));
          if (progress > 0) candidates.push({ id, progress, message: msg(target - current) });
        };

        add('first_step', Math.min(ctx.totalSessions, 1), 1, () => 'Lance ta première séance !');
        add('on_fire', ctx.streak, 3, (r) => `Plus que ${r} jour${r > 1 ? 's' : ''} de streak pour 🔥 En feu`);
        add('perfect_week', ctx.streak, 7, (r) => `Plus que ${r} jour${r > 1 ? 's' : ''} de streak pour ⚡ Semaine parfaite`);
        add('iron_month', ctx.streak, 30, (r) => `${r} jours restants pour 🏆 Mois de fer`);
        add('hydrated', ctx.hydrationStreak, 7, (r) => `Plus que ${r} jour${r > 1 ? 's' : ''} d'objectif eau pour 💧 Hydraté`);
        add('ten_sessions', ctx.totalSessions, 10, (r) => `Plus que ${r} séance${r > 1 ? 's' : ''} pour 💪 10 séances`);
        add('thirty_sessions', ctx.totalSessions, 30, (r) => `${r} séances pour 🏋️ 30 séances`);
        add('nutritionist', ctx.nutritionStreak, 7, (r) => `Plus que ${r} jour${r > 1 ? 's' : ''} de journal nutrition pour 🥗 Nutritionniste`);
        add('sleep_king', ctx.sleepStreak, 7, (r) => `Plus que ${r} nuit${r > 1 ? 's' : ''} loguées pour 🌙 Roi du sommeil`);
        add('explorer', ctx.pagesVisited, 7, (r) => `Explore encore ${r} section${r > 1 ? 's' : ''} pour 🗺️ Explorateur`);
        add('level_10', ctx.level, 10, (r) => `Niveau ${ctx.level} → encore ${r} niveau${r > 1 ? 'x' : ''} pour ⭐ Niveau 10`);

        if (candidates.length === 0) return null;
        // Pick the one with highest progress (closest to unlocking)
        candidates.sort((a, b) => b.progress - a.progress);
        const best = candidates[0];
        const badge = badges.find(b => b.id === best.id)!;
        return { badge, message: best.message, progress: best.progress };
      },

      unlockBadge: (id) => {
        const { badges } = get();
        const badge = badges.find(b => b.id === id);
        if (!badge || badge.unlocked) return 0;
        set({
          badges: badges.map(b =>
            b.id === id ? { ...b, unlocked: true, unlockedDate: new Date().toISOString() } : b
          ),
        });
        return badge.xp;
      },

      checkBadges: (ctx) => {
        const { badges, unlockBadge, pagesVisited, sharedOnce } = get();
        const newlyUnlocked: string[] = [];
        const tryUnlock = (id: string, condition: boolean) => {
          if (condition && !badges.find(b => b.id === id)?.unlocked) {
            unlockBadge(id);
            newlyUnlocked.push(id);
          }
        };
        tryUnlock('first_step', ctx.totalSessions >= 1);
        tryUnlock('on_fire', ctx.streak >= 3);
        tryUnlock('perfect_week', ctx.streak >= 7);
        tryUnlock('iron_month', ctx.streak >= 30);
        tryUnlock('hydrated', ctx.hydrationStreak >= 7);
        tryUnlock('ten_sessions', ctx.totalSessions >= 10);
        tryUnlock('thirty_sessions', ctx.totalSessions >= 30);
        tryUnlock('inspiring', sharedOnce);
        tryUnlock('warrior', ctx.totalSessions >= 30 && ctx.hasInjury);
        tryUnlock('early_bird', ctx.sessionHour < 8);
        tryUnlock('nutritionist', ctx.nutritionStreak >= 7);
        tryUnlock('sleep_king', ctx.sleepStreak >= 7);
        tryUnlock('comeback', ctx.daysAbsent >= 7 && ctx.totalSessions > 0);
        tryUnlock('explorer', pagesVisited.length >= 7);
        tryUnlock('personal_record',
          ctx.bestSessionDuration !== undefined &&
          ctx.currentSessionDuration !== undefined &&
          ctx.currentSessionDuration > ctx.bestSessionDuration
        );
        tryUnlock('level_10', ctx.level >= 10);
        tryUnlock('nomad', ctx.usedVoyageMode);
        tryUnlock('harmony', ctx.usedCycleMode);
        return newlyUnlocked;
      },

      visitPage: (page) => {
        const { pagesVisited } = get();
        if (!pagesVisited.includes(page)) {
          set({ pagesVisited: [...pagesVisited, page] });
        }
      },
    }),
    {
      name: 'calibodi-game',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
    }
  )
);
