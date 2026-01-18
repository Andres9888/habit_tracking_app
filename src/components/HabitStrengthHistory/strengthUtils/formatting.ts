import { format } from 'date-fns';

/**
 * Format a date as YYYY-MM-DD string for consistent lookup.
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
