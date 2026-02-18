/**
 * Shared Date Formatting Utilities for Accessibility
 *
 * Centralized utilities for formatting dates in accessibility-friendly formats.
 * Used across components that need to provide screen reader labels.
 */

import { format, parseISO } from 'date-fns';

/**
 * Format a date string for accessibility
 *
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Human-readable date string (e.g., "Saturday, December 20, 2025")
 *
 * @example
 * const accessible = formatDateForAccessibility('2025-12-20');
 * // Returns "Saturday, December 20, 2025"
 */
export function formatDateForAccessibility(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'EEEE, MMMM d, yyyy');
}
