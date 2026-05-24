/**
 * Helper to check if habit is connected to previous week
 */

import { addDays, format, parse } from 'date-fns';
import type { HabitStatus } from '../types';

type StatusGetter = (habitId: string, dateString: string) => HabitStatus;

const previousDateStringCache = new Map<string, string | null>();
const connectionCache = new WeakMap<StatusGetter, Map<string, boolean>>();

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

  let getterCache = connectionCache.get(getHabitStatus);
  if (!getterCache) {
    getterCache = new Map();
    connectionCache.set(getHabitStatus, getterCache);
  }
  const cacheKey = `${habitId}|${previousDateString}`;
  const cached = getterCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const result = getHabitStatus(habitId, previousDateString) === 'done';
  getterCache.set(cacheKey, result);
  return result;
}
