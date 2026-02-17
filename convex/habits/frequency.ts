/**
 * Frequency Types and Utilities
 *
 * Defines the habit frequency modes and provides utilities for working with them.
 *
 * Frequency modes:
 * - daily: Every day
 * - weekly: X times per week (1-7)
 * - days: Specific days of week (e.g., MWF)
 * - interval: Every X days (2, 3, 7, 14, 30)
 */

import { v } from 'convex/values';

/** Frequency type literal */
export type FrequencyType =
  | 'daily'
  | 'weekly'
  | 'days'
  | 'interval';

/** Day of week (0=Sunday, 6=Saturday) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Interval options in days */
export type IntervalOption = 2 | 3 | 7 | 14 | 30;

/**
 * Frequency configuration object
 */
export interface FrequencyConfig {
  type: FrequencyType;
  daysOfWeek?: DayOfWeek[];
  timesPerWeek?: number; // 1-7, for 'weekly' type
  intervalDays?: IntervalOption; // for 'interval' type
}

/** Convex validator for frequency type */
export const frequencyTypeValidator = v.union(
  v.literal('daily'),
  v.literal('weekly'),
  v.literal('days'),
  v.literal('interval')
);

/** Day of week validator (0-6) */
export const dayOfWeekValidator = v.number();

/**
 * Default frequency config (daily)
 */
export const DEFAULT_FREQUENCY: FrequencyConfig = {
  type: 'daily',
};

/**
 * Parse frequency from JSON string
 */
export function parseFrequencyConfig(frequencyJson: string): FrequencyConfig {
  try {
    const parsed = JSON.parse(frequencyJson);
    return {
      type: parsed.type || 'daily',
      daysOfWeek: parsed.daysOfWeek,
      timesPerWeek: parsed.timesPerWeek,
      intervalDays: parsed.intervalDays,
    };
  } catch {
    return DEFAULT_FREQUENCY;
  }
}

/**
 * Serialize frequency config to JSON string
 */
export function serializeFrequencyConfig(config: FrequencyConfig): string {
  return JSON.stringify(config);
}

/**
 * Get a human-readable frequency label
 */
export function getFrequencyLabel(config: FrequencyConfig): string {
  switch (config.type) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return `${config.timesPerWeek}x/week`;
    case 'days':
      if (!config.daysOfWeek || config.daysOfWeek.length === 0) {
        return 'Daily';
      }
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return config.daysOfWeek
        .sort((a, b) => a - b)
        .map((d) => dayNames[d])
        .join('');
    case 'interval':
      if (!config.intervalDays) return 'Daily';
      const interval = config.intervalDays;
      if (interval === 7) return 'Weekly';
      if (interval === 14) return 'Every 2 weeks';
      if (interval === 30) return 'Monthly';
      return `Every ${interval} days`;
    default:
      return 'Daily';
  }
}

/**
 * Get a longer description for frequency
 */
export function getFrequencyDescription(config: FrequencyConfig): string {
  switch (config.type) {
    case 'daily':
      return 'Every day';
    case 'weekly':
      return `${config.timesPerWeek} ${config.timesPerWeek === 1 ? 'time' : 'times'} per week`;
    case 'days':
      if (!config.daysOfWeek || config.daysOfWeek.length === 0) {
        return 'Every day';
      }
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const selectedDays = config.daysOfWeek
        .sort((a, b) => a - b)
        .map((d) => dayNames[d]);
      if (selectedDays.length === 1) {
        return `${selectedDays[0]}s`;
      }
      if (selectedDays.length === 5) {
        const missing = [0, 1, 2, 3, 4, 5, 6]
          .filter((d) => !config.daysOfWeek!.includes(d))
          .map((d) => dayNames[d]);
        if (missing.length === 2) {
          return `${missing.join(' & ')} off`;
        }
      }
      return selectedDays.join(', ');
    case 'interval':
      if (!config.intervalDays) return 'Every day';
      return `Every ${config.intervalDays} days`;
    default:
      return 'Every day';
  }
}

/**
 * Check if a date should have the habit scheduled based on frequency
 */
export function isHabitScheduledForDate(
  config: FrequencyConfig,
  date: Date
): boolean {
  const dayOfWeek = date.getDay() as DayOfWeek;

  switch (config.type) {
    case 'daily':
      return true;

    case 'days':
      if (!config.daysOfWeek || config.daysOfWeek.length === 0) {
        return true;
      }
      return config.daysOfWeek.includes(dayOfWeek);

    case 'weekly':
      // For "X times per week", we don't determine specific days here
      // This is handled during streak calculation
      return true;

    case 'interval':
      if (!config.intervalDays) return true;
      // Calculate days since a reference date (epoch)
      const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
      return daysSinceEpoch % config.intervalDays === 0;

    default:
      return true;
  }
}

/**
 * Get icon for frequency type
 */
export function getFrequencyIcon(config: FrequencyConfig): string {
  switch (config.type) {
    case 'daily':
      return '📅';
    case 'weekly':
      return '📊';
    case 'days':
      return '🗓️';
    case 'interval':
      return '🔄';
    default:
      return '📅';
  }
}
