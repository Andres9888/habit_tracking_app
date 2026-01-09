/**
 * Utility functions for SimpleReminderSection
 */

import type { QuickPreset } from './types';

/**
 * Calculates the next occurrence of a specific time.
 * If the time has already passed today, returns tomorrow's date.
 */
export const nextAt = (
  base: Date,
  hour: number,
  minute: number,
  alwaysTomorrow: boolean
): Date => {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  if (alwaysTomorrow || d.getTime() <= base.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
};

/**
 * Checks if a date matches a specific hour and minute.
 */
export const isTimeMatch = (
  date: Date,
  hour: number,
  minute: number
): boolean => {
  return date.getHours() === hour && date.getMinutes() === minute;
};

/**
 * Builds quick time presets for morning, afternoon, and evening.
 */
export const buildQuickPresets = (): QuickPreset[] => {
  const now = new Date();
  return [
    { alwaysTomorrow: false, hour: 8, label: 'Morning', minute: 0 },
    { alwaysTomorrow: false, hour: 13, label: 'Afternoon', minute: 0 },
    { alwaysTomorrow: false, hour: 20, label: 'Evening', minute: 30 },
  ].map((p) => ({
    date: nextAt(now, p.hour, p.minute, p.alwaysTomorrow),
    label: p.label,
    time: `${p.hour > 12 ? p.hour - 12 : p.hour}:${p.minute.toString().padStart(2, '0')} ${p.hour >= 12 ? 'PM' : 'AM'}`,
  }));
};
