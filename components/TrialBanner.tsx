'use client';
import { useRouter } from 'next/navigation';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { Crown, Sparkles, AlertTriangle } from 'lucide-react';

export default function TrialBanner() {
  const router = useRouter();
  const isPremium = useFreemiumStore((s) => s.isPremium);
  const trialDaysRemaining = useFreemiumStore((s) => s.trialDaysRemaining);
  const trialExpired = useFreemiumStore((s) => s.trialExpired);
  const plan = useFreemiumStore((s) => s.plan);

  // Already paid premium
  if (isPremium && plan !== 'free') return null;

  // Trial expired
  if (trialExpired || (!isPremium && plan === 'free')) {
    return (
      <button onClick={() => router.push('/premium')}
        className="w-full rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform animate-pulse-glow"
        style={{ background: 'linear-gradient(135deg, rgba(255,45,85,0.2) 0%, rgba(255,107,53,0.2) 100%)', border: '1px solid rgba(255,45,85,0.4)' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
          <AlertTriangle size={20} className="text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-display font-bold text-white">Ton essai est terminé</p>
          <p className="text-[10px] text-gray-300">Passe Premium pour continuer à progresser</p>
        </div>
        <div className="px-3 py-1.5 rounded-full text-[10px] font-black text-white"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}>
          4,99€/mois
        </div>
      </button>
    );
  }

  // Active trial
  if (!isPremium || trialDaysRemaining <= 0) return null;

  const urgency = trialDaysRemaining <= 1 ? 'high' : trialDaysRemaining <= 3 ? 'medium' : 'low';
  const bg = urgency === 'high'
    ? 'linear-gradient(135deg, rgba(255,45,85,0.15) 0%, rgba(255,107,53,0.15) 100%)'
    : urgency === 'medium'
      ? 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,214,10,0.12) 100%)'
      : 'linear-gradient(135deg, rgba(191,90,242,0.1) 0%, rgba(255,107,53,0.1) 100%)';
  const borderColor = urgency === 'high' ? 'rgba(255,45,85,0.3)' : urgency === 'medium' ? 'rgba(255,107,53,0.3)' : 'rgba(191,90,242,0.2)';

  return (
    <button onClick={() => router.push('/premium')}
      className={`w-full rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform ${urgency === 'high' ? 'animate-pulse-glow' : ''}`}
      style={{ background: bg, border: `1px solid ${borderColor}` }}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
        {urgency === 'low' ? <Sparkles size={18} className="text-white" /> : <Crown size={18} className="text-white" />}
      </div>
      <div className="flex-1 text-left">
        <p className="text-xs font-bold text-white">
          {urgency === 'high' ? 'Dernier jour d\'essai !' : urgency === 'medium' ? `Plus que ${trialDaysRemaining} jours d'essai` : `${trialDaysRemaining} jours d'essai Premium`}
        </p>
        <p className="text-[10px] text-gray-400">
          {urgency === 'high' ? 'Ne perds pas Calix et tes avantages' : 'Profite de toutes les fonctionnalités'}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-lg font-display font-black ${urgency === 'high' ? 'text-red-400' : 'text-orange-400'}`}>J{trialDaysRemaining}</p>
      </div>
    </button>
  );
}
