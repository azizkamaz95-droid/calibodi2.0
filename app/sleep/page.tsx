'use client';
import { useState, useEffect } from 'react';
import { useSleepStore } from '@/lib/sleepStore';
import { useUserStore } from '@/lib/userStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useNutritionStore } from '@/lib/nutritionStore';
import { useGameStore } from '@/lib/gameStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { getTipOfDay, getPersonalizedTip, getSleepHabitAdvice, RECOVERY_TIPS } from '@/lib/recoveryTips';
import type { RecoveryTip } from '@/lib/recoveryTips';


import CalixCoach from '@/components/CalixCoach';
import PremiumLock from '@/components/PremiumLock';
import { Moon, Sun, Clock, Battery, AlertTriangle, Lock, PenLine, X as XIcon } from 'lucide-react';

// Flip card component
function FlipCard({ tip }: { tip: RecoveryTip }) {
  const [flipped, setFlipped] = useState(false);
  const catColors: Record<string, string> = {
    sommeil: '#BF5AF2', nutrition: '#00FF87', mental: '#00D4FF',
    mobilite: '#FF6B35', hydratation: '#00D4FF', habitudes: '#FF2D55', science: '#FF8C42',
  };
  const catLabels: Record<string, string> = {
    sommeil: '🌙 Sommeil', nutrition: '🥗 Nutrition', mental: '🧘 Mental',
    mobilite: '🤸 Mobilité', hydratation: '💧 Hydratation', habitudes: '🎯 Habitudes', science: '🔬 Science',
  };
  const color = catColors[tip.category] || '#FF6B35';

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer active:scale-[0.98] transition-all duration-300"
    >
      {!flipped ? (
        /* Front — Tap to reveal */
        <div className="rounded-2xl p-4 border" style={{ background: `${color}08`, borderColor: `${color}25` }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tip.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">{tip.title}</p>
              <p className="text-[10px] mt-0.5" style={{ color }}>{catLabels[tip.category]}</p>
            </div>
            <div className="text-[10px] text-cali-light-text bg-cali-surface px-2 py-1 rounded-lg animate-pulse">
              Tap 👆
            </div>
          </div>
        </div>
      ) : (
        /* Back — The fact */
        <div className="rounded-2xl p-4 border" style={{ background: `${color}12`, borderColor: `${color}35` }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{tip.icon}</span>
            <div>
              <p className="text-xs font-bold text-white mb-1">{tip.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: '#e0e0e0' }}>{tip.fact}</p>
            </div>
          </div>
          <p className="text-[9px] text-cali-light-text text-right mt-2 opacity-50">Tap pour fermer</p>
        </div>
      )}
    </div>
  );
}

