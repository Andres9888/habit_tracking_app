/**
 * Habit Utility Functions
 * Date handling utilities for habits module
 */

/** Get today's date as YYYY-MM-DD string (server-local time) */
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Get today's date as YYYY-MM-DD string in UTC */
export function getTodayUTCDateKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Subtract N days from a YYYY-MM-DD date key, returning a new date key */
export function subtractDaysFromDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d - days));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
