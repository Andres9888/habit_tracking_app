/**
 * Calculate streak from full tracking history
 */

import { calculateBestStreakFromDates, differenceInDays } from './dateHelpers';
import type { StreakData, TrackingRecord } from './types';

/**
 * Calculate streak from full tracking history
 * This is more accurate than incremental updates, especially for backfills
 *
 * All date comparisons use YYYY-MM-DD strings directly or UTC-explicit
 * parsing to avoid timezone bugs on UTC-based servers (e.g. Convex).
 *
 * @param tracking - Array of tracking records with date and completed status
 * @param todayDate - Today's date in YYYY-MM-DD format (from the user's local timezone)
 * @returns Streak data calculated from history
 */
export function calculateStreakFromHistory(
  tracking: TrackingRecord[],
  todayDate: string
): StreakData {
  // Filter to only completed dates and sort descending (most recent first)
  const completedDates = tracking
    .filter((t) => t.completed)
    .map((t) => t.date)
    .sort((a, b) => b.localeCompare(a));

  if (completedDates.length === 0) {
    return {
      bestStreak: 0,
      currentStreak: 0,
      lastCompletedDate: '',
    };
  }

  const lastCompletedDate = completedDates[0];

  // Compare dates as strings via differenceInDays (UTC-safe)
  const daysSinceLastCompletion = differenceInDays(todayDate, lastCompletedDate);

  // If last completion was more than 1 day ago, streak is broken
  if (daysSinceLastCompletion > 1) {
    const bestStreak = calculateBestStreakFromDates(completedDates);
    return {
      bestStreak,
      currentStreak: 0,
      lastCompletedDate,
    };
  }

  // Count consecutive days backwards from the last completed date
  let currentStreak = 1;
  let checkDate = lastCompletedDate;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = completedDates[i];
    const diff = differenceInDays(checkDate, prevDate);

    if (diff === 1) {
      currentStreak++;
      checkDate = prevDate;
    } else if (diff === 0) {
      continue;
    } else {
      break;
    }
  }

  const bestStreak = calculateBestStreakFromDates(completedDates);

  return {
    bestStreak: Math.max(bestStreak, currentStreak),
    currentStreak,
    lastCompletedDate,
  };
}
