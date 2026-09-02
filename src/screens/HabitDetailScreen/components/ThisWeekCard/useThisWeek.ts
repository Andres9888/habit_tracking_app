/** Derives the Monday-first week strip for ThisWeekCard. */

import { useMemo } from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import {
  getHabitDayState,
  type HabitDayContext,
  type HabitDayState,
} from '../../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import {
  isScheduledWeekday,
  scheduledWeekdays,
  WEEKDAY_SHORT,
} from '../../insights';

export interface WeekDay {
  date: string;
  dayNum: number;
  isToday: boolean;
  scheduled: boolean;
  short: string;
  state: HabitDayState;
}

interface UseThisWeekArgs extends HabitDayContext {
  completedDates: Set<string>;
  today?: string;
}

export function useThisWeek({
  completedDates,
  createdAt,
  daysOfWeek,
  pausedAt,
  resumedAt,
  today = getLocalDateString(),
}: UseThisWeekArgs) {
  return useMemo(() => {
    const scheduled = scheduledWeekdays({ daysOfWeek });
    const monday = startOfWeek(new Date(`${today}T00:00:00`), {
      weekStartsOn: 1,
    });

    const days: WeekDay[] = Array.from({ length: 7 }, (_, index) => {
      const cursor = addDays(monday, index);
      const date = getLocalDateString(cursor);
      const weekday = cursor.getDay();
      const isScheduled = isScheduledWeekday(scheduled, weekday);
      const state = getHabitDayState({
        completed: completedDates.has(date),
        createdAt,
        date,
        daysOfWeek,
        pausedAt,
        resumedAt,
        today,
      });
      return {
        date,
        dayNum: cursor.getDate(),
        isToday: date === today,
        scheduled: isScheduled,
        short: WEEKDAY_SHORT[weekday] ?? '',
        state,
      };
    });

    const sunday = addDays(monday, 6);
    const endStamp =
      sunday.getMonth() === monday.getMonth()
        ? format(sunday, 'd')
        : format(sunday, 'MMM d');

    return {
      days,
      doneCount: days.filter((day) => day.state === 'completed').length,
      rangeLabel: `${format(monday, 'MMM d')} – ${endStamp}`,
      // Chances still on the table this week: today if it is still open, plus
      // every scheduled day after it. Misses are already behind you and are
      // not "left".
      remainingScheduled: days.filter(
        (day) =>
          day.scheduled &&
          (day.state === 'open-today' || day.state === 'upcoming')
      ).length,
      scheduledCount: days.filter((day) => day.scheduled).length,
    };
  }, [completedDates, createdAt, daysOfWeek, pausedAt, resumedAt, today]);
}
