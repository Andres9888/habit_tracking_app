/**
 * Store Review Utility
 *
 * Manages App Store rating prompt timing.
 * Triggers the native rating dialog after milestone celebrations,
 * with guards for cooldown (90 days) and minimum usage (5 completions).
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
 * Record that a prompt was shown.
 */
async function recordPromptShown(): Promise<void> {
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
 * Attempt to show the store review prompt after a milestone celebration.
 *
 * Guards:
 * - Only on eligible milestones (7, 14, 30 days)
 * - At least 5 total completions
 * - At least 90 days since last prompt
 * - Store review must be available on the platform
 *
 * @param milestoneDays - The streak milestone that was just celebrated
 */
export async function maybeRequestReview(
  milestoneDays: number,
): Promise<void> {
  try {
    // Only prompt on specific milestones
    if (!REVIEW_ELIGIBLE_MILESTONES.has(milestoneDays)) {
      return;
    }

    // Check platform support
    if (Platform.OS === 'web') return;
    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) return;

    // Check minimum completions
    const completions = await getCompletionCount();
    if (completions < MIN_COMPLETIONS) return;

    // Check cooldown
    const cooldownOk = await isCooldownExpired();
    if (!cooldownOk) return;

    // All checks passed — request review
    await recordPromptShown();
    await StoreReview.requestReview();
  } catch {
    // Silent fail — never break the app for a rating prompt
  }
}
