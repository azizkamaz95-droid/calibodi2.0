'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const PAGES = ['/dashboard', '/fitness', '/nutrition', '/sleep', '/profile'];
const MIN_SWIPE = 50;

/** Walk up the DOM; return true if any ancestor is a range input or horizontal scroll container. */
function touchedHorizontalScroller(el: EventTarget | null): boolean {
  let node = el as HTMLElement | null;
  while (node && node !== document.body) {
    if (node.tagName === 'INPUT' && (node as HTMLInputElement).type === 'range') {
      return true;
    }
    const ox = window.getComputedStyle(node).overflowX;
    if ((ox === 'auto' || ox === 'scroll') && node.scrollWidth > node.clientWidth) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

export default function SwipeNavigation() {
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let active = false;
    let claimedHorizontal = false;

    const onStart = (e: TouchEvent) => {
      // Don't intercept touches that start on a horizontal scroll container
      if (touchedHorizontalScroller(e.target)) {
        active = false;
        return;
      }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      active = true;
      claimedHorizontal = false;
    };

    const onMove = (e: TouchEvent) => {
      if (!active) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!claimedHorizontal && (Math.abs(dx) > 12 || Math.abs(dy) > 12)) {
        if (Math.abs(dx) > Math.abs(dy)) {
          claimedHorizontal = true;
          // Prevent the WebView from scrolling so we own this gesture
          e.preventDefault();
        } else {
          active = false; // vertical scroll — give up
        }
      } else if (claimedHorizontal) {
        e.preventDefault();
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (!active || !claimedHorizontal) {
        active = false;
        claimedHorizontal = false;
        return;
      }
      active = false;
      claimedHorizontal = false;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < MIN_SWIPE) return;
      if (Math.abs(dy) > Math.abs(dx)) return;

      const pathname = (window.location.pathname || '/').replace(/\/$/, '') || '/';
      const idx = PAGES.findIndex(p => pathname === p || pathname.startsWith(p + '/'));
      if (idx === -1) return;

      if (dx < 0 && idx < PAGES.length - 1) {
        routerRef.current.push(PAGES[idx + 1]);
      } else if (dx > 0 && idx > 0) {
        routerRef.current.push(PAGES[idx - 1]);
      }
    };

    const onCancel = () => { active = false; claimedHorizontal = false; };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd, { passive: true });
    document.addEventListener('touchcancel', onCancel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onCancel);
    };
  }, []); // stable — router accessed via ref

  return null;
}
