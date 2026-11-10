'use client';
import { useMemo } from 'react';
import { useUserStore } from '@/lib/userStore';
import { useNutritionStore } from '@/lib/nutritionStore';
import { calculateBMI, calculateTDEE } from '@/lib/calculations';
import { TrendingDown, TrendingUp, Flame, Utensils, Target, Zap, Activity } from 'lucide-react';

function getBMICategory(bmi: number): { label: string; color: string; emoji: string } {
  if (bmi < 16.5) return { label: 'Dénutrition', color: '#ef4444', emoji: '⚠️' };
  if (bmi < 18.5) return { label: 'Maigreur', color: '#f97316', emoji: '🔻' };
  if (bmi < 25) return { label: 'Normal', color: '#22c55e', emoji: '✅' };
  if (bmi < 30) return { label: 'Surpoids', color: '#f97316', emoji: '⚡' };
  if (bmi < 35) return { label: 'Obésité I', color: '#f97316', emoji: '⚠️' };
  if (bmi < 40) return { label: 'Obésité II', color: '#ef4444', emoji: '🔴' };
  return { label: 'Obésité III', color: '#dc2626', emoji: '🔴' };
}

function getGoalLabel(goal: string): string {
  switch (goal) {
    case 'weight_loss': return '🔥 Sèche';
    case 'muscle': return '💪 Prise de masse';
    case 'endurance': return '🏃 Endurance';
    default: return '❤️ Santé';
  }
}

function getPrediction(goal: string, weight: number, targetWeight: number, deficitValue: number, tdee: number): {
  title: string; message: string; icon: string; detail: string; color: string;
} {
  if (goal === 'muscle') {
    const surplusPerDay = Math.max(0, deficitValue);
    const weeklyMuscleGainPercent = surplusPerDay > 200 ? 1.5 : surplusPerDay > 100 ? 1.0 : 0.5;
    const monthlyGainPercent = weeklyMuscleGainPercent * 4;
    const weeksTo10Percent = Math.round(10 / weeklyMuscleGainPercent);
    return {
      title: '💪 Progression musculaire',
      icon: '🏋️',
      message: `Si tu suis le programme, dans 7 jours tes muscles seront environ ${Math.round(weeklyMuscleGainPercent * 7)}% plus visibles.`,
      detail: `+${monthlyGainPercent.toFixed(0)}% de définition/mois · Visible en ~${weeksTo10Percent} sem.`,
      color: '#3b82f6',
    };
  } else {
    const dailyDeficit = Math.abs(deficitValue);
    const weeklyLossKg = dailyDeficit > 0 ? (dailyDeficit * 7) / 7700 : 0;
    const weightIn7Days = Math.round((weight - weeklyLossKg) * 10) / 10;
    const totalToLose = Math.abs(targetWeight - weight);
    const weeksToGoal = weeklyLossKg > 0 ? Math.round(totalToLose / weeklyLossKg) : 0;
    return {
      title: '🔥 Projection perte de poids',
      icon: '📉',
      message: `Si tu suis le programme, dans 7 jours tu pèseras environ ${weightIn7Days} kg (−${weeklyLossKg.toFixed(1)} kg).`,
      detail: weeksToGoal > 0 ? `Objectif ${targetWeight} kg atteint en ~${weeksToGoal} semaines` : 'Définis un objectif de poids',
      color: '#22c55e',
    };
  }
}

