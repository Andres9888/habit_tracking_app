/**
 * BinaryHeatmap Accessibility Utilities
 *
 * Accessibility labels and helpers for screen readers.
 */

import { format, parseISO } from 'date-fns';

import type { BinaryDay, BinaryCellState } from './types';
import { DAY_NAMES_FULL } from './constants';

/**
 * Determine the cell state based on day properties
 */
export function getCellState(day: BinaryDay): BinaryCellState {
  if (day.isBeforeCreation) return 'beforeCreation';
  if (day.isFuture) return 'future';
  if (day.isToday) return 'today';
  return day.completed ? 'done' : 'missed';
}

/**
 * Format a date string for accessibility
 */
export function formatDateForAccessibility(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Generate accessibility label for a binary cell
 */
export function getBinaryCellAccessibilityLabel(day: BinaryDay | null): string {
  if (day === null) return 'Empty cell';

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
