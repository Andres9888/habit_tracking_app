/**
 * Rest Days Utilities
 *
 * Helpers for validating and gating the rest-day feature.
 * Free users may configure up to {@link FREE_TIER_MAX_REST_DAYS} rest days
 * per habit; premium users have no limit.
 *
 * @module restDays
 * @category Streak Calculation
 */

import { FREE_TIER_MAX_REST_DAYS } from '@/constants';

/** Day-of-week labels indexed 0 (Sun) … 6 (Sat). */
export const DAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/** Short day-of-week labels indexed 0 (Sun) … 6 (Sat). */
export const DAY_LABELS_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;

/**
 * Return the maximum number of rest days allowed for the user's tier.
 *
 * @param isPremium - Whether the user has an active premium subscription
 * @returns Maximum rest days (1 for free, 7 for premium — i.e. unlimited)
 */
export function getMaxRestDays(isPremium: boolean): number {
  return isPremium ? 7 : FREE_TIER_MAX_REST_DAYS;
}

/**
 * Validate a rest-days selection against the user's tier.
 *
 * @param restDays - Proposed rest-day numbers (0–6)
 * @param isPremium - Whether the user has premium
 * @returns Object with `valid` flag and an optional `reason` string
 */
export function validateRestDays(
  restDays: number[],
  isPremium: boolean
): { valid: boolean; reason?: string } {
  const max = getMaxRestDays(isPremium);
  if (restDays.length > max) {
    return {
      valid: false,
      reason: isPremium
        ? 'You can select up to 7 rest days.'
        : `Free users can set ${FREE_TIER_MAX_REST_DAYS} rest day. Upgrade to premium for unlimited rest days.`,
    };
  }
  // Ensure all values are 0–6
  if (restDays.some((d) => d < 0 || d > 6 || !Number.isInteger(d))) {
    return { valid: false, reason: 'Rest days must be 0 (Sun) through 6 (Sat).' };
  }
  return { valid: true };
}
