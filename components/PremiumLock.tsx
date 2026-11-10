'use client';
import { useRouter } from 'next/navigation';
import { useFreemiumStore } from '@/lib/freemiumStore';
import type { PremiumFeature } from '@/lib/freemiumStore';
import { Lock, Crown, Sparkles } from 'lucide-react';

interface PremiumLockProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  message?: string;
  compact?: boolean;
}

export default function PremiumLock({ feature, children, message, compact = false }: PremiumLockProps) {
  const isPremium = useFreemiumStore((s) => s.isPremium);
  const router = useRouter();

  if (isPremium) return <>{children}</>;

  if (compact) {
    return (
      <button onClick={() => router.push('/premium')} className="relative w-full group">
        <div className="opacity-25 pointer-events-none blur-[3px] saturate-50">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2 border border-orange-400/30 shadow-lg shadow-orange-500/10 group-active:scale-95 transition-transform">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Lock size={12} className="text-white" />
            </div>
            <span className="text-xs font-bold text-orange-400">PREMIUM</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button onClick={() => router.push('/premium')} className="relative w-full rounded-2xl overflow-hidden group">
      <div className="opacity-20 pointer-events-none blur-[4px] saturate-0">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-orange-500/20"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,45,85,0.08) 50%, rgba(255,107,53,0.08) 100%)' }}>
        {/* Glow circle */}
        <div className="absolute w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center mb-3 shadow-lg shadow-orange-500/30">
            <Crown size={26} className="text-white" />
          </div>
          <p className="text-sm font-display font-bold text-white">Débloquer avec Premium</p>
          {message && <p className="text-[11px] text-gray-400 mt-1 max-w-[250px] text-center leading-relaxed">{message}</p>}
          <div className="mt-3 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30 group-active:scale-95 transition-transform">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles size={14} /> Passer Premium
            </span>
          </div>
          <p className="text-[10px] text-orange-400/60 mt-2">À partir de 4,99€/mois</p>
        </div>
      </div>
    </button>
  );
}

// Inline badge — orange vif with glow
export function LockBadge({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  return (
    <button onClick={onClick || (() => router.push('/premium'))}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 shadow-md shadow-orange-500/20 active:scale-90 transition-transform"
      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF2D55 100%)' }}>
      <Lock size={9} className="text-white" />
      <span className="text-[8px] font-black text-white tracking-wider">PREMIUM</span>
    </button>
  );
}
