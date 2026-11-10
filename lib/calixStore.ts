import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CalixMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface CalixState {
  history: CalixMessage[];
  lastOpenMessage: string;      // dernière phrase d'ouverture générée
  lastOpenDate: string | null;  // date ISO du dernier message d'ouverture
  isLoading: boolean;

  addMessage: (msg: CalixMessage) => void;
  setLastOpen: (msg: string) => void;
  setLoading: (v: boolean) => void;
  clearHistory: () => void;
  needsNewOpenMessage: () => boolean;
  getApiHistory: () => { role: 'user' | 'assistant'; content: string }[];
}

export const useCalixStore = create<CalixState>()(
  persist(
    (set, get) => ({
      history: [],
      lastOpenMessage: '',
      lastOpenDate: null,
      isLoading: false,

      addMessage: (msg) => set((s) => ({
        history: [...s.history.slice(-20), msg],
      })),

      setLastOpen: (msg) => set({
        lastOpenMessage: msg,
        lastOpenDate: new Date().toISOString().slice(0, 10),
      }),

      setLoading: (v) => set({ isLoading: v }),

      clearHistory: () => set({ history: [], lastOpenMessage: '', lastOpenDate: null }),

      needsNewOpenMessage: () => {
        const today = new Date().toISOString().slice(0, 10);
        return get().lastOpenDate !== today;
      },

      getApiHistory: () => get().history
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content })),
    }),
    {
      name: 'calix-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
