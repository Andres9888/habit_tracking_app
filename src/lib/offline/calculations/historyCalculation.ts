/**
 * History-based Streak Calculation
 *
 * Mirrors convex/streakUtils/historyCalculation.ts for consistent
 * streak values whether online or offline.
 */

import { calculateBestStreakFromDates } from './streakFromDates';
import { differenceInDays, parseDate } from './dateHelpers';
import type { StreakData, TrackingRecord } from './types';

/**
 * Calculate streak from tracking history
 * Mirrors convex/streakUtils/historyCalculation.ts calculateStreakFromHistory
 *
 * @param tracking - Array of tracking records with date and completed status
 * @param todayDate - Today's date in YYYY-MM-DD format
 * @returns Calculated streak data
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
    return { bestStreak: 0, currentStreak: 0, lastCompletedDate: '' };
  }

  const lastCompletedDate = completedDates[0];
  const today = parseDate(todayDate);
  const lastCompleted = parseDate(lastCompletedDate);
  const daysSinceLastCompletion = differenceInDays(today, lastCompleted);

  // If last completion was more than 1 day ago, streak is broken
  if (daysSinceLastCompletion > 1) {
    const bestStreak = calculateBestStreakFromDates(completedDates);
    return { bestStreak, currentStreak: 0, lastCompletedDate };
  }

  // Count consecutive days backwards from the last completed date
  let currentStreak = 1;
  let checkDate = lastCompletedDate;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = completedDates[i];
    const checkDateObj = parseDate(checkDate);
    const prevDateObj = parseDate(prevDate);
    const diff = differenceInDays(checkDateObj, prevDateObj);

    if (diff === 1) {
      currentStreak++;
      checkDate = prevDate;
    } else if (diff === 0) {
      continue; // Duplicate date, skip
    } else {
      break; // Gap found, streak ends
    }
  }

  const bestStreak = calculateBestStreakFromDates(completedDates);

  return {
    bestStreak: Math.max(bestStreak, currentStreak),
    currentStreak,
    lastCompletedDate,
  };
}
