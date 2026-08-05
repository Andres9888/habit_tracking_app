/**
 * Habit Utility Functions
 * Date handling utilities for habits module
 */

/**
 * Get today's date as YYYY-MM-DD string in local timezone.
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
/**
 * Get today's date as YYYY-MM-DD string in the user's timezone.
 * Falls back to UTC if timezone is invalid or not provided.
 * @param timezone - Optional IANA timezone string (e.g., 'America/New_York')
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayForTimezone(timezone?: string): string {
  if (!timezone) return getTodayDateKey();
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const year = parts.find((p) => p.type === 'year')?.value ?? '';
    const month = parts.find((p) => p.type === 'month')?.value ?? '';
    const day = parts.find((p) => p.type === 'day')?.value ?? '';
    return `${year}-${month}-${day}`;
  } catch {
    return getTodayDateKey();
  }
}


/**
 * Convert a millisecond timestamp to a YYYY-MM-DD date key in the user's
 * timezone. Falls back to UTC if timezone is invalid or not provided.
 *
 * Why: Comparing tracking date strings (which represent the user's calendar
 * day) against raw ms timestamps causes ±1-day offsets near midnight in
 * timezones offset from UTC.
 */
export function msToDateKeyForTimezone(
  ms: number,
  timezone?: string
): string {
  if (!timezone) {
    return new Date(ms).toISOString().slice(0, 10);
  }
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(ms));
    const year = parts.find((p) => p.type === 'year')?.value ?? '';
    const month = parts.find((p) => p.type === 'month')?.value ?? '';
    const day = parts.find((p) => p.type === 'day')?.value ?? '';
    return `${year}-${month}-${day}`;
  } catch {
    return new Date(ms).toISOString().slice(0, 10);
  }
}

/** Return the lexicographically larger date key.
 * @param a - First date string in YYYY-MM-DD format
 * @param b - Second date string in YYYY-MM-DD format
 * @returns The later of the two dates
 */
export function maxDateKey(a: string, b: string): string {
  return a > b ? a : b;
}

/** Find the maximum order value in a list of habits.
 * @param habits - Array of habit objects with optional order field
 * @returns The maximum order value, or -1 if no habits
 */
export function findMaxOrder(
  habits: Array<{ order?: number | undefined }>
): number {
  let maxOrder = -1;
  for (const habit of habits) {
    const order = habit.order ?? -1;
    if (order > maxOrder) {
      maxOrder = order;
    }
  }
  return maxOrder;
}

/** Validate date string format (YYYY-MM-DD).
 * @param date - Date string to validate
 * @returns True if the date is in valid YYYY-MM-DD format
 */
export function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Check if a date is in the future.
 *
 * When the user's IANA timezone is provided, "today" is computed in that
 * timezone and compared as a date key — exact, no grace needed. Without a
 * timezone, falls back to server-local midnight with a 24-hour grace period,
 * which under-covers users far behind UTC (legacy behavior).
 */
export function isFutureDate(dateStr: string, timezone?: string): boolean {
  if (timezone) {
    return dateStr > getTodayForTimezone(timezone);
  }
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const inputDate = new Date(Date.UTC(
    Number(yearStr),
    Number(monthStr) - 1,
    Number(dayStr)
  ));
  const today = new Date();
  // Allow dates up to 24 hours ahead to accommodate timezone differences
  const gracePeriodMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  today.setUTCHours(0, 0, 0, 0);
  return inputDate.getTime() > today.getTime() + gracePeriodMs;
}
