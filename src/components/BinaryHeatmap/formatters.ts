/**
 * BinaryHeatmap Formatters
 *
 * Date formatting and tooltip helpers.
 */

import { format, parseISO } from 'date-fns';

import type { BinaryDay } from './types';

/**
 * Format tooltip text for a day cell
 */
export function formatTooltipText(day: BinaryDay): string {
  const date = parseISO(day.date);
  const formattedDate = format(date, 'MMM d');

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
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
