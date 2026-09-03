/**
 * Monday-first week columns for the year-at-a-glance grid: from the week that
 * holds January 1 through today. Cells share `getHabitDayState` with every
 * other calendar on the screen. Days after today are omitted, not drawn faint —
 * the grid shows the year so far, and its width is spent on real days.
 */
import { eachDayOfInterval, format, getDay, startOfYear } from 'date-fns';
import {
  getHabitDayState,
  type HabitDayContext,
  type HabitDayState,
} from '../../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate } from '../../insights';

export interface YearCell {
  date: string;
  state: HabitDayState;
}

export interface YearMonthLabel {
  label: string;
  weekIndex: number;
}

interface YearCellsInput {
  completedDates: Set<string>;
  schedule: HabitDayContext;
  today?: string;
}

export function buildYearCells({
  completedDates,
  schedule,
  today = getLocalDateString(),
}: YearCellsInput): {
  weeks: (YearCell | null)[][];
  monthLabels: YearMonthLabel[];
} {
  const end = parseLocalDate(today);
  const start = startOfYear(end);
  const weeks: (YearCell | null)[][] = [];
  const monthLabels: YearMonthLabel[] = [];
  let week: (YearCell | null)[] = Array.from(
    { length: (getDay(start) + 6) % 7 },
    () => null
  );

  for (const day of eachDayOfInterval({ end, start })) {
    const date = getLocalDateString(day);
    if (day.getDate() === 1) {
      monthLabels.push({ label: format(day, 'MMM'), weekIndex: weeks.length });
    }
    week.push({
      date,
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
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) weeks.push(week);
  return { monthLabels, weeks };
}
