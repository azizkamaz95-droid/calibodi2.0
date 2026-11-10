'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Dumbbell, Utensils, Moon, User } from 'lucide-react';

const NAV_ITEMS = [
  {
    path: '/dashboard',
    icon: Home,
    label: 'Accueil',
    activeBg: 'bg-cali-orange',
    inactiveColor: 'text-cali-orange',
    glow: 'shadow-[0_0_16px_rgba(255,107,53,0.6)]',
  },
  {
    path: '/fitness',
    icon: Dumbbell,
    label: 'Training',
    activeBg: 'bg-cali-red',
    inactiveColor: 'text-cali-red',
    glow: 'shadow-[0_0_16px_rgba(255,45,85,0.6)]',
  },
  {
    path: '/nutrition',
    icon: Utensils,
    label: 'Nutrition',
    activeBg: 'bg-cali-green',
    inactiveColor: 'text-cali-green',
    glow: 'shadow-[0_0_16px_rgba(48,209,88,0.6)]',
  },
  {
    path: '/sleep',
    icon: Moon,
    label: 'Récup',
    activeBg: 'bg-cali-purple',
    inactiveColor: 'text-cali-purple',
    glow: 'shadow-[0_0_16px_rgba(191,90,242,0.6)]',
  },
  {
    path: '/profile',
    icon: User,
    label: 'Profil',
    activeBg: 'bg-cali-blue',
    inactiveColor: 'text-cali-blue',
    glow: 'shadow-[0_0_16px_rgba(10,132,255,0.6)]',
  },
];

const HIDDEN_ON = ['/session', '/onboarding', '/premium', '/'];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || HIDDEN_ON.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/8">
      <div className="max-w-lg mx-auto flex justify-around items-center h-[68px] px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-90"
            >
              <div className={`flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-300 ${
                isActive
                  ? `${item.activeBg} ${item.glow} scale-110`
                  : 'bg-transparent'
              }`}>
                <Icon
                  size={isActive ? 22 : 20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? 'text-white' : `${item.inactiveColor} opacity-50`}
                />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-safe-area-bottom" />
    </nav>
  );
}
