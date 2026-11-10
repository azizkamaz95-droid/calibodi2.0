'use client';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useSleepStore } from '@/lib/sleepStore';
import { useNutritionStore } from '@/lib/nutritionStore';
import { useGameStore } from '@/lib/gameStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { useCalix } from '@/lib/useCalix';
import { calculateDailyScore, getDayMode } from '@/lib/calculations';
import { scheduleDailyNotifications } from '@/services/pushNotificationService';
import TrialBanner from '@/components/TrialBanner';
import DailyRing from '@/components/DailyRing';
import BodyStatsWidget from '@/components/BodyStatsWidget';
import { Dumbbell, Droplets, Moon, Utensils, Flame, Trophy, TrendingUp, ChevronRight, Sparkles, Share2, Lock, Volume2, VolumeX, Play, Zap } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getUserTrialStartDate, getUserPremiumUntil } from '@/lib/firebaseUserService';
import { shareContent } from '@/components/ShareCard';

/* ─── Calix Orb (compact) ────────────────────────────────────────────────── */
function CalixOrbSm({ speaking }: { speaking: boolean }) {
  return (
    <div className="relative w-10 h-10">
      {speaking && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: 'rgba(255,107,53,0.6)' }} />
      )}
      <div className="absolute inset-0 rounded-full"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f18 100%)', border: '1.5px solid rgba(255,107,53,0.35)', boxShadow: speaking ? '0 0 16px rgba(255,107,53,0.5)' : '0 0 8px rgba(255,107,53,0.15)' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="8" fill="none" stroke="rgba(255,107,53,0.35)" strokeWidth="1" />
          <circle cx="20" cy="20" r="8" fill="none" stroke="url(#o-g)" strokeWidth="1.5" strokeLinecap="round"
            strokeDasharray="50" strokeDashoffset="12"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', animation: speaking ? 'spin 2s linear infinite' : 'none' }} />
          <defs>
            <linearGradient id="o-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF2D55" /><stop offset="100%" stopColor="#FF6B35" /></linearGradient>
          </defs>
          <circle cx="20" cy="20" r="3" fill="url(#o-g)" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Sound wave bars ────────────────────────────────────────────────────── */
function SoundWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[1, 1.8, 1.4, 2, 1.2, 1.7, 1].map((h, i) => (
        <div key={i} className="w-0.5 rounded-full bg-cali-orange transition-all"
          style={{ height: active ? `${h * 8}px` : '3px', animation: active ? `sound-bar 0.8s ease-in-out ${i * 0.1}s infinite alternate` : 'none', opacity: active ? 1 : 0.3 }} />
      ))}
    </div>
  );
}

