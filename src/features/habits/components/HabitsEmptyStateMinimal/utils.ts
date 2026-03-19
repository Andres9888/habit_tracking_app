/**
 * HabitsEmptyStateMinimal - Utility Functions
 *
 * Time-based chip selection logic for contextually relevant suggestions.
 */

import type { SuggestionChip } from './types';
import {
  MORNING_CHIPS,
  AFTERNOON_CHIPS,
  EVENING_CHIPS,
  NIGHT_CHIPS,
  STATIC_CHIPS,
} from './constants';
import { PLACEHOLDER_EXAMPLES } from './placeholderConstants';

/**
 * Time windows for chip suggestions (24-hour format)
 */
export const TIME_WINDOWS = {
  // 5am - 11am
  AFTERNOON: { end: 17, start: 11 },
  // 11am - 5pm
  EVENING: { end: 22, start: 17 },
  MORNING: { end: 11, start: 5 }, // 5pm - 10pm
  NIGHT: { end: 5, start: 22 }, // 10pm - 5am (wraps midnight)
} as const;

/**
 * Get contextually relevant chip suggestions based on current time
 *
 * @param date - Date object to check (defaults to now)
 * @param useTimeBased - Feature flag to enable/disable time-based logic
 * @returns Array of 6 suggestion chips appropriate for the time
 *
 * @example
 * // At 8:30am
 * getTimeBasedChips() // Returns MORNING_CHIPS
 *
 * // At 3:15pm
 * getTimeBasedChips() // Returns AFTERNOON_CHIPS
 *
 * // With feature flag disabled
 * getTimeBasedChips(new Date(), false) // Returns STATIC_CHIPS
 */
export function getTimeBasedChips(
  date: Date = new Date(),
  useTimeBased: boolean = true
): SuggestionChip[] {
  // Feature flag: return static chips if disabled
  if (!useTimeBased) {
    return STATIC_CHIPS;
  }

  const hour = date.getHours(); // 0-23

  // Morning: 5am - 11am
  if (hour >= TIME_WINDOWS.MORNING.start && hour < TIME_WINDOWS.MORNING.end) {
    return MORNING_CHIPS;
  }

  // Afternoon: 11am - 5pm
  if (
    hour >= TIME_WINDOWS.AFTERNOON.start &&
    hour < TIME_WINDOWS.AFTERNOON.end
  ) {
    return AFTERNOON_CHIPS;
  }

  // Evening: 5pm - 10pm
  if (hour >= TIME_WINDOWS.EVENING.start && hour < TIME_WINDOWS.EVENING.end) {
    return EVENING_CHIPS;
  }

  // Night: 10pm - 5am (wraps around midnight)
  return NIGHT_CHIPS;
}

/**
 * Get hint examples matching the current time window
 */
export function getTimeBasedPlaceholders(
  date: Date = new Date()
): readonly string[] {
  const hour = date.getHours();

  if (hour >= TIME_WINDOWS.MORNING.start && hour < TIME_WINDOWS.MORNING.end) {
    return PLACEHOLDER_EXAMPLES.MORNING;
  }

  if (
    hour >= TIME_WINDOWS.AFTERNOON.start &&
    hour < TIME_WINDOWS.AFTERNOON.end
  ) {
    return PLACEHOLDER_EXAMPLES.AFTERNOON;
  }

  if (hour >= TIME_WINDOWS.EVENING.start && hour < TIME_WINDOWS.EVENING.end) {
    return PLACEHOLDER_EXAMPLES.EVENING;
  }

  return PLACEHOLDER_EXAMPLES.NIGHT;
}
