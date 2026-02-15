/**
 * Helper to check if habit is connected to next week
 */

import { addDays, format, parse, startOfDay } from 'date-fns';
import type { HabitStatus } from '../types';

/**
 * Checks if the day after the last date in the week was completed.
 * Used to show connecting chain extending to next weeks.
 *
 * Note: Only shows connection if the next day is not in the future.
 */
export function getNextWeekConnection(
  lastDateString: string | undefined,
  habitId: string,
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus
): boolean {
  if (!lastDateString) return false;

  try {
    const lastDate = parse(lastDateString, 'yyyy-MM-dd', new Date());
    const nextDate = addDays(lastDate, 1);
    const today = startOfDay(new Date());

    // Don't show connection to future dates
    if (nextDate > today) return false;

    const nextDateString = format(nextDate, 'yyyy-MM-dd');
    return getHabitStatus(habitId, nextDateString) === 'done';
  } catch (error) {
    return false;
  }
}
