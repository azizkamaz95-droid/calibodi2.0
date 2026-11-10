'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { useSleepStore } from '@/lib/sleepStore';
import { useGameStore } from '@/lib/gameStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { generateSession, estimateCalories } from '@/lib/calculations';
import type { SessionMode, CyclePhase, ExpressDuration } from '@/lib/userStore';


import { useHydrationStore } from '@/lib/hydrationStore';
import CalixCoach from '@/components/CalixCoach';
import { LockBadge } from '@/components/PremiumLock';
import { Play, Clock, Flame, Zap, Plane, Moon, Heart, ChevronRight, Timer, Lock, Droplets } from 'lucide-react';

const MODES: { id: SessionMode; icon: string; label: string; desc: string; lucide: any }[] = [
  { id: 'normal', icon: '💪', label: 'Normal', desc: 'Programme complet', lucide: Zap },
  { id: 'voyage', icon: '✈️', label: 'Voyage', desc: 'Sans équipement', lucide: Plane },
  { id: 'fatigue', icon: '😴', label: 'Fatigue', desc: '-40% volume', lucide: Moon },
  { id: 'express', icon: '⚡', label: 'Express', desc: '15 min max', lucide: Zap },
  { id: 'cycle', icon: '🌸', label: 'Cycle', desc: 'Adapté au cycle', lucide: Heart },
];

const CYCLE_PHASES: { id: CyclePhase; label: string; color: string }[] = [
  { id: 'menstrual', label: '🔴 Menstruelle', color: 'border-red-500/40 bg-red-500/10' },
  { id: 'follicular', label: '🟢 Folliculaire', color: 'border-green-500/40 bg-green-500/10' },
  { id: 'ovulation', label: '🟡 Ovulation', color: 'border-yellow-500/40 bg-yellow-500/10' },
  { id: 'luteal', label: '🟠 Lutéale', color: 'border-orange-500/40 bg-orange-500/10' },
];

