/**
 * Onboarding Analytics
 *
 * Tracks the critical first 5 minutes of user experience:
 * - Funnel events (first_open → onboarding_complete)
 * - Time-to-first-habit and time-to-first-completion
 * - Suggested habit taps
 *
 * Created by Opus.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { logInteraction } from './interactions';

// ─── Storage Keys ────────────────────────────────────────────────────

const KEYS = {
  FIRST_OPEN_AT: '@onboarding_first_open_at',
  FIRST_HABIT_AT: '@onboarding_first_habit_at',
  FIRST_COMPLETION_AT: '@onboarding_first_completion_at',
  HAS_SEEN_TOOLTIPS: '@onboarding_has_seen_tooltips',
  HAS_SEEN_SUGGESTED: '@onboarding_has_seen_suggested',
  ONBOARDING_STARTED: '@onboarding_started',
} as const;

export { KEYS as ONBOARDING_STORAGE_KEYS };

// ─── Event Names ─────────────────────────────────────────────────────

export const OnboardingEvent = {
  APP_FIRST_OPEN: 'app_first_open',
  ONBOARDING_START: 'onboarding_start',
  FIRST_HABIT_CREATED: 'first_habit_created',
  FIRST_HABIT_COMPLETED: 'first_habit_completed',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  SUGGESTED_HABIT_TAPPED: 'suggested_habit_tapped',
  TOOLTIP_SHOWN: 'tooltip_shown',
  TOOLTIP_DISMISSED: 'tooltip_dismissed',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────

async function getTimestamp(key: string): Promise<number | null> {
  const val = await AsyncStorage.getItem(key);
  return val ? Number(val) : null;
}

async function setTimestampIfNew(key: string): Promise<{ isNew: boolean; timestamp: number }> {
  const existing = await AsyncStorage.getItem(key);
  if (existing) return { isNew: false, timestamp: Number(existing) };
  const now = Date.now();
  await AsyncStorage.setItem(key, String(now));
  return { isNew: true, timestamp: now };
}

// ─── Track Functions ─────────────────────────────────────────────────

export async function trackAppFirstOpen(): Promise<void> {
  const { isNew } = await setTimestampIfNew(KEYS.FIRST_OPEN_AT);
  if (isNew) {
    logInteraction(OnboardingEvent.APP_FIRST_OPEN);
  }
}

export async function trackOnboardingStart(): Promise<void> {
  const existing = await AsyncStorage.getItem(KEYS.ONBOARDING_STARTED);
  if (!existing) {
    await AsyncStorage.setItem(KEYS.ONBOARDING_STARTED, 'true');
    logInteraction(OnboardingEvent.ONBOARDING_START);
  }
}

export async function trackFirstHabitCreated(habitName: string): Promise<void> {
  const { isNew, timestamp } = await setTimestampIfNew(KEYS.FIRST_HABIT_AT);
  if (isNew) {
    const firstOpenAt = await getTimestamp(KEYS.FIRST_OPEN_AT);
    const timeToFirstHabitMs = firstOpenAt ? timestamp - firstOpenAt : null;
    logInteraction(OnboardingEvent.FIRST_HABIT_CREATED, {
      habitName,
      timeToFirstHabitMs,
      timeToFirstHabitSec: timeToFirstHabitMs ? Math.round(timeToFirstHabitMs / 1000) : null,
    });
  }
}

export async function trackFirstHabitCompleted(habitId: string): Promise<void> {
  const { isNew, timestamp } = await setTimestampIfNew(KEYS.FIRST_COMPLETION_AT);
  if (isNew) {
    const firstOpenAt = await getTimestamp(KEYS.FIRST_OPEN_AT);
    const timeToFirstCompletionMs = firstOpenAt ? timestamp - firstOpenAt : null;
    logInteraction(OnboardingEvent.FIRST_HABIT_COMPLETED, {
      habitId,
      timeToFirstCompletionMs,
      timeToFirstCompletionSec: timeToFirstCompletionMs
        ? Math.round(timeToFirstCompletionMs / 1000)
        : null,
    });
  }
}

export async function trackOnboardingComplete(): Promise<void> {
  const firstOpenAt = await getTimestamp(KEYS.FIRST_OPEN_AT);
  const now = Date.now();
  const totalOnboardingMs = firstOpenAt ? now - firstOpenAt : null;
  logInteraction(OnboardingEvent.ONBOARDING_COMPLETE, {
    totalOnboardingMs,
    totalOnboardingSec: totalOnboardingMs ? Math.round(totalOnboardingMs / 1000) : null,
  });
}

export function trackSuggestedHabitTapped(habitName: string, position: number): void {
  logInteraction(OnboardingEvent.SUGGESTED_HABIT_TAPPED, { habitName, position });
}

export function trackTooltipShown(tooltipId: string): void {
  logInteraction(OnboardingEvent.TOOLTIP_SHOWN, { tooltipId });
}

export function trackTooltipDismissed(tooltipId: string): void {
  logInteraction(OnboardingEvent.TOOLTIP_DISMISSED, { tooltipId });
}

// ─── First-Use State ─────────────────────────────────────────────────

export async function hasSeenTooltips(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.HAS_SEEN_TOOLTIPS);
  return val === 'true';
}

export async function markTooltipsSeen(): Promise<void> {
  await AsyncStorage.setItem(KEYS.HAS_SEEN_TOOLTIPS, 'true');
}

export async function hasSeenSuggestedHabits(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.HAS_SEEN_SUGGESTED);
  return val === 'true';
}

export async function markSuggestedHabitsSeen(): Promise<void> {
  await AsyncStorage.setItem(KEYS.HAS_SEEN_SUGGESTED, 'true');
}

export async function isFirstTimeUser(): Promise<boolean> {
  const firstHabit = await AsyncStorage.getItem(KEYS.FIRST_HABIT_AT);
  return !firstHabit;
}
