/**
 * AffirmationScheduleModal Time Utilities
 * Helper functions for time parsing and formatting
 */

import { DEFAULT_DELIVERY_HOUR, DEFAULT_DELIVERY_MINUTE } from './constants';

/**
 * Parse HH:MM string to Date object (today at that time)
 */
export function parseTimeToDate(time?: string): Date {
  const now = new Date();
  if (!time) {
    now.setHours(DEFAULT_DELIVERY_HOUR, DEFAULT_DELIVERY_MINUTE, 0, 0);
    return now;
  }

  const [hours, minutes] = time.split(':').map(Number);
  now.setHours(hours || 0, minutes || 0, 0, 0);
  return now;
}

/**
 * Format Date to HH:MM string (24-hour format)
 */
export function formatDateToTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format time for display (12-hour with AM/PM)
 */
export function formatTimeForDisplay(time?: string): string {
  if (!time) return '8:00 AM';
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const safeHours = Number.isNaN(hours) ? 0 : hours;
  const safeMinutes = Number.isNaN(minutes) ? 0 : minutes;
  const period = safeHours >= 12 ? 'PM' : 'AM';
  const displayHours = safeHours % 12 || 12;
  return `${displayHours}:${safeMinutes.toString().padStart(2, '0')} ${period}`;
}
