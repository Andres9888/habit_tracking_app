/**
 * Streak Calculation Utilities
 *
 * Computes current streak for habit tracking.
 * Uses a 1-day grace period (matching server-side calculation) so that
 * a streak ending yesterday displays as active, but a streak ending
 * earlier displays as 0.
 *
 * Supports rest days - days of the week where not completing a habit
 * doesn't break the streak.
 *
 * @module streak
 * @category Streak Calculation
 */

import { format, parseISO } from 'date-fns';
import { STREAK_MAX_LOOKBACK_DAYS } from '@/constants';

/**
 * Get the day of week (0=Sunday, 6=Saturday) from a Date object
 */
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Check if a date falls on a rest day
 */
function isRestDay(date: Date, restDays: number[]): boolean {
  return restDays.includes(getDayOfWeek(date));
}

/**
 * Compute the current streak from a set of completed dates.
 *
 * The streak starts at the most recent completed day and counts backward
 * through consecutive completed days. A single isolated completion counts as 1.
 *
 * Rest days (specified by day-of-week numbers) are skipped - they don't
 * count toward the streak but also don't break it.
 *
 * The streak is only "current" if the most recent completion is today or
 * yesterday (1-day grace period, matching the server-side calculation),
 * with rest days between today and the last completion also skipped.
 *
 * @param completedDates - Set of date strings in YYYY-MM-DD format
 * @param today - Reference date to calculate streak from (defaults to now)
 * @param restDays - Array of rest day numbers (0=Sunday, 6=Saturday)
 * @returns Current streak count (0 if streak has expired)
 *
 * @example
 * const completed = new Set(['2024-01-10', '2024-01-11', '2024-01-12']);
 * computeCurrentStreakFromDates(completed, new Date('2024-01-13'))
 * // returns 3 (consecutive days)
 *
 * @example
 * // With Saturday (6) and Sunday (0) as rest days
 * const completed = new Set(['2024-01-12']); // Friday
 * computeCurrentStreakFromDates(completed, new Date('2024-01-15'), [0, 6])
 * // returns 1 (weekend rest days don't break streak)
 */
export const computeCurrentStreakFromDates = (
  completedDates: Set<string>,
  today: Date,
  restDays: number[] = []
): number => {
  if (!completedDates || completedDates.size === 0) {
    return 0;
  }

  const todayString = format(new Date(today), 'yyyy-MM-dd');

  // Find the most recent completed date that is not in the future
  const latestCompleted = [...completedDates]
    .filter((date) => date <= todayString)
    .sort()
    .pop();

  if (!latestCompleted) {
    return 0;
  }

  // Check that the streak is still active: last completion must be today or
  // yesterday (accounting for rest days in between).
  const latestDate = parseISO(latestCompleted);
  const todayDate = parseISO(todayString);
  const msDiff = todayDate.getTime() - latestDate.getTime();
  const daysSinceLastCompletion = Math.round(msDiff / (1000 * 60 * 60 * 24));

  if (daysSinceLastCompletion > 1) {
    // Count rest days between last completion and today
    let restDaysBetween = 0;
    if (restDays.length > 0) {
      const cursor = new Date(latestDate);
      for (let i = 0; i < daysSinceLastCompletion - 1; i++) {
        cursor.setDate(cursor.getDate() + 1);
        if (isRestDay(cursor, restDays)) {
          restDaysBetween++;
        }
      }
    }
    const effectiveGap = daysSinceLastCompletion - restDaysBetween;
    if (effectiveGap > 1) {
      return 0;
    }
  }

  let streak = 0;
  const currentDate = parseISO(latestCompleted);

  // Count consecutive days backward from the latest completion
  // Skip rest days (they don't count but don't break the streak)
  const maxLookbackDays = STREAK_MAX_LOOKBACK_DAYS;
  for (let i = 0; i < maxLookbackDays; i++) {
    const dateString = format(currentDate, 'yyyy-MM-dd');

    if (isRestDay(currentDate, restDays)) {
      // Rest day - skip it
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }

    if (completedDates.has(dateString)) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    break;
  }

  return streak;
};
