'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Dumbbell, Utensils, Moon, User } from 'lucide-react';
import dynamic from 'next/dynamic';

const CalixChat = dynamic(() => import('./CalixChat'), { ssr: false });

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home,     label: 'Accueil',  activeBg: 'bg-cali-orange', inactiveColor: 'text-cali-orange', glow: 'shadow-[0_0_16px_rgba(255,107,53,0.6)]' },
  { path: '/fitness',   icon: Dumbbell, label: 'Training', activeBg: 'bg-cali-red',    inactiveColor: 'text-cali-red',    glow: 'shadow-[0_0_16px_rgba(255,45,85,0.6)]'  },
  { path: '/nutrition', icon: Utensils, label: 'Nutrition',activeBg: 'bg-cali-green',  inactiveColor: 'text-cali-green',  glow: 'shadow-[0_0_16px_rgba(48,209,88,0.6)]'  },
  { path: '/sleep',     icon: Moon,     label: 'Récup',    activeBg: 'bg-cali-purple', inactiveColor: 'text-cali-purple', glow: 'shadow-[0_0_16px_rgba(191,90,242,0.6)]' },
  { path: '/profile',   icon: User,     label: 'Profil',   activeBg: 'bg-cali-blue',   inactiveColor: 'text-cali-blue',   glow: 'shadow-[0_0_16px_rgba(10,132,255,0.6)]' },
];

const HIDDEN_ON = ['/session', '/onboarding', '/premium', '/'];

function NavBtn({ item, pathname, router }: { item: typeof NAV_ITEMS[0]; pathname: string; router: ReturnType<typeof useRouter> }) {
  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
  const Icon = item.icon;
  return (
    <button onClick={() => router.push(item.path)}
      className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-90">
      <div className={`flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-300 ${
        isActive ? `${item.activeBg} ${item.glow} scale-110` : 'bg-transparent'
      }`}>
        <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 1.8}
          className={isActive ? 'text-white' : `${item.inactiveColor} opacity-50`} />
      </div>
      <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${
        isActive ? 'text-white' : 'text-gray-600'
      }`}>{item.label}</span>
    </button>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showCalix, setShowCalix] = useState(false);

  if (!pathname || HIDDEN_ON.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return null;
  }

  return (
    <>
      {showCalix && <CalixChat onClose={() => setShowCalix(false)} />}

      <style>{`
        @keyframes calix-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          40%  { transform: scale(1.5); opacity: 0.3; }
          60%  { transform: scale(1);   opacity: 0.7; }
          80%  { transform: scale(1.4); opacity: 0.2; }
          100% { transform: scale(1);   opacity: 0; }
        }
        .calix-ring-1 { animation: calix-pulse 1.4s ease-out infinite; }
        .calix-ring-2 { animation: calix-pulse 1.4s ease-out 0.25s infinite; }
      `}</style>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/8">
        <div className="max-w-lg mx-auto flex justify-around items-center h-[68px] px-2">

          {NAV_ITEMS.map(item => <NavBtn key={item.path} item={item} pathname={pathname} router={router} />)}

          {/* Calix — bouton rond avec avatar + heartbeat */}
          <button onClick={() => setShowCalix(true)}
            className="flex flex-col items-center justify-center gap-1 flex-shrink-0 px-1 active:scale-90 transition-all duration-200">
            <div className="relative flex items-center justify-center">
              {/* Anneaux de pulsation */}
              <div className="calix-ring-1 absolute inset-0 rounded-full border-2 border-cali-orange" style={{ margin: '-4px' }} />
              <div className="calix-ring-2 absolute inset-0 rounded-full border border-cali-red" style={{ margin: '-8px' }} />
              {/* Cercle principal avec image */}
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-cali-orange"
                style={{ boxShadow: '0 0 14px rgba(255,107,53,0.6)' }}>
                <img src="/calix-avatar.png" alt="Calix" className="w-full h-full object-cover object-top" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-cali-orange tracking-wide">Calix</span>
          </button>

        </div>
        <div className="h-safe-area-bottom" />
      </nav>
    </>
  );
}
