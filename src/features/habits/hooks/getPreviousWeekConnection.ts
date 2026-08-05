/**
 * Helper to check if habit is connected to previous week
 */

import { addDays, format, parse } from 'date-fns';
import type { HabitStatus } from '../types';

type StatusGetter = (habitId: string, dateString: string) => HabitStatus;

// Only the date arithmetic is cached. A previous result cache keyed on the
// getHabitStatus identity was always cold — that identity is recreated on every
// toggle — so it cost a string concat and a Map allocation per card per render
// and never returned a hit. getHabitStatus is an O(1) Set lookup on its own.
const previousDateStringCache = new Map<string, string | null>();

function getPreviousDateString(firstDateString: string): string | null {
  const cached = previousDateStringCache.get(firstDateString);
  if (cached !== undefined) return cached;
  try {
    const firstDate = parse(firstDateString, 'yyyy-MM-dd', new Date());
    const previousDate = addDays(firstDate, -1);
    const previousDateString = format(previousDate, 'yyyy-MM-dd');
    previousDateStringCache.set(firstDateString, previousDateString);
    return previousDateString;
  } catch (error) {
    if (__DEV__) console.warn('Error calculating previous date status', error);
    previousDateStringCache.set(firstDateString, null);
    return null;
  }
}

/**
 * Checks if the day before the first date in the week was completed.
 * Used to show connecting chain between weeks.
 */
export function getPreviousWeekConnection(
  firstDateString: string | undefined,
  habitId: string,
  getHabitStatus: StatusGetter
): boolean {
  if (!firstDateString) return false;
  const previousDateString = getPreviousDateString(firstDateString);
  if (!previousDateString) return false;

  return getHabitStatus(habitId, previousDateString) === 'done';
}