export default function SleepPage() {
  const entries = useSleepStore((s) => s.entries);
  const streak = useSleepStore((s) => s.streak);
  const latestScore = useSleepStore((s) => s.getLatestScore());
  const sleepScore = latestScore;
  const recoveryScore = useSleepStore((s) => s.getRecoveryScore());
  const sleepDebt = useSleepStore((s) => s.getSleepDebt());
  const calixMsg = useSleepStore((s) => s.getCalixMessage());
  const shouldReduce = useSleepStore((s) => s.shouldReduceIntensity());
  const logSleep = useSleepStore((s) => s.logSleep);
  const removeEntry = useSleepStore((s) => s.removeEntry);
  const visitPage = useGameStore((s) => s.visitPage);
  const checkBadges = useGameStore((s) => s.checkBadges);
  const profile = useUserStore((s) => s.profile);
  const lastSessionDate = useUserStore((s) => s.lastSessionDate);
  const waterConsumed = useHydrationStore((s) => s.consumed);
  const waterGoal = useHydrationStore((s) => s.dailyGoal);
  const canAccessRecovery = useFreemiumStore((s) => s.isPremium);

  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(3);
  const [showLog, setShowLog] = useState(false);
  const [showNap, setShowNap] = useState(false);
  const [napDuration, setNapDuration] = useState(20);

  useEffect(() => { visitPage('sleep'); }, []);

  const calculateDuration = (bed: string, wake: string): number => {
    const [bH, bM] = bed.split(':').map(Number);
    const [wH, wM] = wake.split(':').map(Number);
    let bedMin = bH * 60 + bM;
    let wakeMin = wH * 60 + wM;
    if (wakeMin <= bedMin) wakeMin += 1440;
    return wakeMin - bedMin;
  };

  const handleLog = () => {
    const duration = calculateDuration(bedTime, wakeTime);
    const today = new Date().toISOString().split('T')[0];
    logSleep({ date: today, bedTime, wakeTime, duration, quality });
    setShowLog(false);
    const uStore = useUserStore.getState();
    const sleepEntries = useSleepStore.getState().entries ?? [];
    const sleepStreak = sleepEntries.filter((e: any) => !e.isNap).length;
    checkBadges({
      totalSessions: uStore.totalSessions, streak: uStore.streak,
      hasInjury: uStore.profile.injuries.length > 0,
      hydrationStreak: useHydrationStore.getState().streak,
      nutritionStreak: useNutritionStore.getState().streak,
      sleepStreak, level: uStore.level,
      usedVoyageMode: uStore.sessionHistory.some(s => s.mode === 'voyage'),
      usedCycleMode: uStore.sessionHistory.some(s => s.mode === 'cycle'),
      sessionHour: new Date().getHours(), daysAbsent: uStore.getDaysAbsent(),
    });
  };

  const durationHours = calculateDuration(bedTime, wakeTime) / 60;

  const scoreColor = latestScore >= 80 ? 'text-cali-green' : latestScore >= 55 ? 'text-cali-orange' : 'text-cali-red';

  return (
    <div className="pb-20 page-enter relative">
      
      <div className="relative z-10 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-black text-white">Récupération</h1>
          <div className="flex items-center gap-1.5 bg-cali-surface rounded-xl px-2.5 py-1">
            <Moon size={14} className="text-cali-purple" />
            <span className="text-xs font-bold text-white">{streak} nuits</span>
          </div>
        </div>

        <CalixCoach message={calixMsg} type={shouldReduce ? 'warning' : 'success'} />

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-cali-card rounded-2xl p-4 border border-white/5 text-center">
            <Moon size={18} className="text-cali-purple mx-auto mb-2" />
            <p className={`text-2xl font-bold ${scoreColor}`}>{latestScore}</p>
            <p className="text-[10px] text-gray-500">Score nuit</p>
          </div>
          <div className="bg-cali-card rounded-2xl p-4 border border-white/5 text-center">
            <Battery size={18} className="text-cali-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-cali-green">{recoveryScore}</p>
            <p className="text-[10px] text-gray-500">Récupération</p>
          </div>
          <div className="bg-cali-card rounded-2xl p-4 border border-white/5 text-center">
            <AlertTriangle size={18} className="text-cali-orange mx-auto mb-2" />
            <p className="text-2xl font-bold text-cali-orange">{sleepDebt}h</p>
            <p className="text-[10px] text-gray-500">Dette</p>
          </div>
        </div>

        {/* Impact on training */}
        {shouldReduce && (
          <div className="bg-cali-red/10 border border-cali-red/20 rounded-2xl p-3 text-center">
            <p className="text-xs text-cali-red font-medium">
              ⚠️ Sommeil insuffisant → Séance allégée automatiquement
            </p>
          </div>
        )}

        {/* Log Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setShowLog(true)}
            className="py-4 rounded-2xl bg-gradient-to-r from-cali-purple to-cali-blue text-white font-display font-bold glow-purple">
            <Moon size={18} className="inline mr-2" />Logger ma nuit
          </button>
          {canAccessRecovery ? (
            <button onClick={() => setShowNap(true)}
              className="py-4 rounded-2xl bg-cali-surface border border-cali-purple/30 text-cali-purple font-display font-bold">
              ☀️ Sieste
            </button>
          ) : (
            <PremiumLock feature="recovery_advanced" compact message="Sieste disponible en Premium">
              <div className="py-4 rounded-2xl bg-cali-surface border border-cali-purple/30 text-cali-purple font-display font-bold text-center text-sm">
                ☀️ Sieste
              </div>
            </PremiumLock>
          )}
        </div>

        {/* Sleep Habit Analysis — personalized based on history */}
        {canAccessRecovery && (() => {
          const habitAdvice = getSleepHabitAdvice(entries as any[]);
          if (habitAdvice.length === 0) return null;
          return (
            <div className="bg-cali-card rounded-2xl p-4 border border-purple-500/20 space-y-3">
              <p className="text-sm font-bold text-white">🔍 Analyse de tes habitudes</p>
              {habitAdvice.map((advice, i) => (
                <div key={i} className="bg-cali-surface rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{advice.icon}</span>
                    <p className="text-xs font-bold text-white">{advice.title}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-2">{advice.message}</p>
                  <p className="text-[11px] text-purple-300 font-medium">💜 {advice.action}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Sleep Coaching Tips — Dynamic cards */}
        {canAccessRecovery ? (
        <div className="bg-cali-card rounded-2xl p-4 border border-white/5">
          <p className="text-sm font-bold text-white mb-3">🧠 Savais-tu ?</p>
          <div className="space-y-3">
            {/* Tip of the day — Card flip */}
            {(() => {
              const tipOfDay = getTipOfDay();
              const personalTip = getPersonalizedTip({
                sleepScore: sleepScore || undefined,
                didSessionToday: lastSessionDate === new Date().toISOString().split('T')[0],
                streak,
                waterProgress: waterConsumed > 0 ? Math.round((waterConsumed / waterGoal) * 100) : 0,
                goal: profile.goal,
              });
              const tips = personalTip && personalTip.id !== tipOfDay.id ? [tipOfDay, personalTip] : [tipOfDay];
              return tips.map((tip) => (
                <FlipCard key={tip.id} tip={tip} />
              ));
            })()}
          </div>
          <p className="text-[10px] text-cali-light-text text-center mt-3 opacity-60">
            Nouveau conseil chaque jour
          </p>
        </div>
        ) : (
          <PremiumLock feature="recovery_advanced" message="Débloque les conseils sommeil, la sieste et le score de récupération avancé">
            <div className="bg-cali-card rounded-2xl p-4 border border-white/5">
              <p className="text-sm font-bold text-white mb-3">🧠 Conseils sommeil</p>
              <div className="space-y-2">
                <div className="bg-cali-surface rounded-xl p-3 h-12" />
                <div className="bg-cali-surface rounded-xl p-3 h-12" />
                <div className="bg-cali-surface rounded-xl p-3 h-12" />
              </div>
            </div>
          </PremiumLock>
        )}

        {/* History */}
        {entries.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-3 font-medium">DERNIÈRES NUITS</p>
            <div className="space-y-2">
              {[...entries].reverse().slice(0, 7).map((entry, i) => {
                const hours = Math.round(entry.duration / 60 * 10) / 10;
                const sc = entry.score >= 80 ? 'text-cali-green' : entry.score >= 55 ? 'text-cali-orange' : 'text-cali-red';
                const isNap = (entry as any).isNap;
                return (
                  <div key={i} className="bg-cali-card rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{isNap ? '☀️' : '🌙'}</span>
                        <p className="text-sm text-white font-medium">{entry.date}</p>
                      </div>
                      <p className="text-[10px] text-gray-500">
                        {isNap ? `Sieste ${entry.duration} min` : `${entry.bedTime} → ${entry.wakeTime} · ${hours}h · ${'⭐'.repeat(entry.quality)}`}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${sc}`}>{entry.score}</div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => {
                        if (isNap) {
                          setNapDuration(entry.duration);
                          removeEntry(entry.date);
                          setShowNap(true);
                        } else {
                          setBedTime(entry.bedTime);
                          setWakeTime(entry.wakeTime);
                          setQuality(entry.quality);
                          removeEntry(entry.date);
                          setShowLog(true);
                        }
                      }} className="w-7 h-7 rounded-lg bg-cali-surface flex items-center justify-center active:scale-90">
                        <PenLine size={12} className="text-cali-orange" />
                      </button>
                      <button onClick={() => {
                        if (confirm('Supprimer cette entrée ?')) removeEntry(entry.date);
                      }} className="w-7 h-7 rounded-lg bg-cali-red/10 flex items-center justify-center active:scale-90">
                        <XIcon size={12} className="text-cali-red" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLog && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowLog(false)}>
          <div className="w-full max-w-lg bg-cali-card rounded-t-3xl p-5 animate-slide-up space-y-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-display font-bold text-white text-center">Logger ma nuit</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cali-surface rounded-2xl p-4 text-center">
                <Moon size={18} className="text-cali-purple mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Coucher</p>
                <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)}
                  className="bg-transparent text-white text-lg font-bold text-center w-full focus:outline-none" />
              </div>
              <div className="bg-cali-surface rounded-2xl p-4 text-center">
                <Sun size={18} className="text-cali-orange mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Réveil</p>
                <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)}
                  className="bg-transparent text-white text-lg font-bold text-center w-full focus:outline-none" />
              </div>
            </div>

            <div className="text-center">
              <Clock size={16} className="text-cali-blue mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{Math.round(durationHours * 10) / 10}h de sommeil</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 text-center mb-3">Qualité du sommeil</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((q) => (
                  <button key={q} onClick={() => setQuality(q)}
                    className={`w-12 h-12 rounded-xl text-lg transition-all ${
                      quality >= q ? 'bg-cali-purple/20 border border-cali-purple/40' : 'bg-cali-surface border border-white/5'
                    }`}>
                    {quality >= q ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleLog}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cali-purple to-cali-blue text-white font-display font-bold">
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Nap Modal */}
      {showNap && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowNap(false)}>
          <div className="w-full max-w-lg bg-cali-card rounded-t-3xl p-5 animate-slide-up space-y-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-display font-bold text-white text-center">☀️ Logger une sieste</h3>
            <div className="bg-cali-surface rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Durée de la sieste</p>
              <p className="text-4xl font-display font-black text-cali-purple">{napDuration} min</p>
              <input type="range" min="5" max="120" step="5" value={napDuration} onChange={e => setNapDuration(Number(e.target.value))} className="w-full accent-cali-purple mt-3" />
              <div className="flex justify-between mt-1">
                {[10, 20, 30, 45, 60].map(d => (
                  <button key={d} onClick={() => setNapDuration(d)} className={`text-[10px] px-2 py-1 rounded-lg ${napDuration === d ? 'bg-cali-purple/20 text-cali-purple' : 'text-gray-600'}`}>{d}min</button>
                ))}
              </div>
            </div>
            <div className="bg-cali-purple/5 border border-cali-purple/20 rounded-xl p-3">
              <p className="text-[11px] text-gray-300">💡 {napDuration <= 20 ? 'Sieste idéale ! 20 minutes suffisent pour booster ta vigilance de 34%.' : napDuration <= 30 ? 'Bonne durée. Tu restes en sommeil léger.' : 'Attention : au-delà de 30 min tu risques d\'entrer en sommeil profond et de te réveiller groggy.'}</p>
            </div>
            <button onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              logSleep({ date: today, bedTime: 'sieste', wakeTime: 'sieste', duration: napDuration, quality: 4, isNap: true } as any);
              setShowNap(false);
            }} className="w-full py-4 rounded-2xl bg-gradient-to-r from-cali-purple to-cali-blue text-white font-display font-bold">
              Enregistrer la sieste
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
