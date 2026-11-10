'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useSleepStore } from '@/lib/sleepStore';
import { useNutritionStore } from '@/lib/nutritionStore';
import { useGameStore } from '@/lib/gameStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { calculateDailyScore, getDayMode } from '@/lib/calculations';
import { scheduleDailyNotifications } from '@/services/pushNotificationService';

import CalixCoach from '@/components/CalixCoach';
import TrialBanner from '@/components/TrialBanner';
import DailyRing from '@/components/DailyRing';
import BodyStatsWidget from '@/components/BodyStatsWidget';
import {
  Dumbbell, Droplets, Moon, Utensils, Flame, Trophy,
  TrendingUp, ChevronRight, X, Sparkles, Share2, Lock,
  Zap, Apple, Bed, Activity,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getUserTrialStartDate, getUserPremiumUntil } from '@/lib/firebaseUserService';
import { shareContent } from '@/components/ShareCard';

/* ── Waze-style helpers ───────────────────────────────────────────────────── */
const IC = ({ bg, children }: { bg: string; children: React.ReactNode }) => (
  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>{children}</div>
);

const NavRow = ({
  onClick, icon, label, sub, badge, last = false,
}: { onClick: () => void; icon: React.ReactNode; label: string; sub?: string; badge?: React.ReactNode; last?: boolean }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 active:bg-white/5 transition-colors text-left">
    {icon}
    <div className="flex-1 min-w-0">
      <p className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {sub && <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
    </div>
    {badge}
    <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
  </button>
);

const Divider = () => (
  <div className="ml-[70px] h-px" style={{ background: 'var(--border)' }} />
);

const SectionGroup = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div>
    {title && (
      <p className="text-[11px] font-bold uppercase tracking-widest px-4 pb-2"
        style={{ color: 'var(--text-tertiary)' }}>{title}</p>
    )}
    <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      {children}
    </div>
  </div>
);

