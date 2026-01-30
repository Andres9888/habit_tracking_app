/**
 * Statistical Calculation Functions
 *
 * Provides functions for calculating extremes, deltas, and completion rates.
 */

import type { StrengthSnapshot } from '../types';
import { formatDateString } from './formatting';

/**
 * Calculate peak and lowest strength values from a timeline.
 *
 * The lowest value excludes day 1 (which is always 0 or near-0)
 * to provide a more meaningful "lowest point" metric.
 *
 * @param strengthHistory - Array of strength snapshots
 * @returns Object with peak and lowest snapshots
 */
export function calculateStrengthExtremes(
  strengthHistory: StrengthSnapshot[]
): { peak: StrengthSnapshot; lowest: StrengthSnapshot } {
  if (strengthHistory.length === 0) {
    const now = new Date();
    const emptySnapshot: StrengthSnapshot = {
      date: now,
      dateString: formatDateString(now),
      label: 'weak',
      strength: 0,
    };
    return { lowest: emptySnapshot, peak: emptySnapshot };
  }

  let peak = strengthHistory[0];
  for (const snapshot of strengthHistory) {
    if (snapshot.strength > peak.strength) {
      peak = snapshot;
    }
  }

  let lowest =
    strengthHistory.length > 1 ? strengthHistory[1] : strengthHistory[0];
  for (let i = 1; i < strengthHistory.length; i++) {
    if (strengthHistory[i].strength < lowest.strength) {
      lowest = strengthHistory[i];
    }
  }

  return { lowest, peak };
}

/**
 * Calculate the delta (change) between two strength values.
 * Returns positive for improvement, negative for decline.
 *
 * @param current - Current strength
 * @param previous - Previous strength
 * @returns Rounded delta value
 */
export function calculateDelta(current: number, previous: number): number {
  return Math.round((current - previous) * 10) / 10;
}

/**
 * Calculate the completion rate as a percentage.
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitAgeDays - Number of days since habit creation
 * @returns Completion rate as percentage (0-100)
 */
export function calculateCompletionRate(
  completedDates: Set<string>,
  habitAgeDays: number
): number {
  if (habitAgeDays <= 0) {
    return 0;
  }
  return Math.round((completedDates.size / habitAgeDays) * 100);
}

/**
 * Check if the user has a perfect completion streak (100% completion rate).
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitAgeDays - Number of days since habit creation
 * @returns True if the user has completed every day since habit creation
 */
export function isPerfectStreak(
  completedDates: Set<string>,
  habitAgeDays: number
): boolean {
  if (habitAgeDays < 3) {
    return false;
  }
  return completedDates.size >= habitAgeDays;
}
