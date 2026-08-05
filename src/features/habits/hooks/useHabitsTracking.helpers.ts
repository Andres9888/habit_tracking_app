import { validateDateString } from '../../../utils/validation';
import type { HabitStatus } from '../types';

type PlannedStatus = Exclude<HabitStatus, 'done'>;
type TrackingQueryArgs = { endDate: string; startDate: string };
export type DateStatusInfo = { isValid: boolean; status: PlannedStatus };

export function normalizeToday(today: Date) {
  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);
  return normalizedToday;
}

export function buildTrackingQueryArgs(
  firstDateString: string | undefined,
  lastDateString: string | undefined
): TrackingQueryArgs {
  const first = firstDateString ?? '';
  const last = lastDateString ?? first;
  const ascending = first && last ? first <= last : true;
  return ascending
    ? { endDate: last, startDate: first }
    : { endDate: first, startDate: last };
}

export function computeDateStatusInfo(dateString: string, today: Date): DateStatusInfo {
  const validation = validateDateString(dateString);
  if (!validation.isValid) {
    if (__DEV__) console.warn(`Invalid date string: ${dateString}`, validation.error);
    return { isValid: false, status: 'planned' };
  }

  const [year = 0, month = 1, day = 1] = dateString.split('-').map(Number);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    if (__DEV__) console.warn(`Non-numeric date parts: ${dateString}`);
    return { isValid: false, status: 'planned' };
  }

  const parsedDate = new Date(year, month - 1, day);
  parsedDate.setHours(0, 0, 0, 0);
  if (Number.isNaN(parsedDate.getTime())) {
    if (__DEV__) console.warn(`Invalid date created from: ${dateString}`);
    return { isValid: false, status: 'planned' };
  }

  return { isValid: true, status: parsedDate < today ? 'missed' : 'planned' };
}

export function buildDateStatusCache(extendedDateStrings: string[], stableToday: Date) {
  const dateStatusCache = new Map<string, DateStatusInfo>();
  for (const dateString of extendedDateStrings) {
    const normalizedDateString = dateString.trim();
    if (!normalizedDateString || dateStatusCache.has(normalizedDateString)) continue;
    dateStatusCache.set(
      normalizedDateString,
      computeDateStatusInfo(normalizedDateString, stableToday)
    );
  }
  return dateStatusCache;
}

export function getDateStatusInfo(
  dateStatusCache: Map<string, DateStatusInfo>,
  dateString: string,
  stableToday: Date
) {
  const cachedDateStatusInfo = dateStatusCache.get(dateString);
  if (cachedDateStatusInfo) return cachedDateStatusInfo;
  const computedDateStatusInfo = computeDateStatusInfo(dateString, stableToday);
  dateStatusCache.set(dateString, computedDateStatusInfo);
  return computedDateStatusInfo;
}
