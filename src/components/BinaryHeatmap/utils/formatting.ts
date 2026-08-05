/**
 * BinaryHeatmap Formatting Utilities
 *
 * Functions for formatting dates and generating display text
 * for accessibility and tooltips.
 */

import { format, parseISO } from 'date-fns';
import type { BinaryDay } from '../types';
import { DAY_NAMES_FULL } from '../constants';

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

/**
 * Generate accessibility label for a binary cell
 *
 * Provides context-aware labels for screen readers, including date,
 * completion status, and special states (today, future, before tracking).
 *
 * @param day - The day data (or null for empty cells)
 * @returns Accessibility label string
 *
 * @example
 * const label = getBinaryCellAccessibilityLabel(day);
 * // "Today, Saturday, December 20, 2025. Completed"
 */
export function getBinaryCellAccessibilityLabel(day: BinaryDay | null): string {
  if (day === null) {
    return 'Empty cell';
  }

  const formattedDate = formatDateForAccessibility(day.date);
  const dayOfWeek = parseISO(day.date).getDay();
  const dayName = DAY_NAMES_FULL[dayOfWeek];

  if (day.isBeforeCreation) {
    return `${dayName}, ${formattedDate}. Before habit tracking started`;
  }

  if (day.isFuture) {
    return `${dayName}, ${formattedDate}. Future date`;
  }

  const completionStatus = day.completed ? 'Completed' : 'Not completed';
  const todayIndicator = day.isToday ? 'Today, ' : '';

  return `${todayIndicator}${dayName}, ${formattedDate}. ${completionStatus}`;
}

/**
 * Format tooltip text for a day cell
 *
 * Generates concise tooltip text for hover states.
 *
 * @param day - The day data
 * @returns Tooltip text (e.g., "Dec 15: Done ✓")
 *
 * @example
 * const tooltip = formatTooltipText(day);
 * // "Dec 15: Done ✓" or "Dec 15: Missed"
 */
export function formatTooltipText(day: BinaryDay): string {
  const date = parseISO(day.date);
  const formattedDate = format(date, 'MMM d');

  if (day.isToday) {
    return `${formattedDate}: Today`;
  }

  if (day.isFuture) {
    return `${formattedDate}: Future`;
  }

  if (day.isBeforeCreation) {
    return `${formattedDate}: Before tracking`;
  }

  return day.completed
    ? `${formattedDate}: Done ✓`
    : `${formattedDate}: Missed`;
}

/**
 * Check if a date string is valid
 *
 * Validates YYYY-MM-DD format and ensures it represents a real date.
 *
 * @param dateStr - Date string to validate
 * @returns True if the date is valid YYYY-MM-DD format
 *
 * @example
 * isValidDateString('2025-12-20'); // true
 * isValidDateString('2025-13-40'); // false
 * isValidDateString('not-a-date'); // false
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }

  const date = parseISO(dateStr);
  return !Number.isNaN(date.getTime());
}

/**
 * Convert a Date to YYYY-MM-DD format
 *
 * @param date - Date object to convert
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * formatDateString(new Date(2025, 11, 20));
 * // Returns "2025-12-20"
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
