'use client';
import { usePathname } from 'next/navigation';

type BgKey = 'dashboard' | 'training' | 'nutrition' | 'sleep' | 'profile';

const ROUTE_BG: [string, BgKey][] = [
  ['/fitness', 'training'],
  ['/session', 'training'],
  ['/nutrition', 'nutrition'],
  ['/sleep', 'sleep'],
  ['/profile', 'profile'],
  ['/premium', 'profile'],
  ['/progress', 'dashboard'],
  ['/hydration', 'dashboard'],
  ['/dashboard', 'dashboard'],
];

function getBackground(pathname: string): BgKey | null {
  for (const [route, bg] of ROUTE_BG) {
    if (pathname === route || pathname.startsWith(route + '/')) return bg;
  }
  return null;
}

export default function LayoutBackground() {
  const pathname = usePathname();
  const bg = getBackground(pathname);
  if (!bg) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <img
        src={`/bg/${bg}.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.9 }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cali-dark/50 via-transparent to-cali-dark/50" />
    </div>
  );
}
