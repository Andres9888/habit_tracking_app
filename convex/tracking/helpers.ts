/**
 * Tracking module helpers
 */

/** Get today's date in YYYY-MM-DD format */
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Return the greater of two date keys */
export function maxDateKey(a: string, b: string): string {
  return a > b ? a : b;
}

/** Regex for validating YYYY-MM-DD date format */
export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Find the maximum date key from a list of tracking records */
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
