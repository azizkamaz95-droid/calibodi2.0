'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { useGameStore } from '@/lib/gameStore';
import { useFreemiumStore, FREE_LIMITS } from '@/lib/freemiumStore';
import { calculateBMI } from '@/lib/calculations';

import PremiumLock from '@/components/PremiumLock';
import { Trophy, Flame, Dumbbell, Award, Camera, Ruler, CalendarDays, PenLine, Plus, X, TrendingUp, TrendingDown, Lock, Scale, Share2 } from 'lucide-react';
import { shareContent } from '@/components/ShareCard';

type Tab = 'badges' | 'stats' | 'weight' | 'body' | 'photos';

function WeightTracker({ profile, weightHistory, addWeightEntry }: {
  profile: { weight: number; targetWeight: number; goal: string; gender: string };
  weightHistory: { date: string; weight: number }[];
  addWeightEntry: (weight: number) => void;
}) {
  const router = useRouter();
  const isPremiumUser = useFreemiumStore((s) => s.isPremium);
  const [newWeight, setNewWeight] = useState('');
  const [showInput, setShowInput] = useState(false);

  const sorted = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const first = sorted[0];
  const diff = latest && previous ? Math.round((latest.weight - previous.weight) * 10) / 10 : 0;
  const totalDiff = latest && first ? Math.round((latest.weight - first.weight) * 10) / 10 : 0;
  const currentWeight = latest?.weight || profile.weight;
  const remaining = Math.abs(profile.targetWeight - currentWeight);
  const isWeightLoss = profile.goal === 'weight_loss';
  const isMuscle = profile.goal === 'muscle';

  const handleAdd = () => {
    const w = parseFloat(newWeight.replace(',', '.'));
    if (w > 20 && w < 300) {
      addWeightEntry(w);
      setNewWeight('');
      setShowInput(false);
    }
  };

  // Feedback message
  let feedbackMsg = '';
  let feedbackColor = '#FF6B35';
  if (latest && previous) {
    if (isWeightLoss) {
      if (diff < 0) {
        feedbackMsg = `🎉 Bravo ! Tu as perdu ${Math.abs(diff)} kg ! Plus que ${remaining.toFixed(1)} kg pour atteindre ton objectif de ${profile.targetWeight} kg.`;
        feedbackColor = '#22c55e';
      } else if (diff === 0) {
        feedbackMsg = `⚖️ Ton poids est stable. Continue tes efforts, les résultats arrivent souvent par paliers. Reste régulier dans ton programme et ton alimentation.`;
        feedbackColor = '#f59e0b';
      } else {
        feedbackMsg = `💪 +${diff} kg ce n'est pas un échec. Le poids fluctue naturellement (eau, digestion). Continue ton programme, la tendance sur 4 semaines est ce qui compte vraiment.`;
        feedbackColor = '#FF6B35';
      }
    } else if (isMuscle) {
      if (diff > 0) {
        feedbackMsg = `🎉 Excellent ! +${diff} kg de progression ! Plus que ${remaining.toFixed(1)} kg pour atteindre ${profile.targetWeight} kg. Continue comme ça !`;
        feedbackColor = '#22c55e';
      } else if (diff === 0) {
        feedbackMsg = `⚖️ Poids stable. Pour prendre du muscle, assure-toi de manger suffisamment de protéines et d'être en surplus calorique.`;
        feedbackColor = '#f59e0b';
      } else {
        feedbackMsg = `📊 -${Math.abs(diff)} kg. En prise de masse, vérifie que tu manges assez. Augmente légèrement tes portions et tes protéines.`;
        feedbackColor = '#FF6B35';
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Conseil de pesée */}
      <div className="bg-cali-card rounded-2xl p-4 border border-white/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cali-orange/15 flex items-center justify-center flex-shrink-0">
            <Scale size={20} className="text-cali-orange" />
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">💡 Conseil de pesée</p>
            <p className="text-[11px] text-cali-light-text leading-relaxed">
              Pèse-toi <span className="text-cali-orange font-bold">1 fois par semaine</span>, le matin à jeun, après le passage aux toilettes, en sous-vêtements.
              Évite de te peser tous les jours : le poids fluctue naturellement de 0.5 à 1.5 kg selon l&apos;hydratation et la digestion.
            </p>
          </div>
        </div>
      </div>

      {/* Poids actuel + objectif */}
      <div className="bg-cali-card rounded-2xl p-5 border border-white/5 text-center space-y-3">
        <p className="text-3xl font-display font-black text-white">{currentWeight} <span className="text-lg text-cali-light-text">kg</span></p>
        <div className="flex justify-center gap-4 text-xs">
          <span className="text-cali-light-text">Objectif : <span className="text-cali-green font-bold">{profile.targetWeight} kg</span></span>
          <span className="text-cali-light-text">Reste : <span className="text-cali-orange font-bold">{remaining.toFixed(1)} kg</span></span>
        </div>
        {totalDiff !== 0 && (
          <p className="text-xs">
            Depuis le début : <span className={totalDiff < 0 ? 'text-cali-green font-bold' : 'text-cali-blue font-bold'}>
              {totalDiff > 0 ? '+' : ''}{totalDiff} kg
            </span>
          </p>
        )}
        <div className="h-2 bg-cali-surface rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cali-red to-cali-orange transition-all"
            style={{ width: `${Math.min(100, Math.max(5, (1 - remaining / Math.max(1, Math.abs(profile.targetWeight - (first?.weight || profile.weight)))) * 100))}%` }} />
        </div>
        {totalDiff !== 0 && (
          <button
            onClick={() => isPremiumUser ? shareContent('transformation', {
              startWeight: first?.weight || profile.weight,
              currentWeight,
              targetWeight: profile.targetWeight,
              diff: totalDiff,
              weeks: Math.round(sorted.length > 1 ? (new Date(sorted[sorted.length-1].date).getTime() - new Date(sorted[0].date).getTime()) / (1000*60*60*24*7) : 0),
            }) : router.push('/premium')}
            className="w-full py-2.5 rounded-xl bg-cali-surface border border-white/10 text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95"
          >
            {isPremiumUser ? <Share2 size={15} className="text-cali-blue" /> : <Lock size={15} className="text-cali-blue" />} Partager ma transformation
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedbackMsg && (
        <div className="rounded-2xl p-4 border" style={{ background: `${feedbackColor}08`, borderColor: `${feedbackColor}20` }}>
          <p className="text-xs leading-relaxed" style={{ color: feedbackColor }}>{feedbackMsg}</p>
        </div>
      )}

      {/* Bouton ajouter */}
      {!showInput ? (
        <button onClick={() => setShowInput(true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-display font-bold flex items-center justify-center gap-2">
          <Scale size={18} /> Enregistrer mon poids
        </button>
      ) : (
        <div className="bg-cali-card rounded-2xl p-4 border border-white/5 space-y-3">
          <p className="text-sm font-bold text-white">⚖️ Ton poids aujourd&apos;hui</p>
          <div className="flex gap-2">
            <input type="text" inputMode="decimal" value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder={`Ex: ${currentWeight}`}
              className="flex-1 bg-cali-surface rounded-xl px-4 py-3 text-lg text-center text-white placeholder:text-gray-600 border border-white/10 focus:border-cali-orange/40 focus:outline-none font-mono"
              autoFocus />
            <span className="self-center text-cali-light-text text-sm">kg</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-bold text-sm">
              ✓ Valider
            </button>
            <button onClick={() => setShowInput(false)}
              className="py-3 px-4 rounded-xl bg-cali-surface border border-white/10 text-cali-light-text text-sm">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Historique */}
      {sorted.length > 0 && (
        <div className="bg-cali-card rounded-2xl p-4 border border-white/5">
          <p className="text-sm font-bold text-white mb-3">📈 Historique</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...sorted].reverse().map((entry, i, reversed) => {
              const prev = reversed[i + 1];
              const d = prev ? Math.round((entry.weight - prev.weight) * 10) / 10 : 0;
              return (
                <div key={entry.date} className="flex items-center justify-between bg-cali-surface rounded-xl px-3 py-2.5">
                  <span className="text-xs text-cali-light-text">
                    {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{entry.weight} kg</span>
                    {d !== 0 && (
                      <span className={`text-[10px] font-bold ${d < 0 ? 'text-cali-green' : d > 0 ? 'text-cali-orange' : ''}`}>
                        {d > 0 ? '+' : ''}{d}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgressPage() {
  const profile = useUserStore((s) => s.profile);
  const streak = useUserStore((s) => s.streak);
  const totalSessions = useUserStore((s) => s.totalSessions);
  const sessionHistory = useUserStore((s) => s.sessionHistory);
  const xp = useUserStore((s) => s.xp);
  const level = useUserStore((s) => s.level);
  const mensurations = useUserStore((s) => s.mensurations);
  const photos = useUserStore((s) => s.photos);
  const letterUnlocked = useUserStore((s) => s.letterUnlocked);
  const checkLetterUnlock = useUserStore((s) => s.checkLetterUnlock);
  const getDaysSinceStart = useUserStore((s) => s.getDaysSinceStart);
  const addMensuration = useUserStore((s) => s.addMensuration);
  const addPhoto = useUserStore((s) => s.addPhoto);
  const weightHistory = useUserStore((s) => s.weightHistory);
  const addWeightEntry = useUserStore((s) => s.addWeightEntry);
  const badges = useGameStore((s) => s.badges);
  const visitPage = useGameStore((s) => s.visitPage);
  const isPremiumUser = useFreemiumStore((s) => s.isPremium);
  const canAccessAnalytics = isPremiumUser;
  const canAccessAllBadges = isPremiumUser;
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('badges');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('tab') as Tab;
      if (p) setTab(p);
    }
  }, []);
  const [showMensForm, setShowMensForm] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [mensWaist, setMensWaist] = useState(80);
  const [mensChest, setMensChest] = useState(95);
  const [mensArms, setMensArms] = useState(32);
  const [mensThighs, setMensThighs] = useState(55);
  const [mensHips, setMensHips] = useState(95);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoType, setPhotoType] = useState<'front' | 'side' | 'back'>('front');

  useEffect(() => { visitPage('progress'); checkLetterUnlock(); }, []);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const bmi = calculateBMI(profile.weight, profile.height);
  const totalCalories = sessionHistory.reduce((s, r) => s + r.calories, 0);
  const totalMinutes = sessionHistory.reduce((s, r) => s + r.duration, 0);
  const daysSinceStart = getDaysSinceStart();

  // Heatmap data (last 12 weeks)
  const heatmapData = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const count = sessionHistory.filter(s => s.date === d).length;
      days.push({ date: d, count });
    }
    return days;
  }, [sessionHistory]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      addPhoto({ dataUrl, type: photoType });
    };
    reader.readAsDataURL(file);
  };

  const saveMensuration = () => {
    addMensuration({ waist: mensWaist, chest: mensChest, arms: mensArms, thighs: mensThighs, hips: mensHips });
    setShowMensForm(false);
  };

  return (
    <div className="pb-20 page-enter">
      <div className="p-5 space-y-5">
        <h1 className="text-2xl font-display font-black text-white">Progression</h1>

        {/* Letter J30 Banner */}
        {letterUnlocked && (
          <button onClick={() => setShowLetter(true)} className="w-full bg-gradient-to-r from-cali-orange/10 to-cali-orange/10 border border-cali-orange/30 rounded-2xl p-3 flex items-center gap-3 animate-pulse-glow">
            <PenLine size={18} className="text-cali-orange" />
            <div className="text-left flex-1"><p className="text-sm font-bold text-white">📬 Ta lettre J30 est débloquée !</p><p className="text-[10px] text-gray-400">Clique pour relire le message que tu t&apos;es écrit</p></div>
          </button>
        )}
        {!letterUnlocked && daysSinceStart > 0 && (
          <div className="bg-cali-surface rounded-2xl p-3 flex items-center gap-3">
            <PenLine size={16} className="text-gray-600" />
            <p className="text-xs text-gray-500">🔒 Lettre J30 — débloquée dans {Math.max(0, 30 - daysSinceStart)} jours</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          {[{i:Flame,v:streak,l:'Streak',c:'text-cali-orange'},{i:Dumbbell,v:totalSessions,l:'Séances',c:'text-cali-blue'},{i:Trophy,v:`Nv.${level}`,l:`${xp} XP`,c:'text-cali-orange'},{i:Award,v:`${unlockedCount}/${badges.length}`,l:'Badges',c:'text-cali-purple'}].map(s=>(
            <div key={s.l} className="bg-cali-card rounded-2xl p-3 border border-white/5 text-center"><s.i size={16} className={`${s.c} mx-auto mb-1`}/><p className={`text-sm font-bold ${s.c}`}>{s.v}</p><p className="text-[9px] text-gray-600">{s.l}</p></div>
          ))}
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2">
          {([['badges','🏅','Badges'],['stats','📊','Stats'],['weight','⚖️','Poids'],['body','📏','Mensur.']] as [Tab,string,string][]).map(([t,icon,label])=>(
            <button key={t} onClick={()=>setTab(t)} className={`py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${tab===t?'bg-cali-card border-white/10 text-white':'bg-cali-surface border-white/5 text-gray-500'}`}>
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
          <button onClick={()=>setTab('photos')} className={`col-span-2 py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${tab==='photos'?'bg-cali-card border-white/10 text-white':'bg-cali-surface border-white/5 text-gray-500'}`}>
            <span className="text-xl">📸</span>
            <span className="text-xs font-medium">Photos</span>
          </button>
        </div>

        {/* Badges */}
        {tab==='badges'&&(
          <div>
            <div className="grid grid-cols-3 gap-2">{badges.map((badge, i) => {
              const isLocked = !canAccessAllBadges && i >= FREE_LIMITS.badgesVisible;
              return (
              <div key={badge.id} className={`rounded-2xl p-3 text-center border relative ${badge.unlocked && !isLocked?'bg-cali-card border-cali-orange/20 glow-orange':'bg-cali-surface border-white/5 opacity-40'}`}>
                <span className="text-2xl">{isLocked ? '🔒' : badge.icon}</span>
                <p className="text-[10px] font-bold text-white mt-1 truncate">{isLocked ? '???' : badge.name}</p>
                <p className="text-[9px] text-gray-500 truncate">{isLocked ? 'Premium' : badge.condition}</p>
                <p className="text-[9px] text-cali-orange">+{badge.xp} XP</p>
              </div>
            );})}</div>
            {!canAccessAllBadges && (
              <button onClick={() => router.push('/premium')} className="w-full mt-3 bg-gradient-to-r from-cali-orange/10 to-cali-orange/10 border border-cali-orange/30 rounded-2xl p-3 text-center">
                <p className="text-sm font-bold text-white">🏅 Débloquer les 18 badges</p>
                <p className="text-xs text-cali-orange font-bold mt-1">Passer Premium →</p>
              </button>
            )}
          </div>
        )}

        {/* Stats + Heatmap */}
        {tab==='stats'&&(
          <div className="space-y-4">
            {/* Heatmap */}
            <div className="bg-cali-card rounded-2xl p-4 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><CalendarDays size={16} className="text-cali-green"/>Activité (12 semaines)</h3>
              <div className="grid grid-cols-12 gap-1">{heatmapData.map((d,i)=>{
                const c = d.count===0?'bg-cali-surface':d.count===1?'bg-cali-green/40':'bg-cali-green';
                return <div key={i} className={`w-full aspect-square rounded-sm ${c}`} title={`${d.date}: ${d.count} séance(s)`}/>;
              })}</div>
              <div className="flex items-center gap-2 mt-2 justify-end">
                <span className="text-[9px] text-gray-600">Moins</span>
                {['bg-cali-surface','bg-cali-green/40','bg-cali-green'].map((c,i)=><div key={i} className={`w-3 h-3 rounded-sm ${c}`}/>)}
                <span className="text-[9px] text-gray-600">Plus</span>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-cali-card rounded-2xl p-4 border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp size={16} className="text-cali-blue"/>Résumé</h3>
              {[['Programme','Jour '+daysSinceStart+' / '+profile.programDuration],['Séances totales',`${totalSessions}`],['Temps total',`${totalMinutes} min`],['Calories brûlées',`${totalCalories} kcal`],['Record streak',`${streak} jours`],['IMC',`${bmi}`],['Poids',`${profile.weight} kg → ${profile.targetWeight} kg`]].map(([l,v])=>(
                <div key={l} className="flex justify-between"><span className="text-sm text-gray-400">{l}</span><span className="text-sm text-white font-bold">{v}</span></div>
              ))}
            </div>

            {/* XP */}
            <div className="bg-cali-card rounded-2xl p-4 border border-white/5">
              <div className="h-3 bg-cali-surface rounded-full overflow-hidden mb-2"><div className="h-full bg-gradient-to-r from-cali-orange to-cali-orange rounded-full" style={{width:`${(xp%200)/2}%`}}/></div>
              <div className="flex justify-between text-xs text-gray-500"><span>Nv.{level}</span><span>{xp%200}/200 XP</span><span>Nv.{level+1}</span></div>
            </div>
          </div>
        )}

        {/* ═══ POIDS ═══ */}
        {tab==='weight'&&(
          <WeightTracker
            profile={profile}
            weightHistory={weightHistory}
            addWeightEntry={addWeightEntry}
          />
        )}

        {/* Mensurations */}
        {tab==='body'&&(
          canAccessAnalytics ? (
          <div className="space-y-4">
            <button onClick={()=>setShowMensForm(true)} className="w-full py-3 rounded-2xl bg-cali-orange/15 border border-cali-orange/30 text-sm font-medium text-cali-orange flex items-center justify-center gap-2"><Plus size={16}/>Nouvelle mesure</button>
            {mensurations.length===0?(
              <div className="bg-cali-surface rounded-2xl p-8 text-center"><Ruler size={24} className="text-gray-600 mx-auto mb-2"/><p className="text-gray-500 text-sm">Aucune mesure enregistrée</p><p className="text-gray-600 text-xs mt-1">Ajoute tes mensurations pour suivre ta transformation</p></div>
            ):(
              <div className="space-y-2">{[...mensurations].reverse().map((m,i)=>(
                <div key={i} className="bg-cali-card rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-500 mb-2">{m.date}</p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[['Taille',m.waist],['Poitrine',m.chest],['Bras',m.arms],['Cuisses',m.thighs],['Hanches',m.hips]].map(([l,v])=>(
                      <div key={l}><p className="text-sm font-bold text-cali-blue">{v}</p><p className="text-[9px] text-gray-500">{l} cm</p></div>
                    ))}
                  </div>
                </div>
              ))}</div>
            )}
          </div>
          ) : (
            <PremiumLock feature="advanced_analytics" message="Suis ta transformation avec tes mensurations détaillées">
              <div className="bg-cali-card rounded-2xl p-6 text-center"><Ruler size={24} className="text-gray-600 mx-auto mb-2" /><p className="text-gray-500 text-sm">Mensurations</p></div>
            </PremiumLock>
          )
        )}

        {/* Photos — Avant / Après */}
        {tab==='photos'&&(
          canAccessAnalytics ? (
          <div className="space-y-4">
            <div className="bg-cali-orange/5 border border-cali-orange/20 rounded-2xl p-3 text-center">
              <p className="text-xs font-bold text-cali-orange">📸 Avant / Après</p>
              <p className="text-[11px] text-gray-300 mt-1">Prends des photos régulièrement pour voir ta transformation</p>
            </div>
            <p className="text-xs text-gray-400 font-bold">Ajouter une photo</p>
            <div className="grid grid-cols-3 gap-2">
              {[{type:'front' as const,label:'De face',icon:'🧍'},{type:'side' as const,label:'De profil',icon:'🧍‍♂️'},{type:'back' as const,label:'De dos',icon:'🔙'}].map(t=>(
                <button key={t.type} onClick={()=>{setPhotoType(t.type);fileInputRef.current?.click()}}
                  className="py-3 rounded-2xl bg-cali-surface border border-white/5 text-center hover:border-cali-green/30">
                  <span className="text-2xl">{t.icon}</span>
                  <p className="text-[10px] text-gray-400 mt-1">{t.label}</p>
                </button>
              ))}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload}/>
            {photos.length===0?(
              <div className="bg-cali-surface rounded-2xl p-8 text-center"><Camera size={24} className="text-gray-600 mx-auto mb-2"/><p className="text-gray-500 text-sm">Aucune photo encore</p><p className="text-gray-600 text-xs mt-1">Ta première photo sera ton point de départ</p></div>
            ):(
              <div>
                {/* Group by type */}
                {['front','side','back'].map(type=>{
                  const typePhotos = photos.filter(p=>p.type===type);
                  if(typePhotos.length===0) return null;
                  const typeLabel = {front:'De face',side:'De profil',back:'De dos'}[type];
                  return (
                    <div key={type} className="mb-4">
                      <p className="text-xs text-gray-400 font-bold mb-2">{typeLabel}</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {typePhotos.map(p=>(
                          <div key={p.id} className="relative flex-shrink-0 w-28 rounded-2xl overflow-hidden border border-white/5">
                            <img src={p.dataUrl} alt={typeLabel} className="w-full aspect-[3/4] object-cover"/>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5"><p className="text-[9px] text-white">{p.date}</p></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          ) : (
            <PremiumLock feature="advanced_analytics" message="Documente ta transformation avec des photos avant/après">
              <div className="bg-cali-card rounded-2xl p-6 text-center"><Camera size={24} className="text-gray-600 mx-auto mb-2" /><p className="text-gray-500 text-sm">Photos avant/après</p></div>
            </PremiumLock>
          )
        )}
      </div>
      {showMensForm&&(
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={()=>setShowMensForm(false)}>
          <div className="w-full max-w-lg bg-cali-card rounded-t-3xl p-5 animate-slide-up space-y-4" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-display font-bold text-white">Mensurations</h3><button onClick={()=>setShowMensForm(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16} className="text-gray-400"/></button></div>
            {[{l:'Tour de taille',v:mensWaist,s:setMensWaist,min:50,max:150},{l:'Poitrine',v:mensChest,s:setMensChest,min:60,max:150},{l:'Bras',v:mensArms,s:setMensArms,min:20,max:60},{l:'Cuisses',v:mensThighs,s:setMensThighs,min:30,max:90},{l:'Hanches',v:mensHips,s:setMensHips,min:60,max:150}].map(i=>(
              <div key={i.l} className="bg-cali-surface rounded-xl p-3"><div className="flex justify-between mb-1"><span className="text-xs text-gray-400">{i.l}</span><span className="text-sm font-bold text-white">{i.v} cm</span></div>
                <input type="range" min={i.min} max={i.max} value={i.v} onChange={e=>i.s(Number(e.target.value))} className="w-full accent-cali-blue"/></div>
            ))}
            <button onClick={saveMensuration} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold">Enregistrer</button>
          </div>
        </div>
      )}

      {/* Letter Modal */}
      {showLetter&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={()=>setShowLetter(false)}>
          <div className="w-full max-w-md bg-cali-card rounded-3xl p-6 animate-bounce-in space-y-4" onClick={e=>e.stopPropagation()}>
            <div className="text-center"><span className="text-4xl">📬</span><h3 className="text-lg font-display font-bold text-white mt-2">Ta lettre du jour 1</h3><p className="text-xs text-gray-500">Écrite il y a {daysSinceStart} jours</p></div>
            <div className="bg-cali-surface rounded-2xl p-4"><p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{profile.personalLetter || 'Tu n\'as pas écrit de lettre.'}</p></div>
            <button onClick={()=>setShowLetter(false)} className="w-full py-3 rounded-2xl bg-cali-surface text-white text-sm font-medium">Fermer</button>
          </div>
        </div>
      )}


    </div>
  );
}
