/**
 * Weekly Trend Calculations
 *
 * Computes week-over-week completion trends for habit tracking.
 */

import type { HabitTrackingEntry } from '../../features/habits/types';
import { formatDateString } from '../dateUtils';
import { getWeekStart } from './dateHelpers';
import type { WeekOverWeekTrend } from './types';

/**
 * Calculate week-over-week completion trend
 *
 * Compares the current week (Monday to today) with the previous week (Monday to Sunday).
 * Used for weekly trend indicators in the progress section.
 *
 * @param tracking - Array of habit tracking entries
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns Week-over-week trend comparison data
 */
export function calculateWeekOverWeekTrend(
  tracking: HabitTrackingEntry[],
  referenceDate?: Date
): WeekOverWeekTrend {
  // Clone the date to avoid mutating the caller's object
  const today = new Date(referenceDate ?? new Date());
  today.setHours(23, 59, 59, 999);

  // This week: Monday to today
  const thisWeekStart = getWeekStart(today);

  // Last week: Previous Monday to Sunday
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
  lastWeekEnd.setHours(23, 59, 59, 999);
  const lastWeekStart = getWeekStart(lastWeekEnd);

  // Create a set of completed dates for quick lookup
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // Count this week's completions (Monday to today)
  let thisWeekCompleted = 0;
  let thisWeekTotal = 0;
  const thisWeekCurrent = new Date(thisWeekStart);

  while (thisWeekCurrent <= today) {
    thisWeekTotal++;
    const dateStr = formatDateString(thisWeekCurrent);
    if (completedDates.has(dateStr)) {
      thisWeekCompleted++;
    }
    thisWeekCurrent.setDate(thisWeekCurrent.getDate() + 1);
  }

  // Count last week's completions (full 7 days)
  let lastWeekCompleted = 0;
  const lastWeekCurrent = new Date(lastWeekStart);

  while (lastWeekCurrent <= lastWeekEnd) {
    const dateStr = formatDateString(lastWeekCurrent);
    if (completedDates.has(dateStr)) {
      lastWeekCompleted++;
    }
    lastWeekCurrent.setDate(lastWeekCurrent.getDate() + 1);
  }

  const lastWeekTotal = 7; // Always 7 days for last week

  // Calculate rates
  const thisWeekRate =
    thisWeekTotal > 0
      ? Math.round((thisWeekCompleted / thisWeekTotal) * 100)
      : 0;

  const lastWeekRate =
    lastWeekTotal > 0
      ? Math.round((lastWeekCompleted / lastWeekTotal) * 100)
      : 0;

  return {
    countChange: thisWeekCompleted - lastWeekCompleted,
    lastWeekCompleted,
    lastWeekRate,
    lastWeekTotal,
    rateChange: thisWeekRate - lastWeekRate,
    thisWeekCompleted,
    thisWeekRate,
    thisWeekTotal,
  };
}
