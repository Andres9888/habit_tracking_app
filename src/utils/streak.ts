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

/**
 * Compute the current streak from a set of completed dates, optionally skipping rest days.
 *
 * The streak starts at the most recent completed day and counts backward
 * through consecutive completed days. A single isolated completion counts as 1.
 *
 * The streak is only "current" if the most recent completion is today or
 * yesterday (1-day grace period, matching the server-side calculation).
 * Without this check, a streak that ended days ago would still display
 * its full length on the client while the server reports 0.
 *
 * Rest days are days when missing a habit doesn't break the streak. When calculating
 * the streak, gaps on rest days are skipped over.
 *
 * @param completedDates - Set of date strings in YYYY-MM-DD format
 * @param today - Reference date to calculate streak from (defaults to now)
 * @param restDays - Optional array of day numbers (0=Sunday, 6=Saturday) to skip in streak
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
 *
 * @example
 * // With rest days (Sunday=0, Saturday=6)
 * const completed = new Set(['2024-01-10', '2024-01-12']); // Wed, Fri (missing Thu)
 * computeCurrentStreakFromDates(completed, new Date('2024-01-13'), [4]) // Thu is rest day
 * // returns 2 (Thu gap is skipped)
 */
export const computeCurrentStreakFromDates = (
  completedDates: Set<string>,
  today: Date,
  restDays?: number[]
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
  // yesterday. This matches the server-side calculateStreakFromHistory which
  // returns currentStreak=0 when daysSinceLastCompletion > 1.
  const latestDate = parseISO(latestCompleted);
  const todayDate = parseISO(todayString);
  const msDiff = todayDate.getTime() - latestDate.getTime();
  const daysSinceLastCompletion = Math.round(msDiff / (1000 * 60 * 60 * 24));

  if (daysSinceLastCompletion > 1) {
    return 0;
  }

  let streak = 0;
  const currentDate = parseISO(latestCompleted);
  const restDaySet = restDays ? new Set(restDays) : new Set();

  // Count consecutive days backward from the latest completion
  // Stop when a gap is found (excluding rest days which are skipped)
  // Safety guard to avoid unexpected infinite loops
  const maxLookbackDays = STREAK_MAX_LOOKBACK_DAYS;
  let consecutiveGapDays = 0;
  
  for (let i = 0; i < maxLookbackDays; i++) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const dayOfWeek = currentDate.getDay();
    const isRestDay = restDaySet.has(dayOfWeek);

    if (completedDates.has(dateString)) {
      streak += 1;
      consecutiveGapDays = 0; // Reset gap counter when we find a completion
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }

    // If this is a rest day, skip it and move to the previous day
    if (isRestDay) {
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }

    // This is a non-rest day with no completion - the streak is broken
    break;
  }

  return streak;
};


