/** Pure schedule helpers shared by habit record surfaces. */

export interface HabitSchedule {
  daysOfWeek?: number[];
}

/** Normalised set of scheduled weekdays; `null` means every day. */
export function scheduledWeekdays(habit: HabitSchedule): Set<number> | null {
  const days = habit.daysOfWeek;
  if (!Array.isArray(days) || days.length === 0 || days.length >= 7) {
    return null;
  }
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
