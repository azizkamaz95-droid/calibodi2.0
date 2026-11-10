/**
 * CaliBodi Analytics — 100% anonyme
 * 
 * Aucune donnée personnelle n'est collectée.
 * On track uniquement des événements agrégés :
 * - Combien de séances sont faites (pas par qui)
 * - Quel mode est le plus utilisé
 * - Quelles pages sont visitées
 * - Taux de complétion onboarding
 * - Quel plan premium est choisi
 * 
 * Firebase Analytics ne collecte PAS : nom, email, photos,
 * poids, mensurations, ni aucune donnée de santé.
 */

import { initAnalytics, logEvent } from './firebase';

// Initialize analytics on app start
export async function setupAnalytics() {
  await initAnalytics();
}

// ═══ ONBOARDING ═══
export function trackOnboardingStart() {
  logEvent('onboarding_start');
}

export function trackOnboardingComplete(params: {
  goal: string;
  level: string;
  sessionsPerWeek: number;
}) {
  logEvent('onboarding_complete', {
    goal: params.goal,
    level: params.level,
    sessions_per_week: params.sessionsPerWeek,
  });
}

// ═══ SESSIONS ═══
export function trackSessionStart(mode: string) {
  logEvent('session_start', { mode });
}

export function trackSessionComplete(params: {
  mode: string;
  duration: number;
  exerciseCount: number;
  feedback: string;
}) {
  logEvent('session_complete', {
    mode: params.mode,
    duration_seconds: params.duration,
    exercise_count: params.exerciseCount,
    feedback: params.feedback,
  });
}

// ═══ NUTRITION ═══
export function trackBarcodeScanned() {
  logEvent('barcode_scanned');
}

export function trackRecipeViewed(category: string) {
  logEvent('recipe_viewed', { category });
}

// ═══ NAVIGATION ═══
export function trackPageView(page: string) {
  logEvent('page_view', { page });
}

// ═══ PREMIUM ═══
export function trackPremiumView() {
  logEvent('premium_page_viewed');
}

export function trackPremiumSelect(plan: string) {
  logEvent('premium_plan_selected', { plan });
}

// ═══ ENGAGEMENT ═══
export function trackBadgeUnlocked(badgeName: string) {
  logEvent('badge_unlocked', { badge: badgeName });
}

export function trackModeSelected(mode: string) {
  logEvent('mode_selected', { mode });
}

export function trackStreakDay(days: number) {
  logEvent('streak_milestone', { days });
}

export function trackAppOpened() {
  logEvent('app_opened');
}

export function trackReturnAfterAbsence(daysAbsent: number) {
  logEvent('return_after_absence', { days_absent: daysAbsent });
}
