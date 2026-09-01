import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import {
  getHabitDayState,
  type HabitDayContext,
  type HabitDayState,
} from '../../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate } from '../../insights';

export interface HistoryEntry {
  date: string;
  day: number;
  done: boolean;
  label: string;
  note?: string;
  state: HabitDayState;
}

/** Chronological entries for one month, newest first, stopping at today. */
export function buildHistoryEntries(
  month: Date,
  doneDates: Set<string>,
  today = getLocalDateString(),
  notes: Record<string, string> = {},
  schedule: HabitDayContext = {}
): HistoryEntry[] {
  const monthStart = startOfMonth(month);
  const created = schedule.createdAt
    ? parseLocalDate(getLocalDateString(new Date(schedule.createdAt)))
    : undefined;
  const start = created && created > monthStart ? created : monthStart;
  const monthEnd = endOfMonth(monthStart);
  const cursor = parseLocalDate(today);
  const end = new Date(Math.min(monthEnd.getTime(), cursor.getTime()));
  if (end.getTime() < start.getTime()) return [];

  return eachDayOfInterval({ end, start })
    .map((date) => {
      const key = getLocalDateString(date);
      const done = doneDates.has(key);
      return {
        date: key,
        day: date.getDate(),
        done,
        label: format(date, 'EEE d'),
        note: notes[key] || undefined,
        state: getHabitDayState({
          completed: done,
          createdAt: schedule.createdAt,
          date: key,
          daysOfWeek: schedule.daysOfWeek,
          pausedAt: schedule.pausedAt,
          resumedAt: schedule.resumedAt,
          today,
        }),
      };
    })
    .reverse();
}
