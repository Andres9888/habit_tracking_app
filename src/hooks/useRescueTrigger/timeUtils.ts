/**
 * Time utility functions for useRescueTrigger hook
 */

import type { QuietHoursConfig } from './types';

/**
 * Calculate hours remaining until end of day (midnight)
 */
export function getHoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const msRemaining = midnight.getTime() - now.getTime();
  return msRemaining / (1000 * 60 * 60);
}

/**
 * Parse time string (HH:MM) to hours and minutes
 */
export function parseTimeString(time: string): {
  hours: number;
  minutes: number;
} {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
}

/**
 * Check if current time is within quiet hours
 * Handles overnight ranges (e.g., 22:00 - 07:00)
 */
export function isInQuietHoursWindow(quietHours: QuietHoursConfig): boolean {
  if (!quietHours.enabled) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const start = parseTimeString(quietHours.startTime);
  const end = parseTimeString(quietHours.endTime);

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  // Handle overnight range (e.g., 22:00 - 07:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  // Same-day range (e.g., 13:00 - 15:00)
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

/**
 * Check if current time is past the scheduled habit time
 */
export function isPastScheduledTime(scheduledTime?: string | Date): boolean {
  if (!scheduledTime) return false;

  const now = new Date();
  let scheduled: Date;

  if (typeof scheduledTime === 'string') {
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    scheduled = new Date(now);
    scheduled.setHours(hours, minutes, 0, 0);
  } else {
    scheduled = scheduledTime;
  }

  return now > scheduled;
}
