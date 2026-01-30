/**
 * BinaryHeatmap Formatters
 *
 * Date formatting and tooltip helpers.
 */

import { format, parseISO, isValid } from 'date-fns';

import type { BinaryDay } from './types';

/**
 * Safely format a date, returning fallback on error
 */
function safeFormat(date: Date, formatStr: string, fallback: string): string {
  try {
    if (!date || !(date instanceof Date) || !isValid(date)) {
      return fallback;
    }
    return format(date, formatStr);
  } catch {
    return fallback;
  }
}

/**
 * Format tooltip text for a day cell
 */
export function formatTooltipText(day: BinaryDay): string {
  if (!day?.date) return 'Unknown date';

  const date = parseISO(day.date);
  const formattedDate = safeFormat(date, 'MMM d', day.date);

  if (day.isToday) return `${formattedDate}: Today`;
  if (day.isFuture) return `${formattedDate}: Future`;
  if (day.isBeforeCreation) return `${formattedDate}: Before tracking`;

  return day.completed
    ? `${formattedDate}: Done ✓`
    : `${formattedDate}: Missed`;
}

/**
 * Check if a date string is valid
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = parseISO(dateStr);
  return !Number.isNaN(date.getTime());
}

/**
 * Convert a Date to YYYY-MM-DD format
 * Returns empty string for invalid dates to prevent crashes
 */
export function formatDateString(date: Date): string {
  return safeFormat(date, 'yyyy-MM-dd', '');
}
