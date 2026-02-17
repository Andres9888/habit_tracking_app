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

/** A single vacation period with ISO date strings */
export interface VacationPeriod {
  end: string;
  start: string;
}

/**
 * Check whether a given date string falls within any vacation period.
 * Vacation days are excluded from streak computation (neither break nor grow).
 */
export function isVacationDay(
  dateString: string,
  vacationPeriods: VacationPeriod[] | undefined
): boolean {
  if (!vacationPeriods || vacationPeriods.length === 0) return false;
  return vacationPeriods.some(
    ({ start, end }) => dateString >= start && dateString <= end
  );
}

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
  today: Date,
  vacationPeriods?: VacationPeriod[]
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
  // yesterday (or the gap is covered by vacation days).
  // This matches the server-side calculateStreakFromHistory which
  // returns currentStreak=0 when daysSinceLastCompletion > 1.
  const latestDate = parseISO(latestCompleted);
  const todayDate = parseISO(todayString);
  const msDiff = todayDate.getTime() - latestDate.getTime();
  const daysSinceLastCompletion = Math.round(msDiff / (1000 * 60 * 60 * 24));

  // Allow grace through vacation days: walk the gap and check if all
  // non-completed days are covered by vacation
  if (daysSinceLastCompletion > 1) {
    let allGapDaysAreVacation = true;
    for (let d = 1; d < daysSinceLastCompletion; d++) {
      const checkDate = new Date(latestDate);
      checkDate.setDate(checkDate.getDate() + d);
      const checkString = format(checkDate, 'yyyy-MM-dd');
      if (!isVacationDay(checkString, vacationPeriods)) {
        allGapDaysAreVacation = false;
        break;
      }
    }
    if (!allGapDaysAreVacation) {
      return 0;
    }
  }

  let streak = 0;
  const currentDate = parseISO(latestCompleted);

  // Count consecutive days backward from the latest completion.
  // Vacation days are skipped — they don't break or extend the streak.
  const maxLookbackDays = STREAK_MAX_LOOKBACK_DAYS;
  for (let i = 0; i < maxLookbackDays; i++) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    if (completedDates.has(dateString)) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    // Skip vacation days without breaking the streak
    if (isVacationDay(dateString, vacationPeriods)) {
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    break;
  }

  return streak;
};


