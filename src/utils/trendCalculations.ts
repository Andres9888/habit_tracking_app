/**
 * Trend Calculation Utilities
 *
 * Provides functions for calculating week-over-week and month-over-month
 * delta comparisons for habit tracking progress indicators.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import type { HabitTrackingEntry } from '../features/habits/types';
import { formatDateString } from './dateUtils';

/**
 * Week-over-week comparison data
 */
export interface WeekOverWeekTrend {
  /** This week's completion count */
  thisWeekCompleted: number;
  /** This week's total days (up to today) */
  thisWeekTotal: number;
  /** This week's completion rate (0-100) */
  thisWeekRate: number;
  /** Last week's completion count */
  lastWeekCompleted: number;
  /** Last week's total days (always 7) */
  lastWeekTotal: number;
  /** Last week's completion rate (0-100) */
  lastWeekRate: number;
  /** Change in completion count (thisWeek - lastWeek) */
  countChange: number;
  /** Change in completion rate (thisWeekRate - lastWeekRate) */
  rateChange: number;
}

/**
 * Month-over-month comparison data
 */
export interface MonthOverMonthTrend {
  /** This month's completion count */
  thisMonthCompleted: number;
  /** This month's total days (up to today) */
  thisMonthTotal: number;
  /** This month's completion rate (0-100) */
  thisMonthRate: number;
  /** Last month's completion count */
  lastMonthCompleted: number;
  /** Last month's total days */
  lastMonthTotal: number;
  /** Last month's completion rate (0-100) */
  lastMonthRate: number;
  /** Change in completion count */
  countChange: number;
  /** Change in completion rate (thisMonthRate - lastMonthRate) */
  rateChange: number;
}

/**
 * Get the start of the week (Monday) for a given date
 *
 * @param date - Date to get the week start for
 * @returns Date object set to Monday 00:00:00 of that week
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  // Convert Sunday (0) to 7 for Monday-start weeks
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setDate(d.getDate() - daysFromMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the week (Sunday) for a given date
 *
 * @param date - Date to get the week end for
 * @returns Date object set to Sunday 23:59:59 of that week
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

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
