/**
 * Frequency utility functions for parsing/displaying frequency strings.
 *
 * Frequency is stored as a simple string in the DB:
 *   - "daily"
 *   - "specific_days"
 *   - "x_per_week:3"  (3 times per week)
 *   - "every_x_days:2" (every 2 days)
 */

import type { FrequencyType } from './FrequencyPicker.types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

/**
 * Parse a frequency string into its type and numeric parameter.
 */
export function parseFrequency(freq: string): {
  type: FrequencyType;
  param?: number;
} {
  if (!freq || freq === 'daily') return { type: 'daily' };
  if (freq === 'specific_days') return { type: 'specific_days' };
  if (freq.startsWith('x_per_week:')) {
    const param = parseInt(freq.split(':')[1], 10);
    return { type: 'x_per_week', param: isNaN(param) ? 3 : param };
  }
  if (freq.startsWith('every_x_days:')) {
    const param = parseInt(freq.split(':')[1], 10);
    return { type: 'every_x_days', param: isNaN(param) ? 2 : param };
  }
  return { type: 'daily' };
}

/**
 * Build a frequency string from type + parameter.
 */
export function buildFrequencyString(
  type: FrequencyType,
  param?: number
): string {
  switch (type) {
    case 'daily':
      return 'daily';
    case 'specific_days':
      return 'specific_days';
    case 'x_per_week':
      return `x_per_week:${param ?? 3}`;
    case 'every_x_days':
      return `every_x_days:${param ?? 2}`;
    default:
      return 'daily';
  }
}

/**
 * Convert a frequency string + daysOfWeek into a human-readable label.
 */
export function frequencyToLabel(freq: string, daysOfWeek?: number[]): string {
  const { type, param } = parseFrequency(freq);
  switch (type) {
    case 'daily':
      return 'Every day';
    case 'specific_days': {
      if (!daysOfWeek || daysOfWeek.length === 0) return 'Specific days';
      if (daysOfWeek.length === 7) return 'Every day';
      // Check for weekdays (Mon-Fri)
      const weekdays = [1, 2, 3, 4, 5];
      if (
        daysOfWeek.length === 5 &&
        weekdays.every((d) => daysOfWeek.includes(d))
      ) {
        return 'Weekdays';
      }
      // Check for weekends
      if (
        daysOfWeek.length === 2 &&
        daysOfWeek.includes(0) &&
        daysOfWeek.includes(6)
      ) {
        return 'Weekends';
      }
      return daysOfWeek
        .sort((a, b) => a - b)
        .map((d) => DAY_LABELS[d])
        .join(', ');
    }
    case 'x_per_week':
      return `${param}× per week`;
    case 'every_x_days':
      return param === 1 ? 'Every day' : `Every ${param} days`;
    default:
      return 'Every day';
  }
}

/**
 * Get short day labels for the day picker buttons.
 */
export function getDayLabelsShort(): readonly string[] {
  return DAY_LABELS_SHORT;
}

/**
 * Get full day labels.
 */
export function getDayLabels(): readonly string[] {
  return DAY_LABELS;
}
