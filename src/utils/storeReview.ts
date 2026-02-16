/**
 * Store Review Utility
 *
 * Manages App Store rating prompt timing with a sentiment pre-filter.
 * Instead of triggering the native dialog directly, eligible moments
 * surface a "Enjoying Chain Day?" prompt. Happy users get the native
 * review dialog; unhappy users get the feedback form.
 *
 * Guards:
 * - At least 5 total completions (never on first session)
 * - At least 90 days since last prompt
 * - Platform must support StoreReview
 * - Only at positive moments (milestones, strong analytics)
 * - Never after a broken streak
 */

import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  MIN_COMPLETIONS_FOR_RATING,
  RATING_COOLDOWN_DAYS,
} from '@/constants';

const STORE_REVIEW_LAST_PROMPT_KEY = '@store_review_last_prompt';
const STORE_REVIEW_COMPLETION_COUNT_KEY = '@store_review_completion_count';

/** Minimum days between rating prompts */
const COOLDOWN_DAYS = RATING_COOLDOWN_DAYS;

/** Minimum total completions before prompting */
const MIN_COMPLETIONS = MIN_COMPLETIONS_FOR_RATING;

/** Streak milestones that should trigger a review prompt */
const REVIEW_ELIGIBLE_MILESTONES = new Set([7, 14, 30]);

/**
 * Increment the completion counter. Call on every habit completion.
 */
export async function incrementCompletionCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_COMPLETION_COUNT_KEY);
    const count = (raw ? Number.parseInt(raw, 10) : 0) + 1;
    await AsyncStorage.setItem(
      STORE_REVIEW_COMPLETION_COUNT_KEY,
      String(count),
    );
    return count;
  } catch {
    return 0;
  }
}

/**
 * Get the current completion count.
 */
async function getCompletionCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_COMPLETION_COUNT_KEY);
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Check if enough time has passed since the last prompt.
 */
async function isCooldownExpired(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_LAST_PROMPT_KEY);
    if (!raw) return true;

    const lastPrompt = Number.parseInt(raw, 10);
    const daysSince = (Date.now() - lastPrompt) / (1000 * 60 * 60 * 24);
    return daysSince >= COOLDOWN_DAYS;
  } catch {
    return true;
  }
}

/**
 * Record that a prompt was shown. Exported for use by the
 * sentiment pre-filter hook (useReviewPrompt).
 */
export async function recordPromptShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORE_REVIEW_LAST_PROMPT_KEY,
      String(Date.now()),
    );
  } catch {
    // Silent fail — non-critical
  }
}

/**
 * Check all platform and usage guards for review eligibility.
 * Does NOT show anything — just returns whether a prompt is appropriate.
 * Used by useReviewPrompt to gate the sentiment pre-filter.
 */
export async function canRequestReview(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') return false;

    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) return false;

    const completions = await getCompletionCount();
    if (completions < MIN_COMPLETIONS) return false;

    const cooldownOk = await isCooldownExpired();
    if (!cooldownOk) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a streak milestone is eligible for a review prompt.
 * Returns true only for specific positive milestones (7, 14, 30 days).
 */
export function isMilestoneReviewEligible(milestoneDays: number): boolean {
  return REVIEW_ELIGIBLE_MILESTONES.has(milestoneDays);
}

/**
 * Check if analytics metrics qualify for a review prompt.
 * Requires 70%+ completion rate and at least 3 active habits.
 */
export function isAnalyticsReviewEligible(
  avgCompletionRate: number,
  totalHabits: number,
): boolean {
  return avgCompletionRate >= 70 && totalHabits >= 3;
}

// ---------------------------------------------------------------------------
// Legacy direct-call functions (kept for backward compatibility but now
// gated through the sentiment pre-filter in most code paths)
// ---------------------------------------------------------------------------

/**
 * Attempt to show the store review prompt after a milestone celebration.
 *
 * @deprecated Prefer useReviewPrompt hook with sentiment pre-filter.
 */
export async function maybeRequestReview(
  milestoneDays: number,
): Promise<void> {
  try {
    if (!REVIEW_ELIGIBLE_MILESTONES.has(milestoneDays)) return;

    const eligible = await canRequestReview();
    if (!eligible) return;

    await recordPromptShown();
    await StoreReview.requestReview();
  } catch {
    // Silent fail
  }
}

/**
 * Attempt to show the store review prompt after viewing positive analytics.
 *
 * @deprecated Prefer useReviewPrompt hook with sentiment pre-filter.
 */
export async function maybeRequestReviewFromAnalytics(
  avgCompletionRate: number,
  totalHabits: number,
): Promise<void> {
  try {
    if (avgCompletionRate < 70 || totalHabits < 3) return;

    const eligible = await canRequestReview();
    if (!eligible) return;

    await recordPromptShown();
    await StoreReview.requestReview();
  } catch {
    // Silent fail
  }
}
