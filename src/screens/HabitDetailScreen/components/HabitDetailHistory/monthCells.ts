/**
 * Monday-first cell grid for one calendar month, used by MonthGridCard.
 *
 * Days the habit wasn't scheduled on read as "off" rather than "missed" — a
 * three-day-a-week habit should not show four red cells every week.
 */

import { eachDayOfInterval, endOfMonth, getDay } from 'date-fns';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import type { InsightPalette } from '../../insightPalette';
import {
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from '../../insights';

export type MonthCellState = 'done' | 'doneOff' | 'missed' | 'off' | 'future';

export interface MonthCell {
  date: string;
  state: MonthCellState;
}

interface MonthCellsInput {
  completedDates: Set<string>;
  /** 0-11. */
  month: number;
  year: number;
  daysOfWeek?: number[];
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
}

/** Leading blanks so the first day lands under its Monday-first column. */
function leadingBlanks(first: Date): number {
  return (getDay(first) + 6) % 7;
}

export function buildMonthCells({
  completedDates,
  daysOfWeek,
  month,
  today = getLocalDateString(),
  year,
}: MonthCellsInput): (MonthCell | null)[] {
  const start = new Date(year, month, 1);
  const scheduled = scheduledWeekdays({ daysOfWeek });
  const cursor = parseLocalDate(today);

  const cells: (MonthCell | null)[] = Array.from(
    { length: leadingBlanks(start) },
    () => null
  );

  for (const day of eachDayOfInterval({ end: endOfMonth(start), start })) {
    const date = getLocalDateString(day);
    const isScheduled = isScheduledWeekday(scheduled, day.getDay());
    const isDone = completedDates.has(date);
    let state: MonthCellState;
    if (isDone) state = isScheduled ? 'done' : 'doneOff';
    else if (day > cursor) state = 'future';
    else state = isScheduled ? 'missed' : 'off';
    cells.push({ date, state });
  }

  return cells;
}

/** Cell fill for a state. Unscheduled and future days share the palest tone. */
export function monthCellColor(
  state: MonthCellState,
  palette: InsightPalette
): string {
  if (state === 'done') return palette.green;
  if (state === 'doneOff') return palette.greenSoft;
  if (state === 'future' || state === 'off') return palette.cellFuture;
  return palette.cellEmpty;
}
