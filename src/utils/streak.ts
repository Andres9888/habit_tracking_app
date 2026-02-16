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

import { format, getDay, parseISO } from 'date-fns';
import { STREAK_MAX_LOOKBACK_DAYS } from '@/constants';

/**
 * Check whether a date falls on a rest day.
 *
 * @param dateString - Date in YYYY-MM-DD format
 * @param restDays - Array of day-of-week numbers (0=Sun … 6=Sat)
 * @returns true if the date's day-of-week is in restDays
 */
const isRestDay = (dateString: string, restDays: number[]): boolean => {
  if (!restDays || restDays.length === 0) return false;
  const dow = getDay(parseISO(dateString)); // 0-6
  return restDays.includes(dow);
};

/**
 * Compute the current streak from a set of completed dates.
 *
 * The streak starts at the most recent completed day and counts backward
 * through consecutive completed days. A single isolated completion counts as 1.
 *
 * **Rest days** (days of the week the user has marked as off-days) are
 * transparently skipped — they neither break nor extend the streak.
 *
 * The streak is only "current" if the most recent completion (or rest day)
 * is today or yesterday (1-day grace period, matching server-side logic).
 *
 * @param completedDates - Set of date strings in YYYY-MM-DD format
 * @param today - Reference date to calculate streak from (defaults to now)
 * @param restDays - Optional array of rest-day numbers (0=Sun … 6=Sat)
 * @returns Current streak count (0 if streak has expired)
 *
 * @example
 * const completed = new Set(['2024-01-10', '2024-01-11', '2024-01-12']);
 * computeCurrentStreakFromDates(completed, new Date('2024-01-13'))
 * // returns 3 (consecutive days)
 *
 * @example
 * // With Saturday (6) as a rest day — the gap on Jan 13 (Sat) doesn't break streak
 * const completed = new Set(['2024-01-12', '2024-01-14']);
 * computeCurrentStreakFromDates(completed, new Date('2024-01-14'), [6])
 * // returns 2 (rest day skipped)
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

  // Check that the streak is still active: last completion (or continuous
  // rest days bridging to today) must be today or yesterday.
  // Walk forward from latestCompleted — if every day between it and today is
  // a rest day, the streak is still alive.
  const latestDate = parseISO(latestCompleted);
  const todayDate = parseISO(todayString);
  const msDiff = todayDate.getTime() - latestDate.getTime();
  const daysSinceLastCompletion = Math.round(msDiff / (1000 * 60 * 60 * 24));

  if (daysSinceLastCompletion > 1) {
    // Check if every gap day is a rest day
    let allRest = true;
    const checkDate = new Date(latestDate);
    for (let d = 1; d < daysSinceLastCompletion; d++) {
      checkDate.setDate(checkDate.getDate() + 1);
      const ds = format(checkDate, 'yyyy-MM-dd');
      if (!isRestDay(ds, restDays)) {
        allRest = false;
        break;
      }
    }
    // Also check if today itself is either completed or a rest day
    if (!allRest) return 0;
    if (!completedDates.has(todayString) && !isRestDay(todayString, restDays)) {
      // Today is not completed and not a rest day — apply the original 1-day grace
      if (daysSinceLastCompletion > 1) return 0;
    }
  }

  let streak = 0;
  const currentDate = parseISO(latestCompleted);

  // Count consecutive days backward from the latest completion.
  // Rest days are skipped (they don't count toward the streak number
  // but they don't break it either).
  const maxLookbackDays = STREAK_MAX_LOOKBACK_DAYS;
  for (let i = 0; i < maxLookbackDays; i++) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    if (completedDates.has(dateString)) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    if (isRestDay(dateString, restDays)) {
      // Rest day — skip without breaking streak, don't increment count
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    break;
  }

  return streak;
};


