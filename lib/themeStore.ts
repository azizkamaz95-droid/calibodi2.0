import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'dark' | 'light';

interface ThemeState {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'calibodi-theme' }
  )
);

export function applyTheme(theme: AppTheme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
