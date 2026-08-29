import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate } from '../../insights';

export interface HistoryEntry {
  date: string;
  day: number;
  done: boolean;
  label: string;
  note?: string;
}

/** Chronological entries for one month, newest first, stopping at today. */
export function buildHistoryEntries(
  month: Date,
  doneDates: Set<string>,
  today = getLocalDateString(),
  notes: Record<string, string> = {}
): HistoryEntry[] {
  const start = startOfMonth(month);
  const monthEnd = endOfMonth(start);
  const cursor = parseLocalDate(today);
  const end = new Date(Math.min(monthEnd.getTime(), cursor.getTime()));
  if (end.getTime() < start.getTime()) return [];

  return eachDayOfInterval({ end, start })
    .map((date) => {
      const key = getLocalDateString(date);
      return {
        date: key,
        day: date.getDate(),
        done: doneDates.has(key),
        label: format(date, 'EEE d'),
        note: notes[key] || undefined,
      };
    })
    .reverse();
}
