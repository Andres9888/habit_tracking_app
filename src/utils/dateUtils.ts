/**
 * Date Utilities for Client-Side Calculations
 *
 * Provides consistent date handling that matches backend (convex/streakUtils.ts).
 * All functions use UTC to avoid timezone/DST issues.
 *
 * @module dateUtils
 * @category Date Handling
 */

/**
 * Calculate the difference in days between two dates.
 * Uses UTC to avoid timezone/DST issues completely.
 * Uses Math.round to handle any remaining fractional day differences.
 *
 * @param date1 - First date (Date object or YYYY-MM-DD string)
 * @param date2 - Second date (Date object or YYYY-MM-DD string)
 * @returns Number of days difference (positive if date1 > date2)
 *
 * @example
 * differenceInDays('2024-01-10', '2024-01-05') // returns 5
 * differenceInDays(new Date('2024-01-10'), '2024-01-05') // returns 5
 */
export function differenceInDays(
  date1: Date | string,
  date2: Date | string
): number {
  // Parse to UTC dates to avoid all timezone/DST issues
  const d1 = parseToUTCMidnight(date1);
  const d2 = parseToUTCMidnight(date2);

  const diffMs = d1.getTime() - d2.getTime();
  // Use Math.round to handle any potential sub-day differences
  // that might occur despite UTC normalization
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Parse a date to UTC midnight, avoiding timezone issues.
 * Internal helper function for date calculations.
 *
 * @param date - Date object or YYYY-MM-DD string
 * @returns Date object set to UTC midnight
 */
function parseToUTCMidnight(date: Date | string): Date {
  if (typeof date === 'string') {
    // For YYYY-MM-DD strings, parse directly as UTC
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(Date.UTC(+match[1], +match[2] - 1, +match[3], 0, 0, 0, 0));
    }
    // Fallback: parse and convert to UTC
    date = new Date(date);
  }

  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Invalid date');
  }

  // Date objects represent instants, so normalize their UTC calendar date.
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
}

/**
 * Get today's date string in YYYY-MM-DD format.
 * Uses local timezone (not UTC) to match user expectations.
 *
 * @returns Date string in YYYY-MM-DD format (e.g., "2024-01-15")
 *
 * @example
 * getTodayString() // returns "2024-01-15" (if today is January 15, 2024)
 */
export function getTodayString(): string {
  const today = new Date();
  return formatDateString(today);
}

/**
 * Format a date to YYYY-MM-DD string.
 * Handles both Date objects and existing strings.
 * Validates string input to ensure valid date format.
 *
 * @param date - Date object or YYYY-MM-DD string
 * @returns Formatted date string in YYYY-MM-DD format
 * @throws TypeError if date string is invalid
 *
 * @example
 * formatDateString(new Date(2024, 0, 15)) // returns "2024-01-15"
 * formatDateString('2024-01-15') // returns "2024-01-15"
 */
export function formatDateString(date: Date | string): string {
  if (typeof date === 'string') {
    // If already a string, validate and return
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Try to parse and format
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      throw new TypeError(`Invalid date string: ${date}`);
    } else {
      date = parsed;
    }
  }

  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Invalid date');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string represents today.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns True if the date is today, false otherwise
 *
 * @example
 * isToday('2024-01-15') // returns true if today is January 15, 2024
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

/**
 * Check if a date string represents yesterday.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns True if the date is yesterday, false otherwise
 *
 * @example
 * isYesterday('2024-01-14') // returns true if today is January 15, 2024
 */
export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === formatDateString(yesterday);
}
