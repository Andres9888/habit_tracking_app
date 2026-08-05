import { format, isValid } from 'date-fns';

/**
 * Format a date as YYYY-MM-DD string for consistent lookup.
 * Returns empty string for invalid dates to prevent crashes.
 */
export function formatDateString(date: Date): string {
  // Guard against null, undefined, or invalid Date objects
  if (!date || !(date instanceof Date) || !isValid(date)) {
    return '';
  }
  try {
    return format(date, 'yyyy-MM-dd');
  } catch {
    // Fallback for any unexpected date-fns errors
    return '';
  }
}
