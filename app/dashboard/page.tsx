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
import { Dumbbell, Droplets, Moon, Utensils, Flame, Trophy, TrendingUp, ChevronRight, X, Sparkles, Share2, Lock } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getUserTrialStartDate, getUserPremiumUntil } from '@/lib/firebaseUserService';
import { shareContent } from '@/components/ShareCard';

export default function DashboardPage() {
  const router = useRouter();
  // Animate a number from 0 to target over ~1.2s
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
    // Block access if email not verified (except demo account)
    const user = auth.currentUser;
    if (user && !user.emailVerified && user.email?.toLowerCase() !== 'azizkamaz95@gmail.com') {
      router.replace('/onboarding');
      return;
    }
    visitPage('dashboard');
    // Sync trial and premium status from Firebase
    if (user && user.email?.toLowerCase() !== 'azizkamaz95@gmail.com') {
      (async () => {
        try {
          const premiumUntil = await getUserPremiumUntil(user.uid);
          if (premiumUntil && new Date(premiumUntil) > new Date()) {
            useFreemiumStore.getState().setPremium('annual_once');
            return;
          }
          const trialStart = await getUserTrialStartDate(user.uid);
          if (trialStart) {
            useFreemiumStore.getState().setTrialStartFromFirebase(trialStart);
          }
        } catch (_) {
          // offline — fall back to local trial date
        }
        computeTrialStatus();
      })();
    } else {
      computeTrialStatus();
    }
    checkEmotionalMoments();
    // Schedule real notifications for today
    scheduleDailyNotifications({
      hydration: notifHydration, nutrition: notifNutrition,
      sleep: notifSleep, training: notifTraining,
      motivation: notifMotivation, sleepTime: notifSleepTime,
    }, profile.name);
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

  // Counter refs
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
      animateCount(refStreakN.current, nutritionStreak);
      animateCount(refStreakNu.current, nutritionStreak);
      animateCount(refStreakH.current, hydrationStreak);
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daysAbsent = getDaysAbsent();
  const daysSinceStart = getDaysSinceStart();

  const badgeHint = useMemo(() => getNextBadgeHint({
    totalSessions,
    streak,
    hydrationStreak,
    nutritionStreak,
    sleepStreak,
    level,
    pagesVisited: pagesVisited.length,
  }), [totalSessions, streak, hydrationStreak, nutritionStreak, sleepStreak, level, pagesVisited]);

  const movementScore = useMemo(() => {
    if (streak === 0) return totalSessions > 0 ? 15 : 0;
    // streak 1=35, 2=50, 3=60, 4=68, 5=75, 7=84, 10=93, 14+=100
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

  const priorityAction = useMemo(() => {
    if (daysAbsent >= 3) return { icon: '💪', text: 'Reprends une séance légère', page: '/fitness', color: 'bg-cali-purple/10 border-cali-purple/30' };
    if (hydrationProgress < 30) return { icon: '💧', text: 'Pense à boire de l\'eau', page: '/nutrition', color: 'bg-blue-500/10 border-blue-500/30' };
    if (nutritionTotals.kcal === 0) return { icon: '🍽️', text: 'Logue ton premier repas', page: '/nutrition', color: 'bg-green-500/10 border-green-500/30' };
    if (sleepScore < 55) return { icon: '😴', text: 'Priorise ta récupération', page: '/sleep', color: 'bg-purple-500/10 border-purple-500/30' };
    if (sessionDoneToday) return { icon: '✅', text: 'Séance du jour accomplie — récupère bien', page: '/sleep', color: 'bg-cali-green/10 border-cali-green/30' };
    return { icon: '💪', text: 'Lance ta séance du jour', page: '/fitness', color: 'bg-orange-500/10 border-orange-500/30' };
  }, [daysAbsent, hydrationProgress, nutritionTotals, sleepScore, sessionDoneToday]);

  return (
    <div className="pb-20 page-enter relative">
      
      <div className="relative z-10 p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cali-light-text text-xs">Jour {daysSinceStart} / {profile.programDuration}</p>
            <h1 className="text-2xl font-display font-black text-white">{profile.name} 👋</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] bg-cali-surface rounded-xl px-2 py-0.5 text-cali-orange font-medium">
                {{weight_loss:'🎯 Perte de poids',muscle:'💪 Prise de masse',endurance:'🏃 Endurance',health:'❤️ Santé'}[profile.goal]}
              </span>
              {profile.weight > 0 && profile.targetWeight > 0 && Math.abs(profile.weight - profile.targetWeight) > 0.5 && (
                <span className="text-[10px] bg-cali-surface rounded-xl px-2 py-0.5 text-gray-400">
                  {Math.abs(profile.weight - profile.targetWeight).toFixed(1)} kg {profile.weight > profile.targetWeight ? 'à perdre' : 'à prendre'}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-cali-surface rounded-2xl px-3 py-1.5 flex items-center gap-1.5"><Flame size={14} className="text-cali-orange" /><span ref={refStreak} className="text-sm font-bold text-white">{streak}</span></div>
            <div className="bg-cali-surface rounded-2xl px-3 py-1.5 flex items-center gap-1.5"><Trophy size={14} className="text-cali-orange" /><span className="text-sm font-bold text-white">Nv.<span ref={refLevel}>{level}</span></span></div>
            <button
              onClick={() => isPremiumUser ? shareContent('dashboard', {
                name: profile.name,
                streak,
                weekSessions: weekSessionCount,
                sessionsGoal: profile.sessionsPerWeek,
                kcal: nutritionTotals.kcal,
                kcalGoal: nutritionGoalKcal,
                protein: nutritionTotals.protein,
                hydration: Math.round(hydrationProgress),
                sleepScore,
                dailyScore,
                level,
              }) : router.push('/premium')}
              className="w-8 h-8 rounded-xl bg-cali-surface flex items-center justify-center active:scale-95"
            >
              {isPremiumUser ? <Share2 size={15} className="text-cali-blue" /> : <Lock size={15} className="text-cali-blue" />}
            </button>
          </div>
        </div>

        <TrialBanner />

        {/* Daily Ring */}
        <div className="dash-card bg-cali-card rounded-3xl p-5 border border-white/5">
          <div className="flex items-center justify-center"><DailyRing movement={movementScore} nutrition={nutritionScore} recovery={recoveryScore} score={dailyScore} dayMode={dayMode} /></div>
          <div className="flex justify-center gap-6 mt-4">
            {[{ label: 'Mouvement', color: 'bg-cali-orange', value: movementScore },{ label: 'Nutrition', color: 'bg-cali-green', value: nutritionScore },{ label: 'Récup', color: 'bg-cali-purple', value: recoveryScore }].map(r => (
              <div key={r.label} className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${r.color}`} /><span className="text-[10px] text-cali-light-text">{r.label} {r.value}%</span></div>
            ))}
          </div>
        </div>

        {/* Priority Action */}
        <button onClick={() => router.push(priorityAction.page)} className={`dash-card w-full rounded-2xl border ${priorityAction.color} p-4 flex items-center gap-3 active:scale-[0.99]`}>
          <span className="text-2xl">{priorityAction.icon}</span>
          <div className="flex-1 text-left"><p className="text-sm font-bold text-white">Action prioritaire</p><p className="text-xs text-gray-400">{priorityAction.text}</p></div>
          <ChevronRight size={18} className="text-cali-light-text" />
        </button>

        <CalixCoach message={calixMessage} type={calixType} />

        {/* Caloric status — visible only when meals logged */}
        {nutritionTotals.kcal > 0 && (
          <div className={`rounded-2xl border p-3 flex items-center gap-3 ${nutritionRemaining.kcal < -300 ? 'bg-red-500/10 border-red-500/30' : nutritionRemaining.kcal < 0 ? 'bg-yellow-500/10 border-yellow-500/30' : nutritionRemaining.kcal < 200 ? 'bg-green-500/10 border-green-500/30' : 'bg-cali-surface border-white/5'}`}>
            <span className="text-xl">{nutritionRemaining.kcal < -300 ? '🚨' : nutritionRemaining.kcal < 0 ? '⚠️' : nutritionRemaining.kcal < 200 ? '✅' : '🍽️'}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">
                {nutritionRemaining.kcal < 0
                  ? `Surplus de ${Math.abs(nutritionRemaining.kcal)} kcal aujourd'hui`
                  : nutritionRemaining.kcal < 200
                  ? `Objectif presque atteint — ${nutritionRemaining.kcal} kcal restantes`
                  : `${nutritionRemaining.kcal} kcal restantes`}
              </p>
              <p className="text-[10px] text-gray-500">{nutritionTotals.kcal} / {nutritionGoalKcal} kcal · {nutritionTotals.protein}g protéines</p>
            </div>
            <button onClick={() => router.push('/nutrition')} className="text-[10px] text-cali-blue">Voir →</button>
          </div>
        )}

        {/* Triple streak + weekly sessions */}
        <div className="dash-card grid grid-cols-2 gap-3">
          <div className="bg-cali-card rounded-2xl p-3 border border-white/5">
            <p className="text-[10px] text-gray-500 mb-2 font-medium uppercase tracking-wider">Streaks</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between"><span className="text-[10px] text-gray-400">🏋️ Training</span><span className="text-xs font-bold text-cali-orange"><span ref={refStreakN}>{streak}</span>j</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-gray-400">🍽️ Nutrition</span><span className="text-xs font-bold text-cali-green"><span ref={refStreakNu}>{nutritionStreak}</span>j</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-gray-400">💧 Hydratation</span><span className="text-xs font-bold text-cali-blue"><span ref={refStreakH}>{hydrationStreak}</span>j</span></div>
            </div>
          </div>
          <div className="bg-cali-card rounded-2xl p-3 border border-white/5">
            <p className="text-[10px] text-gray-500 mb-2 font-medium uppercase tracking-wider">Cette semaine</p>
            <div className="flex items-end gap-1 mb-2">
              <span ref={refWeek} className="text-2xl font-display font-black text-white">{weekSessionCount}</span>
              <span className="text-xs text-gray-500 pb-1">/ {profile.sessionsPerWeek} séances</span>
            </div>
            <div className="h-1.5 bg-cali-surface rounded-full overflow-hidden">
              <div className="h-full bg-cali-orange rounded-full transition-all" style={{ width: `${Math.min(100, (weekSessionCount / (profile.sessionsPerWeek || 3)) * 100)}%` }} />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">{Math.max(0, profile.sessionsPerWeek - weekSessionCount)} restante{profile.sessionsPerWeek - weekSessionCount > 1 ? 's' : ''} pour atteindre l'objectif</p>
          </div>
        </div>

        {/* Body Stats Widget - IMC / TDEE / Deficit */}
        <BodyStatsWidget />

        {/* Personalized adaptation acknowledgment */}
        {(profile.injuries.length > 0 || profile.dietaryPrefs.length > 0 || profile.allergies.length > 0 || profile.limitations.length > 0) && (
          <div className="bg-cali-green/5 border border-cali-green/20 rounded-2xl p-3 space-y-1.5">
            <p className="text-[10px] font-bold text-cali-green">✅ Programme adapté pour toi</p>
            {profile.injuries.length > 0 && (
              <p className="text-[10px] text-gray-400">🩹 Exercices modifiés pour protéger : {profile.injuries.map(i => ({knee:'genou',back:'dos',shoulder:'épaule',wrist:'poignet',hip:'hanche',ankle:'cheville',neck:'nuque'}[i] || i)).join(', ')}</p>
            )}
            {profile.limitations.length > 0 && (
              <p className="text-[10px] text-gray-400">⚕️ Prise en compte : {profile.limitations.join(', ')}</p>
            )}
            {profile.dietaryPrefs.length > 0 && (
              <p className="text-[10px] text-gray-400">🥗 Recettes filtrées : {profile.dietaryPrefs.map(d => ({vegetarian:'Végétarien',vegan:'Vegan',lactose_free:'Sans lactose',gluten_free:'Sans gluten',tayyibat:'Tayibat',none:''}[d])).filter(Boolean).join(', ')}</p>
            )}
            {profile.allergies.length > 0 && (
              <p className="text-[10px] text-gray-400">⚠️ Allergènes exclus : {profile.allergies.join(', ')}</p>
            )}
          </div>
        )}

        {/* Quick Access */}
        <div className="grid grid-cols-2 gap-3">
          {[{ icon: Dumbbell, label: 'Training', path: '/fitness', color: 'text-cali-orange', bg: 'bg-cali-orange/10', grad: 'from-cali-orange to-cali-orange' },
            { icon: Utensils, label: 'Nutrition', path: '/nutrition', color: 'text-cali-green', bg: 'bg-cali-green/10', grad: 'from-cali-green to-cali-green' },
            { icon: Droplets, label: 'Hydratation', path: '/nutrition', color: 'text-cali-blue', bg: 'bg-cali-blue/10', grad: 'from-cali-blue to-cali-blue' },
            { icon: Moon, label: 'Récupération', path: '/sleep', color: 'text-cali-purple', bg: 'bg-cali-purple/10', grad: 'from-cali-purple to-cali-purple' }].map(card => (
            <button key={card.label} onClick={() => router.push(card.path)} className="relative bg-cali-card rounded-2xl p-5 border border-white/5 text-left active:scale-[0.98] overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.grad} opacity-80`} />
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-4`}><card.icon size={22} className={card.color} /></div>
              <p className="text-sm font-bold text-white">{card.label}</p>
            </button>
          ))}
        </div>

        {/* XP */}
        <div className="dash-card bg-cali-card rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><TrendingUp size={16} className="text-cali-orange" /><span className="text-sm font-bold text-white">Progression</span></div><span className="text-xs text-cali-light-text"><span ref={refXp}>{xp}</span> XP</span></div>
          <div className="h-2 bg-cali-surface rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cali-orange to-cali-orange rounded-full transition-all duration-1000" style={{ width: `${(xp % 200) / 2}%` }} /></div>
          <p className="text-[10px] text-cali-light-text mt-1">{200 - (xp % 200)} XP pour le niveau {level + 1}</p>
        </div>

        {/* Next badge hint */}
        {badgeHint && (
          <button onClick={() => router.push('/progress?tab=badges')} className="w-full bg-cali-card rounded-2xl p-4 border border-white/5 flex items-center gap-3 active:scale-[0.99]">
            <span className="text-2xl">{badgeHint.badge.icon}</span>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-white mb-1">{badgeHint.message}</p>
              <div className="h-1.5 bg-cali-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cali-orange to-cali-orange rounded-full transition-all duration-700"
                  style={{ width: `${badgeHint.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{badgeHint.progress}% · +{badgeHint.badge.xp} XP à la clé</p>
            </div>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Emotional Moment Popup */}
      {emotionalPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6" onClick={() => setEmotionalPopup(null)}>
          <div className="w-full max-w-sm bg-cali-card rounded-3xl p-8 text-center animate-bounce-in" onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-4 animate-pulse-glow">{emotionalPopup.icon}</div>
            <h2 className="text-2xl font-display font-black text-white mb-2">{emotionalPopup.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">{emotionalPopup.msg}</p>
            <div className="flex items-center justify-center gap-2 mb-4"><Sparkles size={16} className="text-cali-orange" /><span className="text-sm text-cali-orange font-bold">+50 XP</span></div>
            <button onClick={() => setEmotionalPopup(null)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold">Continuer 💪</button>
          </div>
        </div>
      )}


    </div>
  );
}
