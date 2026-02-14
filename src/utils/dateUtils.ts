/**
 * Date Utilities for Client-Side Calculations
 * Provides consistent date handling that matches backend (convex/streakUtils.ts)
 */

/**
 * Calculate the difference in days between two dates
 * Uses UTC to avoid timezone/DST issues completely
 * Uses Math.round to handle any remaining fractional day differences
 *
 * @param date1 - First date (or date string in YYYY-MM-DD format)
 * @param date2 - Second date (or date string in YYYY-MM-DD format)
 * @returns Number of days difference (positive if date1 > date2)
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
 * Parse a date to UTC midnight, avoiding timezone issues
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

  // Convert Date object to UTC midnight
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  );
}

/**
 * Get today's date string in YYYY-MM-DD format
 * Uses local timezone
 */
export function getTodayString(): string {
  const today = new Date();
  return formatDateString(today);
}

/**
 * Format a date to YYYY-MM-DD string
 * Handles both Date objects and existing strings
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
    }
    date = parsed;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string represents today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

/**
 * Check if a date string represents yesterday
 */
export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === formatDateString(yesterday);
}
