/**
 * Tracking module helpers
 */

/**
 * Get today's date in YYYY-MM-DD format (local timezone).
 * @returns Today's date as YYYY-MM-DD string
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
 * @param timezone - Optional IANA timezone string
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


/** Return the greater of two date keys.
 * @param a - First date string
 * @param b - Second date string
 * @returns The later date
 */
export function maxDateKey(a: string, b: string): string {
  return a > b ? a : b;
}

/** Regex for validating YYYY-MM-DD date format */
export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Find the maximum date key from a list of tracking records.
 * @param records - Array of records with date fields
 * @param defaultDate - Fallback date if records is empty
 * @returns The maximum date found, or defaultDate
 */
export function findMaxTrackingDate(
  records: Array<{ date: string }>,
  defaultDate: string
): string {
  let maxDate = defaultDate;
  for (const record of records) {
    if (record.date > maxDate) {
      maxDate = record.date;
    }
  }
  return maxDate;
}
