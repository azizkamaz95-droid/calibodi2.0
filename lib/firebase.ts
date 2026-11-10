import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, logEvent as fbLogEvent } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyC7590ljHdMhjYdGSUQEZdjSh4bR54tfLI',
  authDomain: 'calibodi-v3.firebaseapp.com',
  projectId: 'calibodi-v3',
  storageBucket: 'calibodi-v3.firebasestorage.app',
  messagingSenderId: '647417621484',
  appId: '1:647417621484:web:de5d361935ccddaffb2ec9',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Use browserLocalPersistence (localStorage) instead of default IndexedDB
// IndexedDB can hang indefinitely on iOS WKWebView
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firebase Analytics — anonymous, no personal data
let analytics: Analytics | null = null;

export async function initAnalytics() {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  }
  return analytics;
}

export function logEvent(eventName: string, params?: Record<string, string | number>) {
  if (analytics) {
    fbLogEvent(analytics, eventName, params);
  }
}

export default app;
