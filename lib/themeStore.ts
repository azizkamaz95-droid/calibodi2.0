import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppTheme = 'dark' | 'light';

interface ThemeState {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        applyTheme(next);
      },
    }),
    {
      name: 'calibodi-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    }
  )
);

export function applyTheme(theme: AppTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}
