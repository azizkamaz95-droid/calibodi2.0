import type { Metadata, Viewport } from 'next';
import './globals.css';
import BackButtonHandler from '@/components/BackButtonHandler';
import IOSPremiumUnlock from '@/components/IOSPremiumUnlock';
import Paywall from '@/components/Paywall';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import BottomNav from '@/components/BottomNav';
import LayoutBackground from '@/components/LayoutBackground';
import SwipeNavigation from '@/components/SwipeNavigation';
import AudioUnlock from '@/components/AudioUnlock';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'CaliBodi — Ton coaching fitness intelligent',
  description: 'Entraînement, nutrition, hydratation et sommeil — tout connecté, adapté à ton corps.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0A0A0F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark">
      <body className="min-h-dvh" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
        <ThemeProvider />
        <AudioUnlock />
        <BackButtonHandler />
        <IOSPremiumUnlock />
        <Paywall />
        <AnalyticsProvider />
        <SwipeNavigation />
        <LayoutBackground />
        <main className="max-w-lg mx-auto relative z-10 pb-16">
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
