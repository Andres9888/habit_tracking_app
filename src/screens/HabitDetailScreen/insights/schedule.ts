/** Schedule display constants and date-range helpers for Habit Detail. */

import {
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from '../../../features/habits/habitSchedule';

export { isScheduledWeekday, parseLocalDate, scheduledWeekdays };

export const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export const WEEKDAY_PLURAL = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
] as const;

/** Monday-first display order, matching the design's week strip. */
export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

/** Whole days between two YYYY-MM-DD strings, inclusive of both ends. */
export function inclusiveDaySpan(from: string, to: string): number {
  const start = parseLocalDate(from).getTime();
  const end = parseLocalDate(to).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.round((end - start) / 86_400_000) + 1;
}
