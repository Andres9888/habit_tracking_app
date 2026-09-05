/**
 * Streak Calculation Utilities
 *
 * Computes current streak for habit tracking.
 * Uses a 1-day grace period (matching server-side calculation) so that
 * a streak ending yesterday displays as active, but a streak ending
 * earlier displays as 0.
 *
 * @module streak
 * @category Streak Calculation
 */

import { format, parseISO } from 'date-fns';
import { STREAK_MAX_LOOKBACK_DAYS } from '@/constants';

/** Result of a current-streak walk: the count plus where the run started. */
export interface CurrentStreakRun {
  /**
   * Earliest date (YYYY-MM-DD) included in the counted run, or undefined when
   * the streak is 0. Callers use this to detect a run that was truncated by the
   * edge of a bounded tracking window.
   */
  earliestDate?: string;
  streak: number;
}

/**
 * Same calculation as {@link computeCurrentStreakFromDates}, but also reports
 * the earliest day of the counted run.
 */
export const computeCurrentStreakRun = (
  completedDates: Set<string>,
  today: Date
): CurrentStreakRun => {
  if (!completedDates || completedDates.size === 0) {
    return { streak: 0 };
  }

  const todayString = format(new Date(today), 'yyyy-MM-dd');

  // Find the most recent completed date that is not in the future.
  // Single-pass max (O(n)) avoids materializing + sorting the full Set.
  let latestCompleted: string | undefined;
  for (const date of completedDates) {
    if (date <= todayString && (latestCompleted === undefined || date > latestCompleted)) {
      latestCompleted = date;
    }
  }

  if (!latestCompleted) {
    return { streak: 0 };
  }

  // Check that the streak is still active: last completion must be today or
  // yesterday. This matches the server-side calculateStreakFromHistory which
  // returns currentStreak=0 when daysSinceLastCompletion > 1.
  const latestDate = parseISO(latestCompleted);
  const todayDate = parseISO(todayString);
  const msDiff = todayDate.getTime() - latestDate.getTime();
  const daysSinceLastCompletion = Math.round(msDiff / (1000 * 60 * 60 * 24));

  if (daysSinceLastCompletion > 1) {
    return { streak: 0 };
  }

  let streak = 0;
  let earliestDate: string | undefined;
  const currentDate = parseISO(latestCompleted);

  // Count consecutive days backward from the latest completion
  // Stop when a gap is found
  // Safety guard to avoid unexpected infinite loops
  const maxLookbackDays = STREAK_MAX_LOOKBACK_DAYS;
  for (let i = 0; i < maxLookbackDays; i++) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    if (completedDates.has(dateString)) {
      streak += 1;
      earliestDate = dateString;
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    break;
  }

  return { earliestDate, streak };
};

/**
 * Compute the current streak from a set of completed dates.
 *
 * The streak starts at the most recent completed day and counts backward
 * through consecutive completed days. A single isolated completion counts as 1.
 *
 * The streak is only "current" if the most recent completion is today or
 * yesterday (1-day grace period, matching the server-side calculation).
 * Without this check, a streak that ended days ago would still display
 * its full length on the client while the server reports 0.
 *
 * @param completedDates - Set of date strings in YYYY-MM-DD format
 * @param today - Reference date to calculate streak from (defaults to now)
 * @returns Current streak count (0 if streak has expired)
 *
 * @example
 * const completed = new Set(['2024-01-10', '2024-01-11', '2024-01-12']);
 * computeCurrentStreakFromDates(completed, new Date('2024-01-13'))
 * // returns 3 (consecutive days)
 *
 * @example
 * const completed = new Set(['2024-01-05', '2024-01-06']);
 * computeCurrentStreakFromDates(completed, new Date('2024-01-10'))
 * // returns 0 (streak expired - more than 1 day gap)
 */
export const computeCurrentStreakFromDates = (
  completedDates: Set<string>,
  today: Date
): number => computeCurrentStreakRun(completedDates, today).streak;


