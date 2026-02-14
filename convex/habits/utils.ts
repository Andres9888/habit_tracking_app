/**
 * Habit Utility Functions
 * Date handling utilities for habits module
 */

/** Get today's date as YYYY-MM-DD string (UTC — use getTodayForTimezone when user timezone is available) */
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

/** Return the lexicographically larger date key */
export function maxDateKey(a: string, b: string): string {
  return a > b ? a : b;
}

/** Find the maximum order value in a list of habits */
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

/** Validate date string format (YYYY-MM-DD) */
export function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Check if a date is in the future
 * Allows a 24-hour grace period to handle timezone differences
 * (e.g., user in PST sees Feb 2nd while server in UTC sees Feb 1st)
 */
export function isFutureDate(dateStr: string): boolean {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const inputDate = new Date(
    Number(yearStr),
    Number(monthStr) - 1,
    Number(dayStr)
  );
  const today = new Date();
  // Allow dates up to 24 hours ahead to accommodate timezone differences
  const gracePeriodMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate.getTime() > today.getTime() + gracePeriodMs;
}
