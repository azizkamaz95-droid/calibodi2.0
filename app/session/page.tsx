'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { useSleepStore } from '@/lib/sleepStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useGameStore } from '@/lib/gameStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { generateSession, estimateCalories } from '@/lib/calculations';
import type { Exercise } from '@/lib/exerciseLibrary';
import type { FeedbackLevel } from '@/lib/userStore';
import { playStart, playEnd, playRest, playCountdown, playSessionComplete } from '@/services/audioService';
import { vibrateStart, vibrateSetEnd, vibrateSessionEnd, vibrateRestEnd } from '@/services/vibrationService';
import { initSpeech, setContext, setTotalExercises, stopSpeaking, enableSpeech, speakSessionStart, speakSetComplete, speakRestStart, speakSessionComplete, speakMotivation, speakAdaptationMessage, speakCountdown as speakCount, speakWarmupToMain, speakMainToCooldown, speakQuickName, speakSetAnnouncement, speakInjuryWarning, speakGoalTip, speak } from '@/services/speechService';
import { X, Play, Pause, SkipForward, Timer, Trophy, Flame, Share2, Lock } from 'lucide-react';
import { shareContent } from '@/components/ShareCard';

type Phase = 'ready' | 'exercise' | 'rest' | 'feedback' | 'complete';

