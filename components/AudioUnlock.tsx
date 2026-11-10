'use client';
import { useEffect } from 'react';

// Unlocks audio autoplay on the first user touch (required by some Android WebViews)
export default function AudioUnlock() {
  useEffect(() => {
    const unlock = () => {
      const a = new Audio();
      a.play().catch(() => {});
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('touchstart', unlock, { passive: true });
    return () => document.removeEventListener('touchstart', unlock);
  }, []);
  return null;
}
