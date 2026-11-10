'use client';
import { useEffect } from 'react';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { initRevenueCat, checkSubscriptionStatus } from '@/services/revenueCatService';

// Init RevenueCat on iOS and Android, restore subscription status on app start
export default function IOSPremiumUnlock() {
  const setPremium = useFreemiumStore((s) => s.setPremium);
  const cancelPremium = useFreemiumStore((s) => s.cancelPremium);

  useEffect(() => {
    const check = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const platform = Capacitor.getPlatform();
        if (platform !== 'ios' && platform !== 'android') return;
        await initRevenueCat();
        const active = await checkSubscriptionStatus();
        if (active) {
          setPremium('annual_once');
        } else {
          cancelPremium();
        }
      } catch {}
    };
    check();
  }, [setPremium, cancelPremium]);

  return null;
}