/* ─── TTS hook ───────────────────────────────────────────────────────────── */
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('calix_muted') === '1'; } catch { return false; }
  });

  const speak = useCallback(async (text: string) => {
    if (muted) return;
    setSpeaking(true);
    try {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      await TextToSpeech.speak({ text, lang: 'fr-FR', rate: 0.95, pitch: 1.0, volume: 1.0, category: 'ambient' });
    } catch {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = 'fr-FR'; utt.rate = 0.95;
        utt.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utt);
        return;
      }
    }
    setSpeaking(false);
  }, [muted]);

  const stop = useCallback(async () => {
    try {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      await TextToSpeech.stop();
    } catch {
      window.speechSynthesis?.cancel();
    }
    setSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m;
      try { localStorage.setItem('calix_muted', next ? '1' : '0'); } catch {}
      if (next) stop();
      return next;
    });
  }, [stop]);

  return { speak, stop, speaking, muted, toggleMute };
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();

  /* stores */
  const profile = useUserStore((s: any) => s.profile);
  const streak = useUserStore((s: any) => s.streak);
  const totalSessions = useUserStore((s: any) => s.totalSessions);
  const xp = useUserStore((s: any) => s.xp);
  const level = useUserStore((s: any) => s.level);
  const sessionHistory = useUserStore((s: any) => s.sessionHistory);
  const onboardingComplete = useUserStore((s: any) => s.onboardingComplete);
  const getDaysAbsent = useUserStore((s: any) => s.getDaysAbsent);
  const getDaysSinceStart = useUserStore((s: any) => s.getDaysSinceStart);
  const hasShownMoment = useUserStore((s: any) => s.hasShownMoment);
  const markEmotionalMoment = useUserStore((s: any) => s.markEmotionalMoment);
  const sleepScore = useSleepStore((s: any) => s.getLatestScore());
  const hydrationProgress = useHydrationStore((s: any) => s.getProgress());
  const nutritionTotals = useNutritionStore((s: any) => s.getTodayTotals());
  const nutritionGoalKcal = useNutritionStore((s: any) => s.dailyGoalKcal);
  const calixNutrition = useNutritionStore((s: any) => s.getCalixMessage());
  const calixSleep = useSleepStore((s: any) => s.getCalixMessage());
  const nutritionRemaining = useNutritionStore((s: any) => s.getRemaining());
  const nutritionStreak = useNutritionStore((s: any) => s.streak);
  const hydrationStreak = useHydrationStore((s: any) => s.streak);
  const sleepDebt = useSleepStore((s: any) => s.getSleepDebt());
  const sleepStreak = useSleepStore((s: any) => s.streak);
  const pagesVisited = useGameStore((s: any) => s.pagesVisited);
  const visitPage = useGameStore((s: any) => s.visitPage);
  const checkBadges = useGameStore((s: any) => s.checkBadges);
  const getNextBadgeHint = useGameStore((s: any) => s.getNextBadgeHint);
  const computeTrialStatus = useFreemiumStore((s: any) => s.computeTrialStatus);
  const isPremiumUser = useFreemiumStore((s: any) => s.isPremium);
  const notifHydration = useUserStore((s: any) => s.notifHydration);
  const notifNutrition = useUserStore((s: any) => s.notifNutrition);
  const notifSleep = useUserStore((s: any) => s.notifSleep);
  const notifTraining = useUserStore((s: any) => s.notifTraining);
  const notifMotivation = useUserStore((s: any) => s.notifMotivation);
  const notifSleepTime = useUserStore((s: any) => s.notifSleepTime);

  const [emotionalPopup, setEmotionalPopup] = useState<{ id: string; icon: string; title: string; msg: string } | null>(null);
  const { speak, stop, speaking, muted, toggleMute } = useTTS();
  const calix = useCalix();
  const autoSpokenRef = useRef(false);
  const [calixLLMMessage, setCalixLLMMessage] = useState('');

  /* ── Computed values ── */
  const daysAbsent = getDaysAbsent();
  const daysSinceStart = getDaysSinceStart();

  const calixMessage = useMemo(() => {
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bonjour' : 'Bonsoir';
    if (daysAbsent >= 7) return `${greet} ${profile.name} ! Content de te revoir. On reprend doucement, ton programme s'est adapté.`;
    if (daysAbsent >= 3) return `${greet} ${profile.name} ! Ça fait ${daysAbsent} jours. Pas de pression, une petite séance légère pour reprendre ?`;
    if (sleepScore < 55) {
      if (sleepDebt > 3) return `${greet} ${profile.name}. Tu as ${sleepDebt} heures de dette de sommeil. Je vais alléger ta séance aujourd'hui.`;
      return calixSleep || `${greet} ${profile.name}. Pense à bien récupérer ce soir.`;
    }
    if (hydrationProgress < 30) return `${greet} ${profile.name}. Commence par boire de l'eau. L'hydratation est la base de tout.`;
    return calixNutrition || `${greet} ${profile.name}. Prêt pour une excellente journée ?`;
  }, [daysAbsent, sleepScore, sleepDebt, hydrationProgress, calixSleep, calixNutrition, profile.name]);

  const calixType = daysAbsent >= 3 ? 'motivation' : sleepScore < 55 ? 'warning' : 'info';

  const movementScore = useMemo(() => {
    if (streak === 0) return totalSessions > 0 ? 15 : 0;
    return Math.min(100, Math.round(20 + streak * 8 + Math.sqrt(totalSessions) * 2));
  }, [totalSessions, streak]);
  const nutritionScore = useMemo(() => {
    if (nutritionTotals.kcal === 0) return 30;
    return Math.min(100, Math.round((nutritionTotals.kcal / nutritionGoalKcal) * 100));
  }, [nutritionTotals, nutritionGoalKcal]);
  const recoveryScore = useMemo(() => Math.round((sleepScore * 0.6) + (hydrationProgress * 0.4)), [sleepScore, hydrationProgress]);
  const dailyScore = calculateDailyScore(sleepScore, nutritionScore, movementScore, recoveryScore);
  const dayMode = getDayMode(dailyScore);

  const sessionDoneToday = useMemo(() => {
    const today = new Date().toDateString();
    return sessionHistory.some((s: any) => new Date(s.date).toDateString() === today);
  }, [sessionHistory]);

  const weekSessionCount = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    return sessionHistory.filter((s: any) => new Date(s.date) >= weekStart).length;
  }, [sessionHistory]);

  const badgeHint = useMemo(() => getNextBadgeHint({
    totalSessions, streak, hydrationStreak, nutritionStreak, sleepStreak, level, pagesVisited: pagesVisited.length,
  }), [totalSessions, streak, hydrationStreak, nutritionStreak, sleepStreak, level, pagesVisited]);

  const priorityAction = useMemo(() => {
    if (daysAbsent >= 3) return { icon: '💪', text: 'Reprends une séance légère', page: '/fitness', accent: 'rgba(255,107,53,0.15)', border: 'rgba(255,107,53,0.3)' };
    if (hydrationProgress < 30) return { icon: '💧', text: 'Pense à boire de l\'eau', page: '/nutrition', accent: 'rgba(0,120,255,0.1)', border: 'rgba(0,120,255,0.25)' };
    if (nutritionTotals.kcal === 0) return { icon: '🍽️', text: 'Logue ton premier repas', page: '/nutrition', accent: 'rgba(0,200,100,0.1)', border: 'rgba(0,200,100,0.25)' };
    if (sleepScore < 55) return { icon: '😴', text: 'Priorise ta récupération', page: '/sleep', accent: 'rgba(130,80,255,0.1)', border: 'rgba(130,80,255,0.25)' };
    if (sessionDoneToday) return { icon: '✅', text: 'Séance accomplie — récupère bien', page: '/sleep', accent: 'rgba(0,200,100,0.1)', border: 'rgba(0,200,100,0.25)' };
    return { icon: '🏋️', text: 'Lance ta séance du jour', page: '/fitness', accent: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.25)' };
  }, [daysAbsent, hydrationProgress, nutritionTotals, sleepScore, sessionDoneToday]);

  /* ── Init ── */
  const checkEmotionalMoments = () => {
    const moments = [
      { id: 'first_session', cond: totalSessions >= 1 && !hasShownMoment('first_session'), icon: '🎉', title: 'Première séance !', msg: 'Tu viens de franchir le premier pas. C\'est le plus important.' },
      { id: 'streak_3', cond: streak >= 3 && !hasShownMoment('streak_3'), icon: '🔥', title: '3 jours d\'affilée !', msg: 'Tu construis une habitude. Continue comme ça !' },
      { id: 'streak_7', cond: streak >= 7 && !hasShownMoment('streak_7'), icon: '⚡', title: 'Semaine parfaite !', msg: '7 jours consécutifs ! Ta discipline est impressionnante.' },
      { id: 'sessions_10', cond: totalSessions >= 10 && !hasShownMoment('sessions_10'), icon: '💪', title: '10 séances !', msg: 'Ton corps commence à changer. La régularité paie.' },
      { id: 'level_5', cond: level >= 5 && !hasShownMoment('level_5'), icon: '⭐', title: 'Niveau 5 !', msg: 'Tu progresses à une vitesse incroyable.' },
    ];
    const toShow = moments.find(m => m.cond);
    if (toShow) { setEmotionalPopup(toShow); markEmotionalMoment(toShow.id); useUserStore.getState().addXP(50); }
  };

  useEffect(() => {
    if (!onboardingComplete) { router.replace('/onboarding'); return; }
    const user = auth.currentUser;
    if (user && !user.emailVerified && user.email?.toLowerCase() !== 'azizkamaz95@gmail.com') {
      router.replace('/onboarding'); return;
    }
    visitPage('dashboard');
    if (user && user.email?.toLowerCase() !== 'azizkamaz95@gmail.com') {
      (async () => {
        try {
          const premiumUntil = await getUserPremiumUntil(user.uid);
          if (premiumUntil && new Date(premiumUntil) > new Date()) { useFreemiumStore.getState().setPremium('annual_once'); return; }
          const trialStart = await getUserTrialStartDate(user.uid);
          if (trialStart) useFreemiumStore.getState().setTrialStartFromFirebase(trialStart);
        } catch { /* offline */ }
        computeTrialStatus();
      })();
    } else { computeTrialStatus(); }
    checkEmotionalMoments();
    scheduleDailyNotifications({ hydration: notifHydration, nutrition: notifNutrition, sleep: notifSleep, training: notifTraining, motivation: notifMotivation, sleepTime: notifSleepTime }, profile.name);
    useUserStore.getState().setDailyScore(dailyScore);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Auto-speak once per day — Calix LLM opening message */
  useEffect(() => {
    if (autoSpokenRef.current) return;
    autoSpokenRef.current = true;
    const timer = setTimeout(async () => {
      try {
        const msg = await calix.openingMessage();
        if (msg) setCalixLLMMessage(msg);
      } catch {
        // fallback to static message
        speak(calixMessage);
      }
    }, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const uStore = useUserStore.getState();
    checkBadges({
      totalSessions: uStore.totalSessions, streak: uStore.streak,
      hasInjury: uStore.profile.injuries.length > 0,
      hydrationStreak: useHydrationStore.getState().streak,
      nutritionStreak: useNutritionStore.getState().streak,
      sleepStreak: useSleepStore.getState().entries?.filter((e: any) => !e.isNap).length ?? 0,
      level: uStore.level,
      usedVoyageMode: uStore.sessionHistory.some((s: any) => s.mode === 'voyage'),
      usedCycleMode: uStore.sessionHistory.some((s: any) => s.mode === 'cycle'),
      sessionHour: new Date().getHours(), daysAbsent: uStore.getDaysAbsent(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSessions, streak, level]);

  /* ── Score ring color ── */
  const scoreColor = dailyScore >= 75 ? '#00C853' : dailyScore >= 50 ? '#FF6B35' : '#FF2D55';

  /* ── Progress to next day ── */
  const programProgress = Math.min(100, Math.round((daysSinceStart / (profile.programDuration || 30)) * 100));

  return (
    <div className="pb-24 relative min-h-dvh" style={{ background: '#0A0A0F' }}>

      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 70%)', zIndex: 0 }} />

      <div className="relative z-10 p-5 space-y-4">

        {/* ── Header ── */}
        <div className="flex items-start justify-between pt-2">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600">
              Jour {daysSinceStart} · {profile.programDuration}j
            </p>
            <h1 className="text-[26px] font-display font-black text-white leading-tight mt-0.5">
              {profile.name ? `${profile.name} 👋` : 'Dashboard'}
            </h1>
            {/* Program progress bar */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-24 h-1 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${programProgress}%`, background: 'linear-gradient(90deg, #FF2D55, #FF6B35)' }} />
              </div>
              <span className="text-[10px] text-gray-600">{programProgress}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {/* Streak */}
            <div className="rounded-2xl px-2.5 py-1.5 flex items-center gap-1"
              style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}>
              <Flame size={13} className="text-cali-orange" />
              <span className="text-sm font-black text-white">{streak}</span>
            </div>
            {/* Level */}
            <div className="rounded-2xl px-2.5 py-1.5 flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Trophy size={13} className="text-yellow-400" />
              <span className="text-sm font-black text-white">{level}</span>
            </div>
            {/* Share */}
            <button
              onClick={() => isPremiumUser ? shareContent('dashboard', { name: profile.name, streak, weekSessions: weekSessionCount, sessionsGoal: profile.sessionsPerWeek, kcal: nutritionTotals.kcal, kcalGoal: nutritionGoalKcal, protein: nutritionTotals.protein, hydration: Math.round(hydrationProgress), sleepScore, dailyScore, level }) : router.push('/premium')}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {isPremiumUser ? <Share2 size={15} className="text-blue-400" /> : <Lock size={15} className="text-gray-500" />}
            </button>
          </div>
        </div>

        <TrialBanner />

        {/* ── Calix message card ── */}
        <div className="rounded-3xl p-4"
          style={{ background: calixType === 'warning' ? 'rgba(255,45,85,0.06)' : 'rgba(255,107,53,0.05)', border: `1px solid ${calixType === 'warning' ? 'rgba(255,45,85,0.2)' : 'rgba(255,107,53,0.15)'}` }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <CalixOrbSm speaking={speaking} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black tracking-widest uppercase text-cali-orange">Calix</span>
                <SoundWave active={speaking} />
              </div>
              {calix.isLoading && !calixLLMMessage
                ? <p className="text-sm text-gray-500 italic">Calix réfléchit...</p>
                : <p className="text-sm text-gray-300 leading-relaxed">{calixLLMMessage || calixMessage}</p>
              }
            </div>
            {/* TTS controls */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button onClick={speaking ? stop : () => speak(calixLLMMessage || calixMessage)}
                className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                style={{ background: speaking ? 'rgba(255,107,53,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${speaking ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                {speaking ? <VolumeX size={14} className="text-cali-orange" /> : <Play size={14} className="text-gray-400" />}
              </button>
              <button onClick={toggleMute}
                className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {muted ? <VolumeX size={12} className="text-gray-600" /> : <Volume2 size={12} className="text-gray-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Score ring ── */}
        <div className="rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500">Score du jour</p>
              <div className="flex items-end gap-1 mt-0.5">
                <span className="text-4xl font-display font-black" style={{ color: scoreColor }}>{dailyScore}</span>
                <span className="text-sm text-gray-600 pb-1">/100</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <DailyRing movement={movementScore} nutrition={nutritionScore} recovery={recoveryScore} score={dailyScore} dayMode={dayMode} />
            </div>
          </div>
          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Mouvement', value: movementScore, color: '#FF6B35' },
              { label: 'Nutrition', value: nutritionScore, color: '#00C853' },
              { label: 'Récupération', value: recoveryScore, color: '#BF5AF2' },
            ].map(r => (
              <div key={r.label} className="rounded-xl p-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-lg font-display font-black" style={{ color: r.color }}>{r.value}%</div>
                <div className="text-[9px] text-gray-600 mt-0.5 font-medium">{r.label}</div>
                <div className="h-0.5 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Priority CTA ── */}
        <button onClick={() => router.push(priorityAction.page)}
          className="w-full rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
          style={{ background: priorityAction.accent, border: `1px solid ${priorityAction.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {priorityAction.icon}
          </div>
          <div className="flex-1 text-left">
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500">Action du jour</p>
            <p className="text-sm font-bold text-white mt-0.5">{priorityAction.text}</p>
          </div>
          <ChevronRight size={18} className="text-gray-600 flex-shrink-0" />
        </button>

        {/* ── Caloric status ── */}
        {nutritionTotals.kcal > 0 && (
          <div className="rounded-2xl p-3 flex items-center gap-3"
            style={{ background: nutritionRemaining.kcal < -300 ? 'rgba(255,45,85,0.08)' : nutritionRemaining.kcal < 0 ? 'rgba(255,200,0,0.06)' : 'rgba(0,200,100,0.06)', border: `1px solid ${nutritionRemaining.kcal < -300 ? 'rgba(255,45,85,0.2)' : nutritionRemaining.kcal < 0 ? 'rgba(255,200,0,0.2)' : 'rgba(0,200,100,0.15)'}` }}>
            <span className="text-xl">{nutritionRemaining.kcal < -300 ? '🚨' : nutritionRemaining.kcal < 0 ? '⚠️' : nutritionRemaining.kcal < 200 ? '✅' : '🍽️'}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">
                {nutritionRemaining.kcal < 0 ? `Surplus de ${Math.abs(nutritionRemaining.kcal)} kcal` : nutritionRemaining.kcal < 200 ? `Objectif presque atteint` : `${nutritionRemaining.kcal} kcal restantes`}
              </p>
              <p className="text-[10px] text-gray-500">{nutritionTotals.kcal} / {nutritionGoalKcal} kcal · {nutritionTotals.protein}g protéines</p>
            </div>
            <button onClick={() => router.push('/nutrition')} className="text-[11px] text-blue-400 font-semibold">Voir →</button>
          </div>
        )}

        {/* ── Quick access modules ── */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600 mb-3">Modules</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Dumbbell, label: 'Training', sub: sessionDoneToday ? 'Séance faite ✓' : 'Séance du jour', path: '/fitness', iconColor: '#FF6B35', glow: 'rgba(255,107,53,0.08)', accent: 'rgba(255,107,53,0.15)', border: 'rgba(255,107,53,0.2)' },
              { icon: Utensils, label: 'Nutrition', sub: nutritionTotals.kcal > 0 ? `${nutritionTotals.kcal} kcal` : 'Aucun repas', path: '/nutrition', iconColor: '#00C853', glow: 'rgba(0,200,83,0.06)', accent: 'rgba(0,200,83,0.1)', border: 'rgba(0,200,83,0.15)' },
              { icon: Droplets, label: 'Hydratation', sub: `${Math.round(hydrationProgress)}% objectif`, path: '/nutrition', iconColor: '#0A84FF', glow: 'rgba(10,132,255,0.06)', accent: 'rgba(10,132,255,0.08)', border: 'rgba(10,132,255,0.15)' },
              { icon: Moon, label: 'Récupération', sub: sleepScore > 0 ? `Score ${sleepScore}%` : 'Pas de données', path: '/sleep', iconColor: '#BF5AF2', glow: 'rgba(191,90,242,0.06)', accent: 'rgba(191,90,242,0.08)', border: 'rgba(191,90,242,0.15)' },
            ].map(card => (
              <button key={card.label} onClick={() => router.push(card.path)}
                className="rounded-2xl p-4 text-left active:scale-[0.97] transition-transform relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${card.accent} 0%, rgba(255,255,255,0.01) 100%)`, border: `1px solid ${card.border}` }}>
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full"
                  style={{ background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`, transform: 'translate(20%, -20%)' }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid ${card.border}` }}>
                  <card.icon size={20} style={{ color: card.iconColor }} />
                </div>
                <p className="text-sm font-bold text-white">{card.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: card.iconColor, opacity: 0.8 }}>{card.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Séances', value: totalSessions, icon: '🏋️', color: '#FF6B35' },
            { label: 'Cette sem.', value: `${weekSessionCount}/${profile.sessionsPerWeek}`, icon: '📅', color: '#0A84FF' },
            { label: 'XP total', value: xp, icon: '⚡', color: '#FFD60A' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-lg">{s.icon}</div>
              <div className="text-lg font-display font-black text-white mt-1">{s.value}</div>
              <div className="text-[9px] text-gray-600 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Streaks ── */}
        <div className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600 mb-3">Streaks actifs</p>
          <div className="space-y-2">
            {[
              { label: '🏋️ Training', value: streak, color: '#FF6B35', max: Math.max(7, streak) },
              { label: '🍽️ Nutrition', value: nutritionStreak, color: '#00C853', max: Math.max(7, nutritionStreak) },
              { label: '💧 Hydratation', value: hydrationStreak, color: '#0A84FF', max: Math.max(7, hydrationStreak) },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500 w-28 flex-shrink-0">{s.label}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%`, background: s.color }} />
                </div>
                <span className="text-xs font-black w-6 text-right" style={{ color: s.color }}>{s.value}j</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── XP bar ── */}
        <div className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-sm font-bold text-white">Niveau {level}</span>
            </div>
            <span className="text-xs text-gray-500">{xp} XP · {200 - (xp % 200)} jusqu'au nv. {level + 1}</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${(xp % 200) / 2}%`, background: 'linear-gradient(90deg, #FFD60A, #FF6B35)' }} />
          </div>
        </div>

        {/* ── Body stats ── */}
        <BodyStatsWidget />

        {/* ── Next badge ── */}
        {badgeHint && (
          <button onClick={() => router.push('/progress?tab=badges')}
            className="w-full rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99]"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-2xl">{badgeHint.badge.icon}</span>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-white mb-1.5">{badgeHint.message}</p>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${badgeHint.progress}%`, background: 'linear-gradient(90deg, #FF2D55, #FF6B35)' }} />
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{badgeHint.progress}% · +{badgeHint.badge.xp} XP</p>
            </div>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        )}

        {/* ── Adaptations ── */}
        {(profile.injuries.length > 0 || profile.dietaryPrefs.length > 0 || profile.limitations.length > 0) && (
          <div className="rounded-2xl p-3 space-y-1.5"
            style={{ background: 'rgba(0,200,83,0.04)', border: '1px solid rgba(0,200,83,0.15)' }}>
            <p className="text-[11px] font-bold text-green-400">✅ Programme adapté pour toi</p>
            {profile.injuries.length > 0 && <p className="text-[10px] text-gray-500">🩹 Exercices modifiés : {profile.injuries.map((i: string) => ({ knee: 'genou', back: 'dos', shoulder: 'épaule', wrist: 'poignet', hip: 'hanche', ankle: 'cheville', neck: 'nuque' }[i as string] || i)).join(', ')}</p>}
            {profile.dietaryPrefs.length > 0 && <p className="text-[10px] text-gray-500">🥗 Recettes filtrées : {profile.dietaryPrefs.map((d: string) => ({ vegetarian: 'Végétarien', vegan: 'Vegan', lactose_free: 'Sans lactose', gluten_free: 'Sans gluten', tayyibat: 'Tayyibat', none: '' }[d as string] || '')).filter(Boolean).join(', ')}</p>}
          </div>
        )}

      </div>

      {/* ── Emotional moment popup ── */}
      {emotionalPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          onClick={() => setEmotionalPopup(null)}>
          <div className="w-full max-w-sm rounded-3xl p-8 text-center animate-bounce-in"
            style={{ background: 'rgba(20,20,30,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-4 animate-pulse-glow">{emotionalPopup.icon}</div>
            <h2 className="text-2xl font-display font-black text-white mb-2">{emotionalPopup.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">{emotionalPopup.msg}</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={16} className="text-cali-orange" />
              <span className="text-sm text-cali-orange font-bold">+50 XP</span>
            </div>
            <button onClick={() => setEmotionalPopup(null)}
              className="w-full py-3.5 rounded-2xl text-white font-display font-bold"
              style={{ background: 'linear-gradient(135deg, #FF2D55, #FF6B35)' }}>
              Continuer 💪
            </button>
          </div>
        </div>
      )}

      {/* Sound wave keyframes */}
      <style>{`
        @keyframes sound-bar { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
        @keyframes spin { from { transform: rotate(-90deg); } to { transform: rotate(270deg); } }
      `}</style>
    </div>
  );
}
