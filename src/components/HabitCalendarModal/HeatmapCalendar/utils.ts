import { getDay } from 'date-fns';

export function getDaysByWeekDay(days: Date[]): Date[][] {
  const byWeekDay: Date[][] = Array.from({ length: 7 }, () => []);
  for (const day of days) {
    const weekDay = getDay(day);
    byWeekDay[weekDay].push(day);
  }
  return byWeekDay;
}

export const DISPLAY_DAYS = [
  { dayOfWeek: 1, label: 'Mon' },
  { dayOfWeek: 4, label: 'Thu' },
  { dayOfWeek: 0, label: 'Sun' },
] as const;

export const MAX_OCCURRENCES = 5;