export default function FitnessPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const currentMode = useUserStore((s) => s.currentMode);
  const setCurrentMode = useUserStore((s) => s.setCurrentMode);
  const cyclePhase = useUserStore((s) => s.cyclePhase);
  const setCyclePhase = useUserStore((s) => s.setCyclePhase);
  const sessionHistory = useUserStore((s) => s.sessionHistory);
  const sleepScore = useSleepStore((s) => s.getLatestScore());
  const expressDuration = useUserStore((s) => s.expressDuration);
  const setExpressDuration = useUserStore((s) => s.setExpressDuration);
  const isPremiumUser = useFreemiumStore((s) => s.isPremium);
  const incrementSessionCount = useFreemiumStore((s) => s.incrementSessionCount);
  const visitPage = useGameStore((s) => s.visitPage);
  const hydrationProgress = useHydrationStore((s) => s.getProgress());

  const [selectedMode, setSelectedMode] = useState<SessionMode>(currentMode);
  const [showCycle, setShowCycle] = useState(currentMode === 'cycle');

  const modeColors: Record<string, { bg: string; border: string }> = {
    normal: { bg: 'bg-cali-orange/5', border: 'border-cali-orange/20' },
    voyage: { bg: 'bg-cali-blue/5', border: 'border-cali-blue/20' },
    fatigue: { bg: 'bg-purple-500/5', border: 'border-purple-500/20' },
    express: { bg: 'bg-yellow-500/5', border: 'border-yellow-500/20' },
    cycle: { bg: 'bg-pink-500/5', border: 'border-pink-500/20' },
  };

  useEffect(() => { visitPage('fitness'); }, []);

  const lastSessionIds = useMemo(() =>
    sessionHistory.length > 0
      ? sessionHistory[sessionHistory.length - 1].exercises ?? []
      : undefined,
  [sessionHistory]);

  const session = useMemo(() => generateSession({
    level: profile.level,
    goal: profile.goal,
    injuries: profile.injuries,
    mode: selectedMode,
    cyclePhase: selectedMode === 'cycle' ? cyclePhase : undefined,
    sleepScore,
    lastFeedback: sessionHistory.length > 0 ? sessionHistory[sessionHistory.length - 1].feedback : undefined,
    previousExerciseIds: lastSessionIds,
    limitations: profile.limitations,
    chronicPain: profile.chronicPain,
    expressDuration: selectedMode === 'express' ? expressDuration : undefined,
    gender: profile.gender,
    weight: profile.weight,
    age: profile.age,
  }), [selectedMode, cyclePhase, sleepScore, profile, expressDuration, lastSessionIds]);

  const estimatedKcal = useMemo(() =>
    estimateCalories(session.main, session.totalDuration, profile.weight || 70),
  [session, profile.weight]);

  const weekSessionCount = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    return sessionHistory.filter(s => new Date(s.date) >= weekStart).length;
  }, [sessionHistory]);

  const handleModeSelect = (mode: SessionMode) => {
    if (mode !== 'normal' && !isPremiumUser) {
      router.push('/premium');
      return;
    }
    setSelectedMode(mode);
    setShowCycle(mode === 'cycle');
    setCurrentMode(mode);
  };

  const handleStartSession = () => {
    if (!incrementSessionCount()) {
      alert('Tu as atteint ta limite d\'1 séance par jour. Passe Premium pour des séances illimitées !');
      router.push('/premium');
      return;
    }
    // currentMode already set by handleModeSelect; navigate to session
    router.push('/session');
  };

  return (
    <div className="pb-20 page-enter relative">
      
      <div className="relative z-10 p-5 space-y-5">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Training</h1>
          <p className="text-xs text-cali-light-text mt-0.5">Séance adaptée · {session.totalDuration} min · {Math.round(session.intensityMultiplier * 100)}% intensité · ~{estimatedKcal} kcal</p>
          <p className="text-[10px] text-gray-600 mt-0.5">{weekSessionCount} / {profile.sessionsPerWeek} séances cette semaine</p>
        </div>

        {/* Hydration warning before session */}
        {hydrationProgress < 30 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-3 flex items-center gap-2">
            <Droplets size={16} className="text-cali-blue flex-shrink-0" />
            <p className="text-xs text-blue-300">⚠️ Tu n'as bu que {hydrationProgress}% de ton objectif eau. Hydrate-toi avant de commencer !</p>
          </div>
        )}

        {/* Calix message */}
        <CalixCoach message={session.calixMessage} type={sleepScore < 55 ? 'warning' : 'motivation'} />

        {/* Adaptation messages — personalized for injuries/limitations */}
        {session.adaptationMessages.length > 0 && (
          <div className="space-y-2">
            {session.adaptationMessages.map((msg, i) => (
              <div key={i} className="bg-cali-purple/5 border border-cali-purple/20 rounded-2xl p-3">
                <p className="text-xs text-gray-300 leading-relaxed">{msg}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mode Selection */}
        <div>
          <p className="text-xs text-gray-500 mb-3 font-medium">MODE DE SÉANCE</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ touchAction: 'pan-x pan-y' }}>
            {(profile.gender === 'female'
              ? [MODES[0], MODES[4], MODES[1], MODES[2], MODES[3]]
              : MODES.filter(m => m.id !== 'cycle')
            ).map((mode) => {
              const isLocked = mode.id !== 'normal' && !isPremiumUser;
              return (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl border transition-all relative ${
                  selectedMode === mode.id
                    ? 'bg-cali-orange/15 border-cali-orange/40 glow-orange'
                    : `${modeColors[mode.id]?.bg || 'bg-cali-surface'} ${modeColors[mode.id]?.border || 'border-white/5'}`
                } ${isLocked ? 'opacity-60' : ''}`}
              >
                <span className="text-lg">{mode.icon}</span>
                <p className={`text-xs font-bold mt-1 ${selectedMode === mode.id ? 'text-cali-orange' : 'text-gray-400'}`}>
                  {mode.label}
                </p>
                {isLocked && <div className="absolute -top-1.5 -right-1.5"><LockBadge /></div>}
              </button>
            );})}
          </div>
        </div>

        {/* Cycle Phase Selector */}
        {showCycle && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">PHASE DU CYCLE</p>
            <div className="grid grid-cols-2 gap-2">
              {CYCLE_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setCyclePhase(phase.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium transition-all ${
                    cyclePhase === phase.id ? phase.color : 'bg-cali-surface border-white/5 text-gray-500'
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Express Duration Selector */}
        {selectedMode === 'express' && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><Timer size={12} /> DURÉE EXPRESS</p>
            <div className="grid grid-cols-3 gap-2">
              {([5, 10, 15] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setExpressDuration(d)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    expressDuration === d ? 'bg-cali-orange/15 border-cali-orange/40 text-cali-orange' : 'bg-cali-surface border-white/5 text-gray-500'
                  }`}
                >
                  <p className="text-lg font-bold">{d}</p>
                  <p className="text-[10px]">min</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Session Preview */}
        <div className="relative bg-cali-card rounded-3xl p-5 border border-white/5 space-y-4">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cali-blue via-purple-500 to-transparent rounded-t-3xl" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-white">Ta séance</h2>
            <div className="flex gap-2">
              <div className="bg-cali-surface rounded-xl px-2.5 py-1 flex items-center gap-1">
                <Clock size={12} className="text-cali-blue" />
                <span className="text-xs text-gray-400">{session.totalDuration} min</span>
              </div>
              <div className="bg-cali-surface rounded-xl px-2.5 py-1 flex items-center gap-1">
                <Flame size={12} className="text-cali-orange" />
                <span className="text-xs text-gray-400">{Math.round(session.intensityMultiplier * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Exercise list */}
          <div className="space-y-2">
            <p className="text-[10px] text-cali-orange uppercase tracking-wider font-bold">🔥 Échauffement</p>
            {session.warmup.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 bg-cali-orange/5 border border-cali-orange/10 rounded-xl px-3 py-2">
                <span className="text-lg">🔥</span>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{ex.nameFr}</p>
                  <p className="text-[10px] text-gray-500">{ex.defaultDuration}s</p>
                </div>
              </div>
            ))}

            <p className="text-[10px] text-cali-blue uppercase tracking-wider font-bold mt-3">💪 Bloc principal</p>
            {session.main.map((ex, i) => (
              <div key={ex.id} className="flex items-center gap-3 bg-cali-blue/5 border border-cali-blue/10 rounded-xl px-3 py-2">
                <div className="w-7 h-7 rounded-lg bg-cali-blue/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-cali-blue">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{ex.nameFr}</p>
                  <p className="text-[10px] text-gray-500">
                    {ex.isTimeBased
                      ? `${Math.round(ex.defaultDuration * session.intensityMultiplier)}s`
                      : `${Math.max(1, Math.round(ex.defaultDuration * session.intensityMultiplier))} reps`} × {ex.defaultSets} séries
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-600" />
              </div>
            ))}

            <p className="text-[10px] text-purple-400 uppercase tracking-wider font-bold mt-3">🧘 Retour au calme</p>
            {session.cooldown.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 bg-purple-500/5 border border-purple-500/10 rounded-xl px-3 py-2">
                <span className="text-lg">🧘</span>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{ex.nameFr}</p>
                  <p className="text-[10px] text-gray-500">{ex.defaultDuration}s</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartSession}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold text-base flex items-center justify-center gap-3 glow-orange transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Play size={20} fill="white" />
          Commencer la séance
        </button>
      </div>

    </div>
  );
}
