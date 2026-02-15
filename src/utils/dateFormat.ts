/**
 * Date Formatting Utilities
 * Provides consistent, locale-aware date formatting across the app
 */

import { format, parseISO } from 'date-fns';

/**
 * Get the user's locale from the browser or device
 * Falls back to 'en-US' only if unavailable
 */
function getUserLocale(): string {
  try {
    // Try to get from browser/device
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale || 'en-US';
  } catch {
    return 'en-US';
  }
}

/**
 * Format a date string (ISO) to a locale-aware short date (e.g., "Jan 15")
 */
export function formatShortDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d');
  } catch {
    return dateString;
  }
}

/**
 * Format a date string (ISO) to a locale-aware full date (e.g., "January 15, 2026")
 */
export function formatFullDate(dateString: string): string {
  try {
    const locale = getUserLocale();
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Format a timestamp to a locale-aware date string (e.g., "Jan 15, 2026")
 */
export function formatDate(timestamp: number | Date): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return format(date, 'MMM d, yyyy');
  } catch {
    return String(timestamp);
  }
}

/**
 * Format a timestamp to a locale-aware date with time (e.g., "Jan 15, 7:03 AM")
 */
export function formatDateTime(timestamp: number | Date): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return format(date, 'MMM d, h:mm a');
  } catch {
    return String(timestamp);
  }
}

/**
 * Format a timestamp to locale-aware relative date (e.g., "2d ago")
 * For older dates, falls back to locale-aware date format
 */
export function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return formatDate(timestamp);
}

/**
 * Format a date for display in lists (e.g., "Jan 15, 2026")
 */
export function formatListDate(date: Date | string | number): string {
  try {
    const d = new Date(date);
    return format(d, 'MMM d, yyyy');
  } catch {
    return String(date);
  }
}

/**
 * Format today's date for header display (e.g., "Today · Jan 15")
 */
export function formatTodayHeader(): string {
  const now = new Date();
  const locale = getUserLocale();
  const datePart = now.toLocaleDateString(locale, { 
    day: 'numeric', 
    month: 'short' 
  });
  return `Today · ${datePart}`;
}

/**
 * Format a date for letter unlock display (e.g., "Monday, January 15, 2026")
 */
export function formatLetterUnlockDate(timestamp: number): string {
  const date = new Date(timestamp);
  const locale = getUserLocale();
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date for stats/export (e.g., "1/15/2026" in US, "15/1/2026" in EU)
 */
export function formatLocaleDate(date: Date | string | number): string {
  try {
    const d = new Date(date);
    const locale = getUserLocale();
    return d.toLocaleDateString(locale);
  } catch {
    return String(date);
  }
}
