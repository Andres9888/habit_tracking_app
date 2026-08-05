/**
 * Schedule helpers — which calendar days a habit was actually expected on.
 *
 * `habit.daysOfWeek` holds 0-6 (Sunday-Saturday) and is only written when the
 * user picks fewer than seven days, so an absent/empty array means "every day".
 */

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

interface Schedulable {
  daysOfWeek?: number[];
}

/** Normalised set of scheduled weekdays; `null` means every day. */
export function scheduledWeekdays(habit: Schedulable): Set<number> | null {
  const days = habit.daysOfWeek;
  if (!Array.isArray(days) || days.length === 0 || days.length >= 7)
    return null;
  return new Set(days);
}

export function isScheduledWeekday(
  scheduled: Set<number> | null,
  weekday: number
): boolean {
  return scheduled === null || scheduled.has(weekday);
}

/** Parse a YYYY-MM-DD string as a local-midnight Date (never UTC-shifted). */
export function parseLocalDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

/** Whole days between two YYYY-MM-DD strings, inclusive of both ends. */
export function inclusiveDaySpan(from: string, to: string): number {
  const start = parseLocalDate(from).getTime();
  const end = parseLocalDate(to).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.round((end - start) / 86_400_000) + 1;
}
