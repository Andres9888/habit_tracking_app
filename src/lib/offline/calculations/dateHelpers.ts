/**
 * Date Helpers for Streak Calculation
 *
 * Client-side date utilities that mirror the server-side helpers
 * from convex/streakUtils/dateHelpers.ts for consistency.
 */

/**
 * Calculate the difference in days between two dates
 * Mirrors convex/streakUtils/dateHelpers.ts differenceInDays
 *
 * @param date1 - First date (typically later date)
 * @param date2 - Second date (typically earlier date)
 * @returns Number of days difference (positive if date1 > date2)
 */
export function differenceInDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Normalize to midnight to avoid timezone issues
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffMs = d1.getTime() - d2.getTime();
  // Use Math.round to handle DST transitions correctly.
  // On spring-forward, consecutive midnight-to-midnight is 23 hours;
  // Math.floor(23/24) would incorrectly return 0 instead of 1.
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Parse a date string in YYYY-MM-DD format to a Date object
 * Uses T00:00:00 suffix to ensure consistent timezone handling
 *
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Date object at midnight
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Format a Date object to YYYY-MM-DD string
 *
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 *
 * @returns Today's date string
 */
export function getTodayDateKey(): string {
  return formatDate(new Date());
}

/**
 * Check if a date string is valid YYYY-MM-DD format
 *
 * @param dateString - String to validate
 * @returns True if valid date format
 */
export function isValidDateFormat(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  const date = parseDate(dateString);
  return !Number.isNaN(date.getTime()) && formatDate(date) === dateString;
}
