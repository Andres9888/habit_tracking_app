/**
 * Trend comparison utilities
 */

import type { HabitTrackingEntry } from '../../../features/habits/types';
import type { TrendComparison } from '../types';
import { formatDateString } from '../../../utils/dateUtils';

/**
 * Calculate trend comparison between this month and last month
 *
 * @param tracking - Array of habit tracking entries
 * @returns Object with thisMonth, lastMonth rates and change
 */
export function calculateTrendComparison(
  tracking: HabitTrackingEntry[]
): TrendComparison {
  const today = new Date();
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  let thisMonthCompleted = 0;
  let thisMonthTotal = 0;
  let lastMonthCompleted = 0;
  let lastMonthTotal = 0;

  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // This month
  const current = new Date(thisMonthStart);
  while (current <= today) {
    thisMonthTotal++;
    if (completedDates.has(formatDateString(current))) {
      thisMonthCompleted++;
    }
    current.setDate(current.getDate() + 1);
  }

  // Last month
  const lastCurrent = new Date(lastMonthStart);
  while (lastCurrent <= lastMonthEnd) {
    lastMonthTotal++;
    if (completedDates.has(formatDateString(lastCurrent))) {
      lastMonthCompleted++;
    }
    lastCurrent.setDate(lastCurrent.getDate() + 1);
  }

  const thisMonthRate =
    thisMonthTotal > 0
      ? Math.round((thisMonthCompleted / thisMonthTotal) * 100)
      : 0;
  const lastMonthRate =
    lastMonthTotal > 0
      ? Math.round((lastMonthCompleted / lastMonthTotal) * 100)
      : 0;

  return {
    change: thisMonthRate - lastMonthRate,
    lastMonth: lastMonthRate,
    thisMonth: thisMonthRate,
  };
}
