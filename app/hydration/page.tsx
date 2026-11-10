'use client';
import { useEffect, useMemo } from 'react';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useGameStore } from '@/lib/gameStore';
import { useUserStore } from '@/lib/userStore';
import { useNutritionStore } from '@/lib/nutritionStore';

import CalixCoach from '@/components/CalixCoach';
import { Droplets, Plus, Flame, Trophy } from 'lucide-react';

const QUICK_ADD = [
  { label: '🥤 Verre', amount: 250 },
  { label: '🍶 Bouteille', amount: 500 },
  { label: '☕ Café', amount: 150 },
  { label: '🫖 Thé', amount: 200 },
];

export default function HydrationPage() {
  const consumed = useHydrationStore((s) => s.consumed);
  const dailyGoal = useHydrationStore((s) => s.dailyGoal);
  const streak = useHydrationStore((s) => s.streak);
  const bonusFromSession = useHydrationStore((s) => s.bonusFromSession);
  const entries = useHydrationStore((s) => s.entries);
  const addWater = useHydrationStore((s) => s.addWater);
  const progress = useHydrationStore((s) => s.getProgress());
  const visitPage = useGameStore((s) => s.visitPage);
  const checkBadges = useGameStore((s) => s.checkBadges);

  const handleAddWater = (amount: number) => {
    addWater(amount);
    const hStore = useHydrationStore.getState();
    const uStore = useUserStore.getState();
    checkBadges({
      totalSessions: uStore.totalSessions, streak: uStore.streak,
      hasInjury: uStore.profile.injuries.length > 0,
      hydrationStreak: hStore.streak,
      nutritionStreak: useNutritionStore.getState().streak,
      sleepStreak: 0, level: uStore.level,
      usedVoyageMode: uStore.sessionHistory.some(s => s.mode === 'voyage'),
      usedCycleMode: uStore.sessionHistory.some(s => s.mode === 'cycle'),
      sessionHour: new Date().getHours(), daysAbsent: uStore.getDaysAbsent(),
    });
  };

  useEffect(() => {
    visitPage('hydration');
    // Auto-reset if new day (addWater also resets, but user may not add water first)
    const today = new Date().toISOString().split('T')[0];
    if (useHydrationStore.getState().date !== today) {
      useHydrationStore.getState().resetDaily();
    }
  }, []);

  const remaining = Math.max(0, dailyGoal - consumed);

  const r = 80;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - progress / 100);

  const calixMsg = useMemo(() => {
    if (progress >= 100) return '💧 Bravo ! Tu as atteint ton objectif d\'hydratation !';
    if (progress >= 70) return '💧 Plus que quelques verres, tu y es presque !';
    if (progress >= 40) return '💧 Continue à boire régulièrement tout au long de la journée.';
    return '💧 Pense à boire ! L\'hydratation est essentielle pour tes performances.';
  }, [progress]);

  return (
    <div className="pb-20 page-enter">
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-black text-white">Hydratation</h1>
          <div className="flex items-center gap-1.5 bg-theme-surface rounded-xl px-2.5 py-1">
            <Flame size={14} className="text-cali-blue" />
            <span className="text-xs font-bold text-white">{streak}j</span>
          </div>
        </div>

        <CalixCoach message={calixMsg} type={progress >= 100 ? 'success' : 'info'} />

        {/* Progress Ring */}
        <div className="bg-theme-card rounded-3xl p-6 border border-theme flex flex-col items-center">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle cx="100" cy="100" r={r} fill="none" stroke="#00D4FF" strokeWidth="12"
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.4))' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets size={24} className="text-cali-blue mb-1" />
              <p className="text-3xl font-display font-black text-white">{consumed}</p>
              <p className="text-xs text-tertiary">/ {dailyGoal} ml</p>
            </div>
          </div>
          <p className="text-sm text-tertiary mt-3">{progress}% · Reste {remaining} ml</p>
        </div>

        {/* Session Bonus Notice */}
        {bonusFromSession > 0 && (
          <div className="bg-cali-orange/10 border border-cali-orange/20 rounded-2xl p-3 text-center">
            <p className="text-xs text-cali-orange font-medium">
              🏋️ +{bonusFromSession} ml ajoutés après ta séance
            </p>
          </div>
        )}

        {/* Quick Add Buttons */}
        <div>
          <p className="text-xs text-tertiary mb-3 font-medium">AJOUTER RAPIDEMENT</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ADD.map((item) => (
              <button
                key={item.label}
                onClick={() => handleAddWater(item.amount)}
                className="bg-theme-card rounded-2xl p-4 border border-theme flex items-center gap-3 transition-all hover:border-cali-blue/30 active:scale-[0.97]"
              >
                <span className="text-2xl">{item.label.split(' ')[0]}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">{item.label.split(' ')[1]}</p>
                  <p className="text-xs text-cali-blue">+{item.amount} ml</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Add */}
        <div className="flex gap-2">
          {[100, 200, 300, 500].map((ml) => (
            <button key={ml} onClick={() => handleAddWater(ml)}
              className="flex-1 py-3 rounded-xl bg-theme-surface border border-theme text-center transition-all hover:border-cali-blue/30 active:scale-[0.95]">
              <p className="text-sm font-bold text-cali-blue">+{ml}</p>
              <p className="text-[10px] text-tertiary">ml</p>
            </button>
          ))}
        </div>

        {/* Today Log */}
        {entries.length > 0 && (
          <div>
            <p className="text-xs text-tertiary mb-2 font-medium">HISTORIQUE DU JOUR</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {[...entries].reverse().map((entry, i) => (
                <div key={i} className="flex justify-between items-center bg-theme-surface rounded-xl px-3 py-2">
                  <span className="text-xs text-tertiary">
                    {new Date(entry.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-sm text-cali-blue font-medium">+{entry.amount} ml</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
