/**
 * Local Date String Utilities
 *
 * Provides functions to get dates in YYYY-MM-DD format using local timezone.
 * Use these for display purposes where local time matters.
 *
 * IMPORTANT: Do NOT use `new Date().toISOString().split('T')[0]`
 * as that converts to UTC and causes timezone bugs.
 *
 * @module getLocalDateString
 * @category Date Handling
 * @see {@link module:dateUtils} For UTC-based date calculations
 */

/**
 * Get a date as YYYY-MM-DD string in LOCAL timezone.
 *
 * @param date - Date object (defaults to current date)
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * getLocalDateString() // "2024-01-15" (local time)
 * getLocalDateString(new Date(2024, 0, 15)) // "2024-01-15"
 */
export function getLocalDateString(date: Date = new Date()): string {
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Invalid date passed to getLocalDateString');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD string in local timezone.
 *
 * @deprecated Use {@link module:dateUtils.getTodayString} instead.
 *             This function is kept for backward compatibility.
 * @returns Today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return getLocalDateString(new Date());
}

/**
 * Parse a YYYY-MM-DD calendar key as a local date.
 * `new Date('YYYY-MM-DD')` is UTC midnight and shifts the day in US timezones.
 */
export function parseDateKeyLocal(dateKey: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) {
    const fallback = new Date(dateKey);
    if (Number.isNaN(fallback.getTime())) {
      throw new TypeError(`Invalid date key: ${dateKey}`);
    }
    return fallback;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatDateKeyLabel(
  dateKey: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return parseDateKeyLocal(dateKey).toLocaleDateString('en-US', options);
}
