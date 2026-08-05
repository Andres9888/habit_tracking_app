/**
 * Date Helper Functions for Trend Calculations
 *
 * Provides week start/end calculation utilities for trend comparisons.
 */

/**
 * Get the start of the week (Monday) for a given date
 *
 * @param date - Date to get the week start for
 * @returns Date object set to Monday 00:00:00 of that week
 */
export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  // Convert Sunday (0) to 7 for Monday-start weeks
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  result.setDate(result.getDate() - daysFromMonday);
  result.setHours(0, 0, 0, 0);
  return result;
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
