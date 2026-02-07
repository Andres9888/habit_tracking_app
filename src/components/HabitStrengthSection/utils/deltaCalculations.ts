/**
 * Delta Calculation Utilities
 *
 * Functions for calculating week-over-week and month-over-month changes.
 */

import { subDays, startOfDay } from 'date-fns';

import { calculateStrengthAtDate } from '../../HabitStrengthHistory/strengthUtils';

/**
 * Calculate week-over-week delta.
 *
 * @param completedDates - Set of completed dates
 * @param habitCreatedAt - Habit creation date
 * @param currentStrength - Current strength value
 * @returns Week-over-week change
 */
export function calculateWeekDelta(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  currentStrength: number
): number {
  // Guard against invalid date
  if (!habitCreatedAt || Number.isNaN(habitCreatedAt.getTime())) {
    return Math.round(currentStrength);
  }

  const today = startOfDay(new Date());
  const oneWeekAgo = subDays(today, 7);

  // If habit is less than 7 days old, return current strength as delta
  if (oneWeekAgo < startOfDay(habitCreatedAt)) {
    return Math.round(currentStrength);
  }

  const weekAgoStrength = calculateStrengthAtDate(
    completedDates,
    habitCreatedAt,
    oneWeekAgo
  );

  // Round to integer to match displayed values
  return Math.round(currentStrength - weekAgoStrength);
}

/**
 * Calculate month-over-month delta.
 *
 * @param completedDates - Set of completed dates
 * @param habitCreatedAt - Habit creation date
 * @param currentStrength - Current strength value
 * @returns Month-over-month change
 */
export function calculateMonthDelta(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  currentStrength: number
): number {
  // Guard against invalid date
  if (!habitCreatedAt || Number.isNaN(habitCreatedAt.getTime())) {
    return Math.round(currentStrength);
  }

  const today = startOfDay(new Date());
  const thirtyDaysAgo = subDays(today, 30);

  // If habit is less than 30 days old, return current strength as delta
  if (thirtyDaysAgo < startOfDay(habitCreatedAt)) {
    return Math.round(currentStrength);
  }

  const monthAgoStrength = calculateStrengthAtDate(
    completedDates,
    habitCreatedAt,
    thirtyDaysAgo
  );

  // Round to integer to match displayed values
  return Math.round(currentStrength - monthAgoStrength);
}
