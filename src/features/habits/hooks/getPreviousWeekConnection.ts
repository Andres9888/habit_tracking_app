/**
 * Helper to check if habit is connected to previous week
 */

import { addDays, format, parse } from 'date-fns';
import type { HabitStatus } from '../types';

/**
 * Checks if the day before the first date in the week was completed.
 * Used to show connecting chain between weeks.
 */
export function getPreviousWeekConnection(
  firstDateString: string | undefined,
  habitId: string,
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus
): boolean {
  if (!firstDateString) return false;

  try {
    const firstDate = parse(firstDateString, 'yyyy-MM-dd', new Date());
    const previousDate = addDays(firstDate, -1);
    const previousDateString = format(previousDate, 'yyyy-MM-dd');
    return getHabitStatus(habitId, previousDateString) === 'done';
  } catch (error) {
    if (__DEV__) {
      console.warn('Error calculating previous date status', error);
    }
    return false;
  }
}
