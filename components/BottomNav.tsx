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

  const leftItems  = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  return (
    <>
      {showCalix && <CalixChat onClose={() => setShowCalix(false)} />}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/8">
        <div className="max-w-lg mx-auto flex justify-around items-center h-[68px] px-2">

          {leftItems.map(item => <NavBtn key={item.path} item={item} pathname={pathname} router={router} />)}

          {/* Calix — bouton orb central */}
          <button onClick={() => setShowCalix(true)}
            className="flex flex-col items-center justify-center gap-1 flex-shrink-0 px-3 active:scale-90 transition-all duration-200 -mt-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)', boxShadow: '0 0 20px rgba(255,107,53,0.5), 0 4px 12px rgba(0,0,0,0.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="white" opacity="0.95" />
                <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="0.8" opacity="0.25" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-cali-orange tracking-wide">Calix</span>
          </button>

          {rightItems.map(item => <NavBtn key={item.path} item={item} pathname={pathname} router={router} />)}

        </div>
        <div className="h-safe-area-bottom" />
      </nav>
    </>
  );
}