export default function BodyStatsWidget() {
  const profile = useUserStore((s) => s.profile);
  const lastSessionDate = useUserStore((s) => s.lastSessionDate);
  const totals = useNutritionStore((s) => s.getTodayTotals());
  const remaining = useNutritionStore((s) => s.getRemaining());
  const goals = useNutritionStore((s) => ({
    kcal: s.dailyGoalKcal, protein: s.dailyGoalProtein,
  }));

  const bmi = useMemo(() => calculateBMI(profile.weight, profile.height), [profile.weight, profile.height]);
  const bmiCat = useMemo(() => getBMICategory(bmi), [bmi]);
  const sessionsPerWeek = profile.sessionsPerWeek || 3;
  const activityLevel = sessionsPerWeek <= 1 ? 0 : sessionsPerWeek <= 2 ? 1 : sessionsPerWeek <= 4 ? 2 : sessionsPerWeek <= 5 ? 3 : 4;
  const tdee = useMemo(() => calculateTDEE(profile.weight, profile.height, profile.age, profile.gender, activityLevel), [profile.weight, profile.height, profile.age, profile.gender, activityLevel]);

  // BMR (calories brûlées au repos sans sport)
  const bmr = useMemo(() => {
    if (profile.gender === 'male') {
      return Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5);
    } else {
      return Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161);
    }
  }, [profile.weight, profile.height, profile.age, profile.gender]);

  // Calories brûlées AU REPOS aujourd'hui (proportionnel aux heures écoulées)
  const hoursElapsed = new Date().getHours() + new Date().getMinutes() / 60;
  const restCaloriesToday = Math.round((bmr / 24) * hoursElapsed);

  // Calories brûlées pendant la séance (seulement si une séance a été faite aujourd'hui)
  const todayStr = new Date().toISOString().split('T')[0];
  const didSessionToday = lastSessionDate === todayStr;
  const sessionCalories = didSessionToday ? 250 : 0; // ~250 kcal pour une séance de calisthenics

  // Total brûlé = repos + séance
  const totalBurned = restCaloriesToday + sessionCalories;

  const deficit = useMemo(() => {
    const diff = goals.kcal - tdee;
    if (diff < -100) return { label: 'Déficit', value: Math.abs(diff), color: '#22c55e', emoji: '🔥', isDeficit: true };
    if (diff > 100) return { label: 'Surplus', value: diff, color: '#3b82f6', emoji: '💪', isDeficit: false };
    return { label: 'Maintien', value: 0, color: '#a855f7', emoji: '⚖️', isDeficit: false };
  }, [goals.kcal, tdee]);

  // Balance = mangé - brûlé (repos + sport)
  const todayBalance = totals.kcal - totalBurned;

  const prediction = useMemo(() =>
    getPrediction(profile.goal, profile.weight, profile.targetWeight, deficit.isDeficit ? -deficit.value : deficit.value, tdee),
    [profile.goal, profile.weight, profile.targetWeight, deficit, tdee]
  );

  // BMI gauge position (16 to 40 range → 0% to 100%)
  const gaugePercent = Math.min(100, Math.max(0, ((bmi - 16) / (40 - 16)) * 100));

  return (
    <div className="space-y-4">
      {/* IMC Card */}
      <div className="bg-cali-card rounded-3xl p-5 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">📊 Mon Corps</h3>
          <span className="text-[10px] text-cali-light-text bg-cali-surface px-2 py-0.5 rounded-lg">{getGoalLabel(profile.goal)}</span>
        </div>

        {/* BMI Gauge — IMPROVED */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-display font-black text-white">{bmi}</span>
              <span className="text-xs text-cali-light-text">IMC</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ color: bmiCat.color, background: `${bmiCat.color}15` }}>
              {bmiCat.emoji} {bmiCat.label}
            </span>
          </div>

          {/* Zone labels above the gauge */}
          <p className="text-[8px] text-cali-light-text text-center mb-0.5 opacity-60">▼ Zones de l&apos;IMC (échelle médicale)</p>
          <div className="flex text-[7px] text-center mb-0.5">
            <span className="flex-[10] text-orange-400">Maigre</span>
            <span className="flex-[27] text-green-400">Normal</span>
            <span className="flex-[21] text-orange-400">Surpoids</span>
            <span className="flex-[21] text-red-400">Obésité</span>
            <span className="flex-[21] text-red-500">Ob. sévère</span>
          </div>

          {/* Gauge bar */}
          <div className="relative h-5 rounded-full overflow-visible mb-8">
            <div className="absolute inset-0 h-4 top-0.5 flex rounded-full overflow-hidden">
              <div className="h-full flex-[10]" style={{ background: '#f97316' }} />
              <div className="h-full flex-[27]" style={{ background: '#22c55e' }} />
              <div className="h-full flex-[21]" style={{ background: '#f97316' }} />
              <div className="h-full flex-[21]" style={{ background: '#ef4444' }} />
              <div className="h-full flex-[21]" style={{ background: '#b91c1c' }} />
            </div>
            {/* BIG visible indicator */}
            <div className="absolute -top-1" style={{ left: `${gaugePercent}%`, transform: 'translateX(-50%)', transition: 'left 0.8s ease-out' }}>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-sm bg-white border-2 border-cali-orange shadow-[0_0_10px_rgba(255,107,53,0.6),0_0_20px_rgba(255,255,255,0.3)] rotate-45 transform" />
              </div>
            </div>
            {/* "Tu es ici" label */}
            <div className="absolute -bottom-6" style={{ left: `${gaugePercent}%`, transform: 'translateX(-50%)', transition: 'left 0.8s ease-out' }}>
              <span className="text-[9px] font-bold text-cali-orange whitespace-nowrap bg-cali-orange/10 px-1.5 py-0.5 rounded border border-cali-orange/30">
                👤 Tu es ici
              </span>
            </div>
          </div>
          <div className="flex justify-between text-[8px] text-cali-light-text">
            <span>16</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span>
          </div>
        </div>

        {/* ═══ BILAN CALORIQUE CLAIR ═══ */}
        <div className="bg-cali-surface rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <Flame size={14} className="text-cali-orange" /> Bilan calorique du jour
          </p>

          {/* Ton budget */}
          <div className="flex items-center justify-between bg-cali-card rounded-xl px-3 py-2.5 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cali-green/15 flex items-center justify-center">
                <Target size={14} className="text-cali-green" />
              </div>
              <div>
                <p className="text-[10px] text-cali-light-text">Ton budget du jour</p>
                <p className="text-lg font-bold text-cali-green">{goals.kcal} kcal</p>
              </div>
            </div>
          </div>

          {/* ═══ DÉFICIT CALORIQUE — BIEN VISIBLE ═══ */}
          <div className="rounded-2xl p-4 text-center border" style={{
            background: deficit.isDeficit ? 'rgba(34,197,94,0.06)' : 'rgba(59,130,246,0.06)',
            borderColor: deficit.isDeficit ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)',
          }}>
            <p className="text-[10px] text-cali-light-text mb-1">
              {deficit.isDeficit ? '🔥 Déficit calorique prévu par jour' : '💪 Surplus calorique prévu par jour'}
            </p>
            <p className="text-3xl font-display font-black" style={{ color: deficit.color }}>
              {deficit.isDeficit ? '−' : '+'}{deficit.value} kcal
            </p>
            <p className="text-[10px] text-cali-light-text mt-1">
              TDEE {tdee} kcal − Budget {goals.kcal} kcal
            </p>
          </div>

          {/* Calories mangées */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cali-orange/15 flex items-center justify-center">
                <Utensils size={14} className="text-cali-orange" />
              </div>
              <div>
                <p className="text-[10px] text-cali-light-text">Tu as mangé</p>
                <p className="text-lg font-bold text-cali-orange">{totals.kcal} kcal</p>
              </div>
            </div>
            <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cali-red to-cali-orange" style={{ width: `${Math.min(100, (totals.kcal / goals.kcal) * 100)}%` }} />
            </div>
          </div>

          {/* Calories brûlées — au repos + sport séparé */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cali-red/15 flex items-center justify-center">
                <Activity size={14} className="text-cali-red" />
              </div>
              <div>
                <p className="text-[10px] text-cali-light-text">Calories brûlées</p>
                <p className="text-lg font-bold text-cali-red">{totalBurned} kcal</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-cali-light-text">🧍 Repos : {restCaloriesToday}</p>
              {didSessionToday ? (
                <p className="text-[9px] text-cali-green font-bold">🏋️ Séance : +{sessionCalories}</p>
              ) : (
                <p className="text-[9px] text-cali-light-text opacity-50">Pas de séance aujourd&apos;hui</p>
              )}
            </div>
          </div>

          {/* Il te reste */}
          {remaining.kcal > 0 ? (
            <div className="bg-cali-green/8 border border-cali-green/20 rounded-xl px-3 py-2.5 text-center">
              <p className="text-[10px] text-cali-light-text mb-0.5">Il te reste à manger</p>
              <p className="text-xl font-black text-cali-green">{remaining.kcal} kcal</p>
              <p className="text-[10px] text-cali-light-text">{remaining.protein}g protéines · {remaining.carbs}g glucides · {remaining.fat}g lipides</p>
            </div>
          ) : totals.kcal > 0 ? (
            <div className="bg-cali-red/8 border border-cali-red/20 rounded-xl px-3 py-2.5 text-center">
              <p className="text-[10px] text-cali-light-text mb-0.5">Budget dépassé de</p>
              <p className="text-xl font-black text-cali-red">{Math.abs(remaining.kcal)} kcal</p>
            </div>
          ) : null}

          {/* Balance du jour */}
          <div className={`flex items-center justify-between rounded-xl px-3 py-2 border ${todayBalance < 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-cali-orange/5 border-cali-orange/20'}`}>
            <div className="flex items-center gap-2">
              {todayBalance < 0 ? <TrendingDown size={14} className="text-green-400" /> : <TrendingUp size={14} className="text-cali-orange" />}
              <span className="text-[10px] text-cali-light-text">Balance (mangé − brûlé)</span>
            </div>
            <span className={`text-sm font-black ${todayBalance < 0 ? 'text-green-400' : 'text-cali-orange'}`}>
              {todayBalance > 0 ? '+' : ''}{todayBalance} kcal
            </span>
          </div>
        </div>

        {/* TDEE / Objectif compact */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-cali-surface rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-cali-orange">{tdee}</p>
            <p className="text-[9px] text-cali-light-text">TDEE (dépense totale/j)</p>
          </div>
          <div className="bg-cali-surface rounded-xl p-3 text-center">
            <p className="text-lg font-bold" style={{ color: deficit.color }}>{deficit.emoji} {deficit.value}</p>
            <p className="text-[9px] text-cali-light-text">{deficit.label} prévu/j</p>
          </div>
        </div>
      </div>

      {/* Prediction Card — 7 days IA */}
      <div className="bg-gradient-to-br from-cali-card to-cali-surface rounded-3xl p-5 border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cali-red/20 to-cali-orange/20 flex items-center justify-center">
            <Target size={18} className="text-cali-orange" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{prediction.title}</h3>
            <p className="text-[10px] text-cali-light-text">Basé sur ton programme actuel</p>
          </div>
        </div>

        <p className="text-sm text-white leading-relaxed">{prediction.message}</p>

        <div className="rounded-xl px-3 py-2 border" style={{ borderColor: `${prediction.color}30`, background: `${prediction.color}08` }}>
          <p className="text-xs font-medium" style={{ color: prediction.color }}>{prediction.detail}</p>
        </div>

        {profile.goal === 'weight_loss' && Math.abs(profile.targetWeight - profile.weight) > 0.5 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-cali-light-text">{profile.weight} kg</span>
              <span className="text-cali-green font-bold">{profile.targetWeight} kg 🎯</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cali-red to-cali-orange transition-all duration-1000"
                style={{ width: `${Math.max(5, Math.min(95, ((profile.weight - profile.targetWeight) / (profile.weight * 0.3)) * 100))}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