/* ── Progress pill ─────────────────────────────────────────────────────────── */
const Pill = ({ value, max, color }: { value: number; max: number; color: string }) => {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100));
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-bold w-7 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();

  const animateCount = (el: HTMLElement | null, target: number) => {
    if (!el || !target) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease).toString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const profile = useUserStore((s) => s.profile);
  const streak = useUserStore((s) => s.streak);
  const totalSessions = useUserStore((s) => s.totalSessions);
  const xp = useUserStore((s) => s.xp);
  const level = useUserStore((s) => s.level);
  const sessionHistory = useUserStore((s) => s.sessionHistory);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const getDaysAbsent = useUserStore((s) => s.getDaysAbsent);
  const getDaysSinceStart = useUserStore((s) => s.getDaysSinceStart);
  const hasShownMoment = useUserStore((s) => s.hasShownMoment);
  const markEmotionalMoment = useUserStore((s) => s.markEmotionalMoment);
  const sleepScore = useSleepStore((s) => s.getLatestScore());
  const hydrationProgress = useHydrationStore((s) => s.getProgress());
  const hydrationMl = useHydrationStore((s) => s.consumed);
  const hydrationGoal = useHydrationStore((s) => s.dailyGoal);
  const nutritionTotals = useNutritionStore((s) => s.getTodayTotals());
  const nutritionGoalKcal = useNutritionStore((s) => s.dailyGoalKcal);
  const calixNutrition = useNutritionStore((s) => s.getCalixMessage());
  const calixSleep = useSleepStore((s) => s.getCalixMessage());
  const nutritionRemaining = useNutritionStore((s) => s.getRemaining());
  const nutritionStreak = useNutritionStore((s) => s.streak);
  const hydrationStreak = useHydrationStore((s) => s.streak);
  const sleepDebt = useSleepStore((s) => s.getSleepDebt());
  const sleepStreak = useSleepStore((s) => s.streak);
  const pagesVisited = useGameStore((s) => s.pagesVisited);
  const visitPage = useGameStore((s) => s.visitPage);
  const checkBadges = useGameStore((s) => s.checkBadges);
  const getNextBadgeHint = useGameStore((s) => s.getNextBadgeHint);
  const computeTrialStatus = useFreemiumStore((s) => s.computeTrialStatus);
  const isPremiumUser = useFreemiumStore((s) => s.isPremium);
  const notifHydration = useUserStore((s) => s.notifHydration);
  const notifNutrition = useUserStore((s) => s.notifNutrition);
  const notifSleep = useUserStore((s) => s.notifSleep);
  const notifTraining = useUserStore((s) => s.notifTraining);
  const notifMotivation = useUserStore((s) => s.notifMotivation);
  const notifSleepTime = useUserStore((s) => s.notifSleepTime);

  const [emotionalPopup, setEmotionalPopup] = useState<{ id: string; icon: string; title: string; msg: string } | null>(null);

  useEffect(() => {
    if (!onboardingComplete) { router.replace('/onboarding'); return; }
    const user = auth.currentUser;
    if (user && !user.emailVerified && user.email?.toLowerCase() !== 'azizkamaz95@gmail.com') {
      router.replace('/onboarding');
      return;
    }
    visitPage('dashboard');
    if (user && user.email?.toLowerCase() !== 'azizkamaz95@gmail.com') {
      (async () => {
        try {
          const premiumUntil = await getUserPremiumUntil(user.uid);
          if (premiumUntil && new Date(premiumUntil) > new Date()) {
            useFreemiumStore.getState().setPremium('annual_once');
            return;
          }
          const trialStart = await getUserTrialStartDate(user.uid);
          if (trialStart) useFreemiumStore.getState().setTrialStartFromFirebase(trialStart);
        } catch (_) {}
        computeTrialStatus();
      })();
    } else {
      computeTrialStatus();
    }
    checkEmotionalMoments();
    scheduleDailyNotifications({
      hydration: notifHydration, nutrition: notifNutrition,
      sleep: notifSleep, training: notifTraining,
      motivation: notifMotivation, sleepTime: notifSleepTime,
    }, profile.name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkEmotionalMoments = () => {
    const moments = [
      { id: 'first_session', cond: totalSessions >= 1 && !hasShownMoment('first_session'), icon: '🎉', title: 'Première séance !', msg: 'Tu viens de franchir le premier pas. C\'est le plus important.' },
      { id: 'streak_3', cond: streak >= 3 && !hasShownMoment('streak_3'), icon: '🔥', title: '3 jours d\'affilée !', msg: 'Tu construis une habitude. Continue comme ça !' },
      { id: 'streak_7', cond: streak >= 7 && !hasShownMoment('streak_7'), icon: '⚡', title: 'Semaine parfaite !', msg: '7 jours consécutifs ! Ta discipline est impressionnante.' },
      { id: 'sessions_10', cond: totalSessions >= 10 && !hasShownMoment('sessions_10'), icon: '💪', title: '10 séances !', msg: 'Ton corps commence à changer. La régularité paie.' },
      { id: 'level_5', cond: level >= 5 && !hasShownMoment('level_5'), icon: '⭐', title: 'Niveau 5 !', msg: 'Tu progresses à une vitesse incroyable.' },
    ];
    const toShow = moments.find(m => m.cond);
    if (toShow) {
      setEmotionalPopup(toShow);
      markEmotionalMoment(toShow.id);
      useUserStore.getState().addXP(50);
    }
  };

  const refStreak = useRef<HTMLSpanElement>(null);
  const refLevel = useRef<HTMLSpanElement>(null);
  const refXp = useRef<HTMLSpanElement>(null);
  const refWeek = useRef<HTMLSpanElement>(null);
  const refStreakN = useRef<HTMLSpanElement>(null);
  const refStreakNu = useRef<HTMLSpanElement>(null);
  const refStreakH = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setTimeout(() => {
      animateCount(refStreak.current, streak);
      animateCount(refLevel.current, level);
      animateCount(refXp.current, xp);
      animateCount(refWeek.current, weekSessionCount);
      animateCount(refStreakN.current, streak);
      animateCount(refStreakNu.current, nutritionStreak);
      animateCount(refStreakH.current, hydrationStreak);
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daysAbsent = getDaysAbsent();
  const daysSinceStart = getDaysSinceStart();

  const badgeHint = useMemo(() => getNextBadgeHint({
    totalSessions, streak, hydrationStreak, nutritionStreak, sleepStreak, level,
    pagesVisited: pagesVisited.length,
  }), [totalSessions, streak, hydrationStreak, nutritionStreak, sleepStreak, level, pagesVisited]);

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
  useEffect(() => { useUserStore.getState().setDailyScore(dailyScore); }, [dailyScore]);

  useEffect(() => {
    const uStore = useUserStore.getState();
    checkBadges({
      totalSessions: uStore.totalSessions, streak: uStore.streak,
      hasInjury: uStore.profile.injuries.length > 0,
      hydrationStreak: useHydrationStore.getState().streak,
      nutritionStreak: useNutritionStore.getState().streak,
      sleepStreak: useSleepStore.getState().entries?.filter((e: any) => !e.isNap).length ?? 0,
      level: uStore.level,
      usedVoyageMode: uStore.sessionHistory.some(s => s.mode === 'voyage'),
      usedCycleMode: uStore.sessionHistory.some(s => s.mode === 'cycle'),
      sessionHour: new Date().getHours(), daysAbsent: uStore.getDaysAbsent(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSessions, streak, level]);

  const weekSessionCount = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    return sessionHistory.filter(s => new Date(s.date) >= weekStart).length;
  }, [sessionHistory]);

  const calixMessage = useMemo(() => {
    if (daysAbsent >= 7) return '💫 Content de te revoir ! On reprend doucement. Ton programme s\'adapte automatiquement.';
    if (daysAbsent >= 3) return '👋 Ça fait ' + daysAbsent + ' jours ! Pas de pression, une petite séance légère pour reprendre ?';
    if (sleepScore < 55) {
      if (sleepDebt > 3) return `😴 ${sleepDebt}h de dette de sommeil accumulées. On allège la séance et on prioritise la récup ce soir.`;
      return calixSleep;
    }
    if (hydrationProgress < 30) return '💧 Pense à boire de l\'eau dès maintenant. Ton corps en a besoin pour performer.';
    return calixNutrition;
  }, [daysAbsent, sleepScore, sleepDebt, hydrationProgress, calixSleep, calixNutrition]);

  const calixType = daysAbsent >= 3 ? 'motivation' : sleepScore < 55 ? 'warning' : 'info';

  const sessionDoneToday = useMemo(() => {
    const today = new Date().toDateString();
    return sessionHistory.some(s => new Date(s.date).toDateString() === today);
  }, [sessionHistory]);

  const goalLabel: Record<string, string> = {
    weight_loss: 'Perte de poids',
    muscle: 'Prise de masse',
    endurance: 'Endurance',
    health: 'Santé générale',
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bonne après-midi' : 'Bonsoir';

  return (
    <div className="pb-24 page-enter" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {greeting} · Jour {daysSinceStart}
            </p>
            <h1 className="text-[28px] font-black leading-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {profile.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--brand-orange)' }}>
                {goalLabel[profile.goal] ?? profile.goal}
              </span>
              {profile.weight > 0 && profile.targetWeight > 0 && Math.abs(profile.weight - profile.targetWeight) > 0.5 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px]"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  {Math.abs(profile.weight - profile.targetWeight).toFixed(1)} kg {profile.weight > profile.targetWeight ? 'à perdre' : 'à prendre'}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Flame size={14} style={{ color: 'var(--brand-orange)' }} />
              <span ref={refStreak} className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Trophy size={14} style={{ color: '#BF5AF2' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Nv.<span ref={refLevel}>{level}</span></span>
            </div>
            <button
              onClick={() => isPremiumUser ? shareContent('dashboard', {
                name: profile.name, streak, weekSessions: weekSessionCount,
                sessionsGoal: profile.sessionsPerWeek, kcal: nutritionTotals.kcal,
                kcalGoal: nutritionGoalKcal, protein: nutritionTotals.protein,
                hydration: Math.round(hydrationProgress), sleepScore, dailyScore, level,
              }) : router.push('/premium')}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {isPremiumUser
                ? <Share2 size={15} style={{ color: '#00D4FF' }} />
                : <Lock size={15} style={{ color: '#00D4FF' }} />}
            </button>
          </div>
        </div>
      </div>

      <TrialBanner />

      {/* ── Score ring ──────────────────────────────────────────────────────── */}
      <div className="mx-4 rounded-3xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center">
          <DailyRing movement={movementScore} nutrition={nutritionScore} recovery={recoveryScore} score={dailyScore} dayMode={dayMode} />
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {[
            { label: 'Mouvement', color: 'var(--brand-orange)', value: movementScore },
            { label: 'Nutrition',  color: '#00FF87',             value: nutritionScore },
            { label: 'Récup',      color: '#BF5AF2',             value: recoveryScore  },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{r.label} {r.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Calix message ───────────────────────────────────────────────────── */}
      <div className="mx-4 mb-5">
        <CalixCoach message={calixMessage} type={calixType} />
      </div>

      <div className="space-y-6">

        {/* ── Today's status ──────────────────────────────────────────────── */}
        <SectionGroup title="Aujourd'hui">
          {/* Training */}
          <NavRow
            onClick={() => router.push('/fitness')}
            icon={<IC bg="bg-orange-500"><Dumbbell size={18} className="text-white" /></IC>}
            label="Entraînement"
            sub={sessionDoneToday ? 'Séance accomplie ✓' : `${weekSessionCount} / ${profile.sessionsPerWeek} séances cette semaine`}
            badge={<Pill value={weekSessionCount} max={profile.sessionsPerWeek || 3} color="var(--brand-orange)" />}
          />
          <Divider />
          {/* Nutrition */}
          <NavRow
            onClick={() => router.push('/nutrition')}
            icon={<IC bg="bg-green-500"><Apple size={18} className="text-white" /></IC>}
            label="Nutrition"
            sub={nutritionTotals.kcal > 0
              ? `${nutritionTotals.kcal} / ${nutritionGoalKcal} kcal · ${nutritionTotals.protein}g prot.`
              : 'Aucun repas enregistré'}
            badge={<Pill value={nutritionTotals.kcal} max={nutritionGoalKcal} color="#00FF87" />}
          />
          <Divider />
          {/* Hydration */}
          <NavRow
            onClick={() => router.push('/nutrition')}
            icon={<IC bg="bg-blue-500"><Droplets size={18} className="text-white" /></IC>}
            label="Hydratation"
            sub={`${hydrationMl} / ${hydrationGoal} ml`}
            badge={<Pill value={hydrationMl} max={hydrationGoal} color="#00D4FF" />}
          />
          <Divider />
          {/* Sleep */}
          <NavRow
            onClick={() => router.push('/sleep')}
            icon={<IC bg="bg-violet-500"><Bed size={18} className="text-white" /></IC>}
            label="Récupération"
            sub={sleepScore > 0 ? `Score sommeil ${sleepScore}%${sleepDebt > 0 ? ` · ${sleepDebt}h de dette` : ''}` : 'Non renseigné'}
            badge={<Pill value={sleepScore} max={100} color="#BF5AF2" />}
          />
        </SectionGroup>

        {/* ── Streaks ─────────────────────────────────────────────────────── */}
        <SectionGroup title="Régularité">
          <NavRow
            onClick={() => router.push('/fitness')}
            icon={<IC bg="bg-orange-500"><Flame size={18} className="text-white" /></IC>}
            label="Streak entraînement"
            sub="Jours consécutifs d'activité"
            badge={<span className="text-[16px] font-black mr-1" style={{ color: 'var(--brand-orange)' }}><span ref={refStreakN}>{streak}</span>j</span>}
          />
          <Divider />
          <NavRow
            onClick={() => router.push('/nutrition')}
            icon={<IC bg="bg-green-500"><Utensils size={18} className="text-white" /></IC>}
            label="Streak nutrition"
            sub="Jours avec repas enregistrés"
            badge={<span className="text-[16px] font-black mr-1" style={{ color: '#00FF87' }}><span ref={refStreakNu}>{nutritionStreak}</span>j</span>}
          />
          <Divider />
          <NavRow
            onClick={() => router.push('/nutrition')}
            icon={<IC bg="bg-blue-500"><Droplets size={18} className="text-white" /></IC>}
            label="Streak hydratation"
            sub="Jours avec objectif eau atteint"
            badge={<span className="text-[16px] font-black mr-1" style={{ color: '#00D4FF' }}><span ref={refStreakH}>{hydrationStreak}</span>j</span>}
          />
        </SectionGroup>

        {/* ── XP & progression ────────────────────────────────────────────── */}
        <SectionGroup title="Progression">
          <NavRow
            onClick={() => router.push('/progress')}
            icon={<IC bg="bg-violet-500"><TrendingUp size={18} className="text-white" /></IC>}
            label="Ma progression"
            sub={`${xp} XP · Niveau ${level} · ${200 - (xp % 200)} XP pour le suivant`}
            badge={
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(xp % 200) / 2}%`, background: 'var(--brand-gradient)' }} />
                </div>
              </div>
            }
          />
          {badgeHint && (
            <>
              <Divider />
              <NavRow
                onClick={() => router.push('/progress?tab=badges')}
                icon={<div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: 'var(--bg-surface)' }}>{badgeHint.badge.icon}</div>}
                label={badgeHint.message}
                sub={`${badgeHint.progress}% · +${badgeHint.badge.xp} XP`}
                badge={<Pill value={badgeHint.progress} max={100} color="var(--brand-orange)" />}
              />
            </>
          )}
        </SectionGroup>

        {/* ── Body stats ──────────────────────────────────────────────────── */}
        <div className="mx-4">
          <p className="text-[11px] font-bold uppercase tracking-widest px-0 pb-2"
            style={{ color: 'var(--text-tertiary)' }}>Bilan corporel</p>
          <BodyStatsWidget />
        </div>

        {/* ── Adaptations ─────────────────────────────────────────────────── */}
        {(profile.injuries.length > 0 || profile.dietaryPrefs.length > 0) && (
          <SectionGroup title="Programme personnalisé">
            <div className="px-4 py-3 space-y-1.5">
              {profile.injuries.length > 0 && (
                <div className="flex items-start gap-2">
                  <IC bg="bg-rose-500/20"><Activity size={14} className="text-rose-400" /></IC>
                  <p className="text-[13px] pt-2.5" style={{ color: 'var(--text-secondary)' }}>
                    Exercices adaptés · {profile.injuries.map(i => ({ knee: 'genou', back: 'dos', shoulder: 'épaule', wrist: 'poignet', hip: 'hanche', ankle: 'cheville', neck: 'nuque' }[i] || i)).join(', ')}
                  </p>
                </div>
              )}
              {profile.dietaryPrefs.length > 0 && (
                <div className="flex items-start gap-2">
                  <IC bg="bg-green-500/20"><Utensils size={14} className="text-green-400" /></IC>
                  <p className="text-[13px] pt-2.5" style={{ color: 'var(--text-secondary)' }}>
                    Recettes filtrées · {profile.dietaryPrefs.map(d => ({ vegetarian: 'Végétarien', vegan: 'Vegan', lactose_free: 'Sans lactose', gluten_free: 'Sans gluten', tayyibat: 'Tayyibat' }[d as string] ?? d)).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </SectionGroup>
        )}

      </div>

      {/* ── Emotional Moment Popup ──────────────────────────────────────────── */}
      {emotionalPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          onClick={() => setEmotionalPopup(null)}>
          <div className="w-full max-w-sm rounded-3xl p-8 text-center animate-bounce-in"
            style={{ background: 'var(--bg-card)' }} onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-4">{emotionalPopup.icon}</div>
            <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{emotionalPopup.title}</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{emotionalPopup.msg}</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={16} style={{ color: 'var(--brand-orange)' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--brand-orange)' }}>+50 XP</span>
            </div>
            <button onClick={() => setEmotionalPopup(null)}
              className="w-full py-3 rounded-2xl text-white font-black"
              style={{ background: 'var(--brand-gradient)' }}>
              Continuer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
