import { doc, getDoc, setDoc, updateDoc, runTransaction, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const ADMIN_EMAIL = 'azizkamaz95@gmail.com';

// ─── TRIAL ────────────────────────────────────────────────────────────────────

export async function initUserTrial(userId: string): Promise<void> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists() || !snap.data()?.trialStartedAt) {
    await setDoc(ref, { trialStartedAt: new Date().toISOString() }, { merge: true });
  }
}

export async function getUserTrialStartDate(userId: string): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.data()?.trialStartedAt ?? null;
  } catch {
    return null;
  }
}

// ─── PREMIUM VIA CODE PROMO ───────────────────────────────────────────────────

export async function getUserPremiumUntil(userId: string): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.data()?.premiumUntil ?? null;
  } catch {
    return null;
  }
}

export async function redeemPromoCode(userId: string, code: string): Promise<{ success: boolean; durationDays?: number; error?: string }> {
  const codeKey = code.trim().toUpperCase();
  try {
    let durationDays = 0;
    await runTransaction(db, async (transaction) => {
      const codeRef = doc(db, 'promoCodes', codeKey);
      const codeDoc = await transaction.get(codeRef);
      if (!codeDoc.exists()) throw new Error('Code invalide ou inexistant.');
      if (codeDoc.data().used) throw new Error('Ce code a déjà été utilisé.');
      durationDays = codeDoc.data().durationDays;
      const premiumUntil = new Date(Date.now() + durationDays * 86400000).toISOString();
      transaction.update(codeRef, { used: true, usedBy: userId, usedAt: new Date().toISOString() });
      transaction.set(doc(db, 'users', userId), { premiumUntil }, { merge: true });
    });
    return { success: true, durationDays };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur inconnue.' };
  }
}

// ─── ADMIN — GÉNÉRATION DE CODES ──────────────────────────────────────────────

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CAL-';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function createPromoCode(adminEmail: string, durationDays: number): Promise<{ success: boolean; code?: string; error?: string }> {
  if (adminEmail.toLowerCase() !== ADMIN_EMAIL) return { success: false, error: 'Non autorisé.' };
  const code = generateCode();
  try {
    await setDoc(doc(db, 'promoCodes', code), {
      durationDays,
      used: false,
      usedBy: null,
      createdAt: new Date().toISOString(),
    });
    return { success: true, code };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur.' };
  }
}

export { ADMIN_EMAIL };
