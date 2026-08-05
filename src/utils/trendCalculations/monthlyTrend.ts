/**
 * Monthly Trend Calculations
 *
 * Computes month-over-month completion trends for habit tracking.
 */

import type { HabitTrackingEntry } from '../../features/habits/types';
import { formatDateString } from '../dateUtils';
import type { MonthOverMonthTrend } from './types';

/**
 * Calculate month-over-month completion trend
 *
 * Compares the current month (1st to today) with the previous month (full month).
 * Used for monthly trend indicators in the progress section.
 *
 * @param tracking - Array of habit tracking entries
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns Month-over-month trend comparison data
 */
export function calculateMonthOverMonthTrend(
  tracking: HabitTrackingEntry[],
  referenceDate?: Date
): MonthOverMonthTrend {
  // Clone the date to avoid mutating the caller's object
  const today = new Date(referenceDate ?? new Date());
  today.setHours(23, 59, 59, 999);

  // This month: 1st to today
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Last month: Full previous month
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // Day 0 = last day of previous month
  lastMonthEnd.setHours(23, 59, 59, 999);

  // Create a set of completed dates for quick lookup
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // Count this month's completions
  let thisMonthCompleted = 0;
  let thisMonthTotal = 0;
  const thisMonthCurrent = new Date(thisMonthStart);

  while (thisMonthCurrent <= today) {
    thisMonthTotal++;
    const dateStr = formatDateString(thisMonthCurrent);
    if (completedDates.has(dateStr)) {
      thisMonthCompleted++;
    }
    thisMonthCurrent.setDate(thisMonthCurrent.getDate() + 1);
  }

  // Count last month's completions
  let lastMonthCompleted = 0;
  let lastMonthTotal = 0;
  const lastMonthCurrent = new Date(lastMonthStart);

  while (lastMonthCurrent <= lastMonthEnd) {
    lastMonthTotal++;
    const dateStr = formatDateString(lastMonthCurrent);
    if (completedDates.has(dateStr)) {
      lastMonthCompleted++;
    }
    lastMonthCurrent.setDate(lastMonthCurrent.getDate() + 1);
  }

  // Calculate rates
  const thisMonthRate =
    thisMonthTotal > 0
      ? Math.round((thisMonthCompleted / thisMonthTotal) * 100)
      : 0;

  const lastMonthRate =
    lastMonthTotal > 0
      ? Math.round((lastMonthCompleted / lastMonthTotal) * 100)
      : 0;

  return {
    countChange: thisMonthCompleted - lastMonthCompleted,
    lastMonthCompleted,
    lastMonthRate,
    lastMonthTotal,
    rateChange: thisMonthRate - lastMonthRate,
    thisMonthCompleted,
    thisMonthRate,
    thisMonthTotal,
  };
}

/**
 * Calculate the monthly change value for display in Stats Grid
 *
 * Returns the difference in completion count between this month and last month,
 * adjusted for the number of days elapsed. This provides a fair comparison
 * even early in the month.
 *
 * For StatsGrid, we show the raw count change (e.g., "+3" meaning 3 more completions
 * at this point in the month compared to the same point last month).
 *
 * @param tracking - Array of habit tracking entries
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns Monthly change value (positive = improvement, negative = decline)
 */
export function calculateMonthlyChangeForStatsGrid(
  tracking: HabitTrackingEntry[],
  referenceDate?: Date
): number {
  const trend = calculateMonthOverMonthTrend(tracking, referenceDate);

  // For a fair comparison, compare completion counts at the same point in the month
  // We use rate change since days elapsed may differ
  return trend.rateChange;
}
