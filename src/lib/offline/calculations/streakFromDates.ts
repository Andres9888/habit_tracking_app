/**
 * Date-based Streak Calculation
 *
 * Streak calculation from date sets and arrays.
 * Mirrors client-side logic from src/utils/streak.ts
 */

import { differenceInDays, parseDate } from './dateHelpers';

/**
 * Calculate the best streak from a list of completed dates
 * Mirrors convex/streakUtils/dateHelpers.ts calculateBestStreakFromDates
 *
 * @param completedDates - Array of completed dates (any order)
 * @returns The longest consecutive streak found
 */
export function calculateBestStreakFromDates(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  if (completedDates.length === 1) return 1;

  const sortedAsc = [...completedDates].sort((a, b) => a.localeCompare(b));
  let bestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedAsc.length; i++) {
    const prevDate = parseDate(sortedAsc[i - 1]);
    const currDate = parseDate(sortedAsc[i]);
    const diff = differenceInDays(currDate, prevDate);

    if (diff === 1) {
      currentRun++;
      bestStreak = Math.max(bestStreak, currentRun);
    } else if (diff > 1) {
      currentRun = 1;
    }
  }

  return bestStreak;
}

/**
 * Calculate current streak from a set of completed dates
 * Mirrors src/utils/streak.ts computeCurrentStreakFromDates
 *
 * @param completedDates - Set of completed date strings (YYYY-MM-DD)
 * @param todayDate - Today's date in YYYY-MM-DD format
 * @param maxLookbackDays - Maximum days to look back (safety limit)
 * @returns Current streak count
 */
export function computeCurrentStreakFromDates(
  completedDates: Set<string>,
  todayDate: string,
  maxLookbackDays: number = 400
): number {
  if (!completedDates || completedDates.size === 0) {
    return 0;
  }

  const latestCompleted = [...completedDates]
    .filter((date) => date <= todayDate)
    .sort()
    .pop();

  if (!latestCompleted) {
    return 0;
  }

  // Check that the streak is still active: last completion must be today or
  // yesterday (1-day grace period). Matches server-side calculateStreakFromHistory.
  const latestDate = parseDate(latestCompleted);
  const todayDateObj = parseDate(todayDate);
  const daysSinceLastCompletion = differenceInDays(todayDateObj, latestDate);

  if (daysSinceLastCompletion > 1) {
    return 0;
  }

  let streak = 0;
  const currentDate = parseDate(latestCompleted);

  for (let i = 0; i < maxLookbackDays; i++) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    if (completedDates.has(dateString)) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    break;
  }

  return streak;
}
