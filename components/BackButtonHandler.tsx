'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const BACK_MAP: Record<string, string> = {
  '/fitness': '/dashboard',
  '/session': '/fitness',
  '/nutrition': '/dashboard',
  '/hydration': '/nutrition',
  '/sleep': '/dashboard',
  '/progress': '/profile',
  '/profile': '/dashboard',
  '/premium': '/profile',
};

export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Try Capacitor App plugin for Android back button
    let cleanup: (() => void) | null = null;

    const setupCapacitorBack = async () => {
      try {
        const { App } = await import('@capacitor/app');
        const handler = await App.addListener('backButton', ({ canGoBack }) => {
          const current = pathname || '/dashboard';
          if (current === '/dashboard' || current === '/' || current === '/onboarding') {
            // On main screens, minimize app instead of closing
            App.minimizeApp();
          } else if (current === '/session') {
            // During session, don't go back without confirmation
            // (session page handles its own back button)
          } else {
            const target = BACK_MAP[current] || '/dashboard';
            router.push(target);
          }
        });
        cleanup = () => handler.remove();
      } catch {
        // Capacitor not available (web) — use popstate fallback
        const handlePopState = () => {
          const current = pathname || '/dashboard';
          if (current !== '/dashboard' && current !== '/' && current !== '/onboarding') {
            const target = BACK_MAP[current] || '/dashboard';
            router.push(target);
          }
          // Always re-push to prevent app close
          window.history.pushState(null, '', window.location.href);
        };
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);
        cleanup = () => window.removeEventListener('popstate', handlePopState);
      }
    };

    setupCapacitorBack();
    return () => { if (cleanup) cleanup(); };
  }, [pathname, router]);

  return null;
}
