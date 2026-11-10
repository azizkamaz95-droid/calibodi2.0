'use client';
import { useCallback } from 'react';
import { useCalixStore } from './calixStore';
import { useUserStore } from './userStore';
import { useNutritionStore } from './nutritionStore';
import { useSleepStore } from './sleepStore';
import { useHydrationStore } from './hydrationStore';
import type { CalixContext } from '../netlify/functions/calix-coach';

const CALIX_URL = 'https://calibodi-v02.netlify.app/.netlify/functions/calix-coach';

function getTimeOfDay(): CalixContext['timeOfDay'] {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'afternoon';
  if (h >= 18 && h < 22) return 'evening';
  return 'night';
}

export function useCalix() {
  const store = useCalixStore();
  const user = useUserStore((s: any) => s.profile);
  const streak = useUserStore((s: any) => s.streak);
  const sessions = useUserStore((s: any) => s.sessionHistory);
  const nutrition = useNutritionStore((s: any) => s);
  const sleep = useSleepStore((s: any) => s);
  const hydration = useHydrationStore((s: any) => s);

  const buildContext = useCallback((userMessage: string): CalixContext => {
    const todayTotals = nutrition.getTodayTotals?.() || { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    const todayMeals = nutrition.getTodayMeals?.() || [];
    const lastSession = sessions?.[0] || null;
    const sessionsThisWeek = (sessions || []).filter((s: any) => {
      const d = new Date(s.date);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return d >= weekStart;
    }).length;

    return {
      name: user?.name || 'toi',
      gender: user?.gender || 'other',
      age: user?.age || 25,
      goal: user?.goal || 'health',
      weight: user?.weight || 70,
      targetWeight: user?.targetWeight || 65,
      level: user?.level || 'beginner',
      streak: streak || 0,

      nutrition: {
        kcalConsumed: Math.round(todayTotals.kcal),
        kcalGoal: nutrition.dailyGoalKcal || 2000,
        protein: Math.round(todayTotals.protein),
        proteinGoal: nutrition.dailyGoalProtein || 120,
        mealsToday: todayMeals.length,
      },

      fitness: {
        lastSessionDate: lastSession?.date || null,
        sessionsThisWeek,
        sessionsGoal: user?.sessionsPerWeek || 3,
        lastSessionDuration: lastSession?.duration || 0,
      },

      recovery: {
        sleepScore: sleep.getLatestScore?.() || 0,
        sleepHoursLast: (() => {
          const last = sleep.entries?.[sleep.entries.length - 1];
          return last ? Math.round(last.duration / 60 * 10) / 10 : 0;
        })(),
        hydrationPercent: hydration.getProgress?.() || 0,
        hydrationMl: hydration.consumed || 0,
      },

      userMessage,
      history: store.getApiHistory(),
      timeOfDay: getTimeOfDay(),
    };
  }, [user, streak, sessions, nutrition, sleep, hydration, store]);

  const speak = useCallback(async (text: string) => {
    try {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      await TextToSpeech.speak({ text, lang: 'fr-FR', rate: 0.95, pitch: 1.0, volume: 1.0, category: 'ambient' });
    } catch {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = 'fr-FR'; utt.rate = 0.95;
        window.speechSynthesis.speak(utt);
      }
    }
  }, []);

  const ask = useCallback(async (userMessage: string, opts?: { silent?: boolean }): Promise<string> => {
    store.setLoading(true);
    try {
      const ctx = buildContext(userMessage);
      const res = await fetch(CALIX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx),
      });
      const data = await res.json();
      const reply: string = data.reply || '';

      if (userMessage) {
        store.addMessage({ role: 'user', content: userMessage, timestamp: Date.now() });
      }
      store.addMessage({ role: 'assistant', content: reply, timestamp: Date.now() });

      if (!opts?.silent) await speak(reply);
      return reply;
    } catch (e: any) {
      return '';
    } finally {
      store.setLoading(false);
    }
  }, [buildContext, store, speak]);

  // Message d'ouverture journalier (sans input utilisateur)
  const openingMessage = useCallback(async (): Promise<string> => {
    if (!store.needsNewOpenMessage()) {
      const cached = store.lastOpenMessage;
      if (cached) await speak(cached);
      return cached;
    }
    const reply = await ask('', { silent: true });
    if (reply) {
      store.setLastOpen(reply);
      await speak(reply);
    }
    return reply;
  }, [store, ask, speak]);

  return {
    ask,
    openingMessage,
    speak,
    isLoading: store.isLoading,
    history: store.history,
    clearHistory: store.clearHistory,
  };
}
