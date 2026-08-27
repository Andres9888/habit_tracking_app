/**
 * Monday-first cell grid for one calendar month, used by MonthGridCard.
 *
 * State comes from `getHabitDayState` — the canonical model shared by the Detail
 * week, the History list, the Day screen and this grid — so a square and the
 * "Daily record" row beneath it can never disagree about the same day.
 */

import { eachDayOfInterval, endOfMonth, getDay } from 'date-fns';
import type { ViewStyle } from 'react-native';
import {
  getHabitDayState,
  type HabitDayContext,
  type HabitDayState,
} from '../../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import type { InsightPalette } from '../../insightPalette';

export interface MonthCell {
  date: string;
  hasNote: boolean;
  state: HabitDayState;
}

interface MonthCellsInput {
  completedDates: Set<string>;
  /** 0-11. */
  month: number;
  notes?: Record<string, string>;
  /** createdAt / daysOfWeek / pausedAt / resumedAt. */
  schedule?: HabitDayContext;
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
  year: number;
}

/** Leading blanks so the first day lands under its Monday-first column. */
function leadingBlanks(first: Date): number {
  return (getDay(first) + 6) % 7;
}

export function buildMonthCells({
  completedDates,
  month,
  notes,
  schedule = {},
  today = getLocalDateString(),
  year,
}: MonthCellsInput): (MonthCell | null)[] {
  const start = new Date(year, month, 1);

  const cells: (MonthCell | null)[] = Array.from(
    { length: leadingBlanks(start) },
    () => null
  );

  for (const day of eachDayOfInterval({ end: endOfMonth(start), start })) {
    const date = getLocalDateString(day);
    cells.push({
      date,
      hasNote: Boolean(notes?.[date]),
      state: getHabitDayState({
        completed: completedDates.has(date),
        createdAt: schedule.createdAt,
        date,
        daysOfWeek: schedule.daysOfWeek,
        pausedAt: schedule.pausedAt,
        resumedAt: schedule.resumedAt,
        today,
      }),
    });
  }

  return cells;
}

/**
 * Cell fill for a state. Not-scheduled, upcoming and before-creation days share
 * the palest tone; today is drawn as a ring on the card surface, not a fill.
 * These values are the contract HistoryLegend's swatches advertise.
 */
export function monthCellColor(
  state: HabitDayState,
  palette: InsightPalette
): string {
  if (state === 'completed') return palette.green;
  if (state === 'paused') return palette.greenSoft;
  if (state === 'open-today') return palette.card;
  if (state === 'missed') return palette.cellEmpty;
  return palette.cellFuture;
}

/**
 * Ink for the day number inside a cell. A coloured square says a day was
 * missed; a numbered one says WHICH day, which is what you need to correct it.
 */
export function monthCellTextColor(
  state: HabitDayState,
  palette: InsightPalette
): string {
  if (state === 'completed') return palette.onGreen;
  if (state === 'open-today') return palette.green;
  return palette.textTertiary;
}

/** Ring around a cell: dashed for a miss, solid for today, hairline upcoming. */
function ring(
  borderColor: string,
  borderStyle: 'dashed' | 'solid',
  borderWidth: number
): ViewStyle {
  return { borderColor, borderStyle, borderWidth };
}

export function monthCellBorder(
  state: HabitDayState,
  palette: InsightPalette
): ViewStyle {
  if (state === 'missed') return ring(palette.missedRing, 'dashed', 1.5);
  if (state === 'open-today') return ring(palette.green, 'solid', 1.5);
  if (state === 'upcoming') return ring(palette.cardBorder, 'solid', 1);
  return { borderWidth: 0 };
}
