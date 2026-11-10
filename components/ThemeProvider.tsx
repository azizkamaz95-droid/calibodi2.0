'use client';
import { useEffect } from 'react';
import { useThemeStore, applyTheme } from '@/lib/themeStore';

export default function ThemeProvider() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Inline script to avoid FOUC (flash of unstyled theme)
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            var t = JSON.parse(localStorage.getItem('calibodi-theme') || '{}');
            document.documentElement.setAttribute('data-theme', t.state?.theme || 'dark');
          } catch(e) {}
        `,
      }}
    />
  );
}
