/**
 * Calendar-day key helpers for analytics windows.
 * Operate on YYYY-MM-DD strings so week/trend/compliance ranges stay
 * aligned with stored tracking dates instead of UTC Date instants.
 */
export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

/** Last 7 days including today, and the 7 days before that. */
export function getRollingWeekBoundaryKeys(todayKey: string) {
  return {
    lastWeekStartKey: shiftDateKey(todayKey, -13),
    thisWeekStartKey: shiftDateKey(todayKey, -6),
  };
}

/** Inclusive sequence ending on endKey: [endKey-(count-1), ..., endKey]. */
export function dateKeysEndingOn(endKey: string, count: number): string[] {
  const keys: string[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    keys.push(shiftDateKey(endKey, -offset));
  }
  return keys;
}
