/**
 * Helper to check if habit is connected to next week
 */

import { addDays, format, parse, startOfDay } from 'date-fns';
import type { HabitStatus } from '../types';

type StatusGetter = (habitId: string, dateString: string) => HabitStatus;

const nextDateStringCache = new Map<string, string | null>();
const connectionCache = new WeakMap<StatusGetter, Map<string, boolean>>();
// The `null` (future-date) entries below depend on "today", so the cache is
// only valid for a single calendar day. Drop it when the day rolls over,
// otherwise a value cached as null before midnight stays stale afterward.
let cacheDay = '';

function getNextDateString(lastDateString: string): string | null {
  const today = startOfDay(new Date());
  const todayKey = format(today, 'yyyy-MM-dd');
  if (todayKey !== cacheDay) {
    nextDateStringCache.clear();
    cacheDay = todayKey;
  }
  const cached = nextDateStringCache.get(lastDateString);
  if (cached !== undefined) return cached;
  try {
    const lastDate = parse(lastDateString, 'yyyy-MM-dd', new Date());
    const nextDate = addDays(lastDate, 1);
    if (nextDate > today) {
      nextDateStringCache.set(lastDateString, null);
      return null;
    }
    const nextDateString = format(nextDate, 'yyyy-MM-dd');
    nextDateStringCache.set(lastDateString, nextDateString);
    return nextDateString;
  } catch (error) {
    if (__DEV__) console.warn('Error calculating next date status', error);
    nextDateStringCache.set(lastDateString, null);
    return null;
  }
}

/**
 * Checks if the day after the last date in the week was completed.
 * Used to show connecting chain extending to next weeks.
 *
 * Note: Only shows connection if the next day is not in the future.
 */
export function getNextWeekConnection(
  lastDateString: string | undefined,
  habitId: string,
  getHabitStatus: StatusGetter
): boolean {
  if (!lastDateString) return false;
  const nextDateString = getNextDateString(lastDateString);
  if (!nextDateString) return false;

  let getterCache = connectionCache.get(getHabitStatus);
  if (!getterCache) {
    getterCache = new Map();
    connectionCache.set(getHabitStatus, getterCache);
  }
  const cacheKey = `${habitId}|${nextDateString}`;
  const cached = getterCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const result = getHabitStatus(habitId, nextDateString) === 'done';
  getterCache.set(cacheKey, result);
  return result;
}
