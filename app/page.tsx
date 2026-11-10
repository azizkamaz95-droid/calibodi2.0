'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';

export default function Home() {
  const router = useRouter();
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onboardingComplete) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [onboardingComplete, router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-cali-dark">
      <div className="text-center animate-fade-in">
        {/* Smartphone illustration */}
        <div className="relative w-40 h-64 mx-auto mb-6">
          {/* Phone body */}
          <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f18] shadow-[0_0_60px_rgba(255,107,53,0.15),0_0_30px_rgba(255,45,85,0.1)]">
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-cali-dark rounded-full" />
            {/* Screen content */}
            <div className="absolute top-8 left-3 right-3 bottom-6 rounded-xl overflow-hidden bg-cali-dark/80">
              {/* Mini dashboard mockup */}
              <div className="p-2 space-y-2">
                {/* Mini header */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-2 rounded bg-gradient-to-r from-cali-red to-cali-orange" />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cali-orange to-cali-red" />
                </div>
                {/* Mini ring */}
                <div className="flex justify-center py-1">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="url(#splashGrad)" strokeWidth="3"
                      strokeLinecap="round" strokeDasharray="113" strokeDashoffset="30"
                      className="animate-ring-fill" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                    <defs>
                      <linearGradient id="splashGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FF2D55" />
                        <stop offset="100%" stopColor="#FF6B35" />
                      </linearGradient>
                    </defs>
                    <text x="24" y="26" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">87</text>
                  </svg>
                </div>
                {/* Mini cards */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="h-7 rounded-lg bg-cali-orange/10 border border-cali-orange/20 flex items-center justify-center">
                    <span className="text-[6px] text-cali-orange font-bold">💪 Training</span>
                  </div>
                  <div className="h-7 rounded-lg bg-cali-green/10 border border-cali-green/20 flex items-center justify-center">
                    <span className="text-[6px] text-cali-green font-bold">🥗 Nutrition</span>
                  </div>
                  <div className="h-7 rounded-lg bg-cali-blue/10 border border-cali-blue/20 flex items-center justify-center">
                    <span className="text-[6px] text-cali-blue font-bold">💧 Hydratation</span>
                  </div>
                  <div className="h-7 rounded-lg bg-cali-purple/10 border border-cali-purple/20 flex items-center justify-center">
                    <span className="text-[6px] text-cali-purple font-bold">🌙 Sommeil</span>
                  </div>
                </div>
                {/* Mini stats */}
                <div className="h-4 rounded-lg bg-gradient-to-r from-cali-red/20 to-cali-orange/20 border border-white/5" />
                <div className="h-3 rounded bg-white/5" />
              </div>
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />
          </div>
          {/* Glow effect behind phone */}
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-cali-red/20 via-cali-orange/10 to-transparent blur-2xl -z-10 animate-pulse-glow" />
        </div>

        {/* App name */}
        <p className="text-4xl font-display font-black bg-gradient-to-r from-cali-red to-cali-orange bg-clip-text text-transparent">
          CaliBodi
        </p>
        <p className="text-sm text-cali-light-text mt-2">Ton coaching fitness intelligent</p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <div className="w-2 h-2 rounded-full bg-cali-red animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-cali-orange animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-cali-red animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