export default function SessionPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const currentMode = useUserStore((s) => s.currentMode);
  const cyclePhase = useUserStore((s) => s.cyclePhase);
  const sessionHistory = useUserStore((s) => s.sessionHistory);
  const addSessionResult = useUserStore((s) => s.addSessionResult);
  const addXP = useUserStore((s) => s.addXP);
  const streak = useUserStore((s) => s.streak);
  const sleepScore = useSleepStore((s) => s.getLatestScore());
  const addSessionBonus = useHydrationStore((s) => s.addSessionBonus);
  const expressDuration = useUserStore((s) => s.expressDuration);
  const isPremiumUser = useFreemiumStore((s) => s.isPremium);
  const canAccessVoice = isPremiumUser;
  const checkBadges = useGameStore((s) => s.checkBadges);
  const visitPage = useGameStore((s) => s.visitPage);

  const lastSessionIds = sessionHistory.length > 0 ? sessionHistory[sessionHistory.length - 1].exercises ?? [] : undefined;

  const session = useMemo(() => generateSession({
    level: profile.level, goal: profile.goal, injuries: profile.injuries,
    mode: currentMode, cyclePhase: currentMode === 'cycle' ? cyclePhase : undefined,
    sleepScore, lastFeedback: sessionHistory.length > 0 ? sessionHistory[sessionHistory.length - 1].feedback : undefined,
    limitations: profile.limitations, chronicPain: profile.chronicPain,
    previousExerciseIds: lastSessionIds,
    expressDuration: currentMode === 'express' ? expressDuration : undefined,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currentMode, cyclePhase, sleepScore]);

  const allExercises = useMemo(() => [...session.warmup, ...session.main, ...session.cooldown], [session]);

  const [phase, setPhase] = useState<Phase>('ready');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // Force timer restart
  const [timerTotal, setTimerTotal] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackLevel>('normal');
  const [energyLevel, setEnergyLevel] = useState(7);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const wakeLockRef = useRef<any>(null);
  const phaseRef = useRef(phase);
  const exerciseIndexRef = useRef(exerciseIndex);
  const currentSetRef = useRef(currentSet);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const destroyedRef = useRef(false);
  const pausedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { visitPage('session'); }, []);

  // Keep pausedRef in sync
  useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);

  // ─── Auto-save session state for resume (on every change) ───
  useEffect(() => {
    if (phase === 'exercise' || phase === 'rest') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('calibodi-session-resume', JSON.stringify({
          exerciseIndex: exerciseIndexRef.current, currentSet: currentSetRef.current,
          mode: currentMode, elapsed, timestamp: Date.now(),
        }));
      }
    }
  }, [exerciseIndex, currentSet, phase, elapsed, currentMode]);

  // Safe setTimeout that tracks IDs, respects destroyed + paused flags
  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    if (destroyedRef.current) return;
    const id = setTimeout(() => {
      if (destroyedRef.current) return;
      // Si en pause, re-vérifier toutes les 500ms jusqu'à la reprise
      if (pausedRef.current) {
        const waitForResume = () => {
          if (destroyedRef.current) return;
          if (pausedRef.current) {
            const retryId = setTimeout(waitForResume, 500);
            timeoutsRef.current.push(retryId);
          } else {
            fn();
          }
        };
        const retryId = setTimeout(waitForResume, 500);
        timeoutsRef.current.push(retryId);
        return;
      }
      fn();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Kill everything: speech, intervals, timeouts
  const killAll = useCallback(() => {
    destroyedRef.current = true;
    stopSpeaking();
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  // Keep refs in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { exerciseIndexRef.current = exerciseIndex; }, [exerciseIndex]);
  useEffect(() => { currentSetRef.current = currentSet; }, [currentSet]);

  const currentExercise: Exercise | null = allExercises[exerciseIndex] || null;

  // ─── WAKE LOCK — Prevent screen sleep ───
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (e) { console.log('Wake Lock not available'); }
    };
    requestWakeLock();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLockRef.current) { wakeLockRef.current.release(); wakeLockRef.current = null; }
    };
  }, []);

  // ─── BACK BUTTON handler ───
  useEffect(() => {
    const handleBack = (e: PopStateEvent) => {
      e.preventDefault();
      if (phase === 'complete') { killAll(); router.push('/dashboard'); }
      else if (phase === 'ready') { killAll(); router.push('/fitness'); }
      else {
        if (confirm('Quitter la séance en cours ?')) {
          // Sauvegarder la progression pour reprise
          if (typeof window !== 'undefined') {
            localStorage.setItem('calibodi-session-resume', JSON.stringify({
              exerciseIndex: exerciseIndexRef.current, currentSet: currentSetRef.current,
              mode: currentMode, elapsed, timestamp: Date.now(),
            }));
          }
          killAll();
          router.push('/fitness');
        }
        else { window.history.pushState(null, '', window.location.href); }
      }
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBack);
    return () => window.removeEventListener('popstate', handleBack);
  }, [phase, elapsed]);

  // ─── CLEANUP on unmount: kill ALL speech, timers, timeouts ───
  useEffect(() => {
    return () => { killAll(); };
  }, [killAll]);

  // ─── Elapsed time ───
  useEffect(() => {
    startTimeRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ─── Timer countdown (FIXED — no timer in deps) ───
  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if ((phase === 'exercise' || phase === 'rest') && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 0) return 0; // Don't count below 0
          const next = prev - 1;
          if (next <= 5 && next > 0) { playCountdown(); speakCount(next); }
          if (next === 0) {
            // Timer finished — handle completion in next tick
            safeTimeout(() => {
              if (phaseRef.current === 'exercise') {
                handleSetCompleteDirect();
              } else if (phaseRef.current === 'rest') {
                vibrateRestEnd();
                playStart();
                startNextExercise();
              }
            }, 0);
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [phase, isPaused, timerKey]);

  const startNextExercise = async () => {
    const idx = exerciseIndexRef.current;
    const ex = allExercises[idx];
    if (!ex) return;
    const set = currentSetRef.current;
    const warmupEnd = session.warmup.length;
    const mainEnd = warmupEnd + session.main.length;
    const dur = ex.isTimeBased ? Math.round(ex.defaultDuration * session.intensityMultiplier) : ex.defaultDuration;

    if (set === 1) {
      // New exercise — phase transition if needed
      if (idx === warmupEnd) await speakWarmupToMain();
      else if (idx === mainEnd) await speakMainToCooldown();

      await speakQuickName(ex.nameFr, set === 1 && idx < mainEnd ? ex.instructions : [], ex.isTimeBased ? dur : 0);
    } else {
      // Next set — quick announcement
      await speakSetAnnouncement(set, ex.defaultSets);
    }

    // Timer starts NOW
    setPhase('exercise');
    setTimer(ex.isTimeBased ? dur : 0);
    setTimerTotal(ex.isTimeBased ? dur : 0);
    setTimerKey(k => k + 1); // Force timer restart
  };

  const startExerciseAtIndex = async (idx: number) => {
    const ex = allExercises[idx];
    if (!ex) return;
    setExerciseIndex(idx);
    setCurrentSet(1);

    const warmupEnd = session.warmup.length;
    const mainEnd = warmupEnd + session.main.length;
    const dur = ex.isTimeBased ? Math.round(ex.defaultDuration * session.intensityMultiplier) : ex.defaultDuration;
    // Phase transitions — quick announcement
    if (idx === warmupEnd) await speakWarmupToMain();
    else if (idx === mainEnd) await speakMainToCooldown();

    await speakQuickName(ex.nameFr, idx < mainEnd ? ex.instructions : [], ex.isTimeBased ? dur : 0);

    // Timer starts NOW — no waiting for explanations
    setPhase('exercise');
    setTimer(ex.isTimeBased ? dur : 0);
    setTimerTotal(ex.isTimeBased ? dur : 0);
    setTimerKey(k => k + 1); // Force timer restart

    const isInCooldown = idx >= mainEnd;
    const exerciseDuration = ex.isTimeBased ? dur : 30;

    // Injury warning during exercise
    if (exerciseDuration >= 25) {
      safeTimeout(() => speakInjuryWarning(ex.id), 8000);
    }

    // Goal tip every 3 exercises
    const isInMain = idx >= warmupEnd && idx < mainEnd;
    if (isInMain && idx % 3 === 0) {
      safeTimeout(() => speakGoalTip(), 15000);
    }
  };

  const handleSetCompleteDirect = () => {
    vibrateSetEnd();
    playEnd();
    const ex = allExercises[exerciseIndexRef.current];
    if (!ex) return;
    const set = currentSetRef.current;
    if (set < ex.defaultSets) {
      speakSetComplete(ex.defaultSets - set);
      setCurrentSet(s => s + 1);
      setPhase('rest');
      setTimer(ex.restBetweenSets);
      setTimerTotal(ex.restBetweenSets);
      setTimerKey(k => k + 1);
      playRest();
      speakRestStart(ex.restBetweenSets);
    } else {
      const nextIdx = exerciseIndexRef.current + 1;
      if (nextIdx < allExercises.length) {
        speakSetComplete(0);
        setExerciseIndex(nextIdx);
        setCurrentSet(1);
        setPhase('rest');
        setTimer(25);
        setTimerTotal(25);
        setTimerKey(k => k + 1);
        playRest();
        // Rest phrase (MP3) then next exercise name (MP3)
        speakRestStart(25).then(async () => {
          const nextEx = allExercises[nextIdx];
          if (nextEx) {
            await speak("Prochain exercice...");
            await speakQuickName(nextEx.nameFr, [], 0);
          }
        });
        if (nextIdx % 3 === 0) safeTimeout(() => speakMotivation(), 12000);
      } else {
        playSessionComplete();
        vibrateSessionEnd();
        const dur = Math.round((Date.now() - startTimeRef.current) / 60000);
        const cal = estimateCalories(session.main, dur, profile.weight);
        speakSessionComplete(dur, cal);
        setPhase('feedback');
      }
    }
  };

  const handleManualSetComplete = () => { handleSetCompleteDirect(); };

  const skipExercise = async () => {
    // Stop any ongoing speech
    await stopSpeaking();
    // Clear current timer
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setTimer(0);

    const nextIdx = exerciseIndex + 1;
    if (nextIdx < allExercises.length) {
      // Immediately update screen
      setExerciseIndex(nextIdx);
      setCurrentSet(1);
      setPhase('exercise');
      const ex = allExercises[nextIdx];
      if (ex) {
        const dur = ex.isTimeBased ? Math.round(ex.defaultDuration * session.intensityMultiplier) : ex.defaultDuration;
        setTimer(ex.isTimeBased ? dur : 0);
        setTimerTotal(ex.isTimeBased ? dur : 0);
        setTimerKey(k => k + 1); // Force timer useEffect to restart
        // Speech in background
        const warmupEnd2 = session.warmup.length;
        const mainEnd2 = warmupEnd2 + session.main.length;
        speakQuickName(ex.nameFr, nextIdx < mainEnd2 ? ex.instructions : [], ex.isTimeBased ? dur : 0);
      }
    } else {
      setPhase('feedback');
    }
  };

  const handleFinish = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('calibodi-session-resume');
    const durationMin = Math.round(elapsed / 60);
    const calories = estimateCalories(session.main, durationMin, profile.weight);
    addSessionResult({
      id: `session_${Date.now()}`, date: new Date().toISOString().split('T')[0],
      duration: durationMin, calories, exerciseCount: session.main.length,
      mode: currentMode, feedback, energyLevel,
      exercises: session.main.map(e => e.id),
    });
    addXP(50 + durationMin);
    addSessionBonus(session.intensityMultiplier > 0.8);

    // Check badges after session
    const store = useUserStore.getState();
    const hydStore = useHydrationStore.getState();
    const newTotalSessions = store.totalSessions; // already incremented by addSessionResult
    const bestDuration = store.sessionHistory.length > 1
      ? Math.max(...store.sessionHistory.slice(0, -1).map(s => s.duration))
      : 0;
    const getDaysAbsent = store.getDaysAbsent;
    checkBadges({
      totalSessions: newTotalSessions,
      streak: store.streak,
      hasInjury: store.profile.injuries.length > 0 || (store.profile.chronicPain?.length ?? 0) > 0,
      hydrationStreak: hydStore.streak,
      nutritionStreak: useUserStore.getState().sessionHistory.length, // approximate
      sleepStreak: 0,
      level: store.level,
      usedVoyageMode: currentMode === 'voyage' || store.sessionHistory.some(s => s.mode === 'voyage'),
      usedCycleMode: currentMode === 'cycle' || store.sessionHistory.some(s => s.mode === 'cycle'),
      sessionHour: new Date().getHours(),
      daysAbsent: getDaysAbsent(),
      bestSessionDuration: bestDuration,
      currentSessionDuration: durationMin,
    });

    setPhase('complete');
  };

  // ─── Check for resume data ───
  const [resumeData, setResumeData] = useState<{ exerciseIndex: number; currentSet: number; elapsed: number } | null>(null);
  const [isCalixTalking, setIsCalixTalking] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calibodi-session-resume');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // Only offer resume if less than 2 hours old and same mode
          if (data.mode === currentMode && Date.now() - data.timestamp < 2 * 60 * 60 * 1000) {
            setResumeData(data);
          } else {
            localStorage.removeItem('calibodi-session-resume');
          }
        } catch { localStorage.removeItem('calibodi-session-resume'); }
      }
    }
  }, [currentMode]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const progressPercent = ((exerciseIndex + (currentSet - 1) / (currentExercise?.defaultSets || 1)) / allExercises.length) * 100;

  // ─── READY ───
  if (phase === 'ready') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6 animate-bounce-in">💪</div>
        <h1 className="text-2xl font-display font-black text-white mb-2">Prêt ?</h1>
        <p className="text-sm text-gray-400 mb-2">{allExercises.length} exercices · ~{session.totalDuration} min</p>
        <p className="text-xs text-gray-600 mb-6">Intensité : {Math.round(session.intensityMultiplier * 100)}%</p>

        {/* Resume modal */}
        {resumeData && (
          <div className="w-full max-w-xs bg-cali-card rounded-2xl p-4 border border-cali-orange/20 mb-6 space-y-3">
            <p className="text-sm text-white font-bold">🔄 Séance en cours</p>
            <p className="text-xs text-cali-light-text">
              Tu t&apos;étais arrêté à l&apos;exercice {resumeData.exerciseIndex + 1}/{allExercises.length}
              {resumeData.elapsed > 0 && ` · ${formatTime(resumeData.elapsed)} écoulées`}
            </p>
            <div className="flex gap-2">
              <button onClick={async () => {
                localStorage.removeItem('calibodi-session-resume');
                destroyedRef.current = false;
                await initSpeech();
                enableSpeech(canAccessVoice);
                setContext({ name: profile.name, gender: profile.gender, goal: profile.goal, injuries: profile.injuries, limitations: profile.limitations || [], level: profile.level });
                setTotalExercises(allExercises.length);
                startTimeRef.current = Date.now() - (resumeData.elapsed * 1000);
                setElapsed(resumeData.elapsed);
                startExerciseAtIndex(resumeData.exerciseIndex);
                setResumeData(null);
              }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-bold text-xs">
                ▶️ Reprendre
              </button>

              <button onClick={() => { localStorage.removeItem('calibodi-session-resume'); setResumeData(null); }}
                className="flex-1 py-2.5 rounded-xl bg-cali-surface border border-white/10 text-cali-light-text text-xs font-bold">
                🔄 Recommencer
              </button>
            </div>
          </div>
        )}

        {!resumeData && (
          <>
            <button onClick={async () => {
              localStorage.removeItem('calibodi-session-resume');
              destroyedRef.current = false;
              await initSpeech();
              enableSpeech(canAccessVoice);
              setContext({ name: profile.name, gender: profile.gender, goal: profile.goal, injuries: profile.injuries, limitations: profile.limitations || [], level: profile.level });
              setTotalExercises(allExercises.length);
              playStart(); vibrateStart();
              setIsCalixTalking(true);
              await speakSessionStart(currentMode);
              setIsCalixTalking(false);
              startExerciseAtIndex(0);
              if (session.adaptationMessages.length > 0) {
                safeTimeout(() => speakAdaptationMessage(session.adaptationMessages[0]), 8000);
              }
            }}
              className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold text-lg glow-orange animate-pulse-glow">
              <Play size={20} className="inline mr-2" fill="white" />C&apos;est parti !
            </button>

            {/* Bouton passer l'intro de Calix */}
            {isCalixTalking && (
              <button onClick={async () => {
                await stopSpeaking();
                if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                setIsCalixTalking(false);
                startExerciseAtIndex(0);
              }}
                className="mt-3 w-full max-w-xs py-3 rounded-2xl bg-cali-surface border border-white/10 text-sm text-cali-light-text font-bold flex items-center justify-center gap-2">
                <SkipForward size={16} /> Passer à l&apos;exercice
              </button>
            )}
          </>
        )}

        <button onClick={() => router.push('/fitness')} className="mt-4 text-sm text-gray-600">Annuler</button>
      </div>
    );
  }

  // ─── FEEDBACK ───
  if (phase === 'feedback') {
    return (
      <div className="min-h-dvh flex flex-col p-6 justify-center">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-2xl font-display font-black text-white">Bien joué !</h1>
          <p className="text-sm text-gray-400 mt-2">{formatTime(elapsed)} · {allExercises.length} exercices</p>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 mb-3 text-center">Comment c&apos;était ?</p>
            <div className="grid grid-cols-3 gap-2">
              {([['easy','😎','Facile'],['normal','💪','Bien'],['hard','🥵','Dur']] as [FeedbackLevel,string,string][]).map(([f,icon,label])=>(
                <button key={f} onClick={()=>setFeedback(f)} className={`py-4 rounded-2xl text-center ${feedback===f?'bg-cali-blue/20 border border-cali-blue/40':'bg-cali-surface border border-white/5'}`}>
                  <span className="text-2xl">{icon}</span><p className="text-xs mt-1 text-gray-400">{label}</p></button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2 text-center">Énergie restante : {energyLevel}/10</p>
            <input type="range" min="1" max="10" value={energyLevel} onChange={e=>setEnergyLevel(Number(e.target.value))} className="w-full accent-cali-green" />
          </div>
          <button onClick={handleFinish} className="w-full py-4 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold glow-orange">Terminer</button>
        </div>
      </div>
    );
  }

  // ─── COMPLETE ───
  if (phase === 'complete') {
    const durationMin = Math.round(elapsed / 60);
    const calories = estimateCalories(session.main, durationMin, profile.weight);
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
        <h1 className="text-2xl font-display font-black text-white mb-6">Séance terminée !</h1>
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
          {[{i:Timer,v:`${durationMin} min`,l:'Durée',c:'text-cali-blue'},{i:Flame,v:`${calories}`,l:'Kcal',c:'text-cali-orange'},{i:Trophy,v:`+${50+durationMin}`,l:'XP',c:'text-cali-orange'}].map(s=>(
            <div key={s.l} className="bg-cali-card rounded-2xl p-4 border border-white/5"><s.i size={20} className={`${s.c} mx-auto mb-2`}/><p className={`text-lg font-bold ${s.c}`}>{s.v}</p><p className="text-[10px] text-gray-500">{s.l}</p></div>
          ))}
        </div>
        <button
          onClick={() => isPremiumUser ? shareContent('workout', { duration: durationMin, calories, exercises: session.main.length, streak }) : router.push('/premium')}
          className="w-full max-w-sm py-3 rounded-2xl bg-cali-surface border border-white/10 text-white font-bold flex items-center justify-center gap-2 mb-3"
        >
          {isPremiumUser ? <Share2 size={16} className="text-cali-blue" /> : <Lock size={16} className="text-cali-blue" />} Partager ma séance
        </button>
        <button onClick={()=>router.push('/dashboard')} className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold">Retour au Dashboard</button>
      </div>
    );
  }

  // ─── EXERCISE / REST ───
  return (
    <div className="min-h-dvh flex flex-col bg-cali-dark">
      <div className="px-4 pb-4 flex items-center justify-between" style={{paddingTop: 'max(1rem, env(safe-area-inset-top))'}}>
        <button onClick={() => { if(confirm('Quitter la séance ?')) { if (typeof window !== 'undefined') { localStorage.setItem('calibodi-session-resume', JSON.stringify({ exerciseIndex: exerciseIndexRef.current, currentSet: currentSetRef.current, mode: currentMode, elapsed, timestamp: Date.now() })); } killAll(); router.push('/fitness'); } }} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"><X size={18} className="text-gray-400"/></button>
        <span className="text-xs text-gray-500">{formatTime(elapsed)}</span>
        <span className="text-xs text-gray-500">{exerciseIndex+1}/{allExercises.length}</span>
      </div>
      <div className="px-4 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-600">{exerciseIndex + 1}/{allExercises.length} exercices</span>
          <span className="text-[10px] text-gray-600">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-cali-surface rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cali-blue via-cali-orange to-cali-red rounded-full transition-all duration-500" style={{width:`${progressPercent}%`}}/>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {phase === 'rest' ? (
          <>
            <p className="text-xs text-cali-blue uppercase tracking-widest mb-4 font-bold">⏸ Repos</p>
            {/* Circular timer — rest (blue) */}
            <div className="relative flex items-center justify-center mb-5">
              <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9"/>
                <circle cx="80" cy="80" r="68" fill="none"
                  stroke="#4FC3F7"
                  strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={timerTotal > 0 ? 2 * Math.PI * 68 * (1 - timer / timerTotal) : 0}
                  className="transition-all duration-1000 ease-linear"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(79,195,247,0.5))' }}/>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-display font-black text-white">{timer}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">sec</span>
              </div>
            </div>
            {currentSet > 1 ? (
              <div className="bg-cali-surface rounded-2xl px-5 py-3 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Prochain</p>
                <p className="text-base font-display font-bold text-white">Série {currentSet}/{currentExercise?.defaultSets}</p>
                <p className="text-xs text-cali-blue mt-0.5">{currentExercise?.nameFr}</p>
              </div>
            ) : (
              <div className="bg-cali-surface rounded-2xl px-5 py-3 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Prochain exercice</p>
                <p className="text-lg font-display font-bold text-white">{currentExercise?.nameFr}</p>
                <p className="text-xs text-cali-blue mt-0.5">
                  {currentExercise?.isTimeBased ? `${Math.round(currentExercise.defaultDuration * session.intensityMultiplier)}s` : `${Math.max(1, Math.round(currentExercise.defaultDuration * session.intensityMultiplier))} reps`} × {currentExercise?.defaultSets} séries
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Exercise video / Calix coaching */}
            <div className="relative mx-auto aspect-[9/16] w-[42vw] max-w-[180px] rounded-3xl bg-cali-surface overflow-hidden mb-4">
              <video ref={videoRef}
                key={currentExercise?.id}
                src={`/videos/${currentExercise?.video}`}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover object-top"
                onError={(e) => { const t=e.target as HTMLVideoElement; t.style.display='none'; if(t.parentElement) t.parentElement.innerHTML='<span class="text-6xl flex items-center justify-center h-full">🏋️</span>'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-cali-dark/80 via-transparent to-transparent"/>
            </div>

            <h2 className="text-xl font-display font-black text-white mb-1">{currentExercise?.nameFr}</h2>

            {/* Set dots */}
            <div className="flex gap-2 justify-center mb-3">
              {Array.from({ length: currentExercise?.defaultSets || 1 }).map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i < currentSet ? 'w-7 bg-cali-orange' : 'w-2 bg-cali-surface border border-white/10'}`} />
              ))}
            </div>

            {/* Circular timer — exercise (green → red) */}
            {currentExercise?.isTimeBased ? (
              <div className="relative flex items-center justify-center mb-3">
                <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                  <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9"/>
                  <circle cx="70" cy="70" r="58" fill="none"
                    stroke={timer <= 5 ? '#FF2D55' : '#00FF88'}
                    strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={timerTotal > 0 ? 2 * Math.PI * 58 * (1 - timer / timerTotal) : 0}
                    className="transition-all duration-1000 ease-linear"
                    style={{ filter: timer <= 5 ? 'drop-shadow(0 0 8px rgba(255,45,85,0.6))' : 'drop-shadow(0 0 8px rgba(0,255,136,0.4))' }}/>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-4xl font-display font-black ${timer <= 5 ? 'text-cali-red' : 'text-cali-green'}`}>{timer}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">sec</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-3">
                {Math.max(1, Math.round((currentExercise?.defaultDuration ?? 10) * session.intensityMultiplier))} reps · série {currentSet}/{currentExercise?.defaultSets}
              </p>
            )}

            <div className="text-left w-full max-w-xs space-y-1.5">
              {currentExercise?.instructions.slice(0, 2).map((inst,i)=>(
                <p key={i} className="text-xs text-gray-400 flex gap-2"><span className="text-cali-orange font-bold">{i+1}.</span>{inst}</p>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex items-center justify-center gap-4">
        <button onClick={skipExercise} className="w-14 h-14 rounded-full bg-cali-surface flex items-center justify-center"><SkipForward size={20} className="text-gray-400"/></button>
        {phase === 'exercise' && !currentExercise?.isTimeBased ? (
          <button onClick={handleManualSetComplete} className="w-20 h-20 rounded-full bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange flex items-center justify-center glow-orange">
            <span className="text-white font-bold text-sm">FAIT ✓</span></button>
        ) : (
          <button onClick={()=>{
            const newPaused = !isPaused;
            setIsPaused(newPaused);
            if (newPaused) {
              // PAUSE: cancel speech (pause() ne marche pas sur Android WebView) + pause video
              stopSpeaking();
              if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
              if (videoRef.current) videoRef.current.pause();
            } else {
              // RESUME: relancer video (le prochain speak se fera naturellement via safeTimeout)
              if (videoRef.current) videoRef.current.play().catch(() => {});
            }
          }} className="w-20 h-20 rounded-full bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange flex items-center justify-center glow-orange">
            {isPaused ? <Play size={28} fill="white" className="text-white"/> : <Pause size={28} className="text-white"/>}
          </button>
        )}
        <div className="w-14 h-14" />
      </div>
    </div>
  );
}
