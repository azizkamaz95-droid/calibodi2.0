'use client';

import { useEffect } from 'react';
import { setupAnalytics, trackAppOpened } from '@/lib/analytics';

export default function AnalyticsProvider() {
  useEffect(() => {
    setupAnalytics().then(() => {
      trackAppOpened();
    });
  }, []);

  return null;
}
