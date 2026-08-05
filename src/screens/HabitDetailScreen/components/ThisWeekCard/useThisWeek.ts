/** Derives the Monday-first week strip and milestone bar for ThisWeekCard. */

import { useMemo } from 'react';
import { addDays, startOfWeek } from 'date-fns';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import {
  isScheduledWeekday,
  scheduledWeekdays,
  WEEKDAY_SHORT,
} from '../../insights';

export type WeekDayState = 'done' | 'today' | 'missed' | 'upcoming' | 'off';

export interface WeekDay {
  date: string;
  short: string;
  state: WeekDayState;
}

interface UseThisWeekArgs {
  completedDates: Set<string>;
  daysOfWeek?: number[];
  today?: string;
}

function stateFor(
  date: string,
  today: string,
  isDone: boolean,
  isScheduled: boolean
): WeekDayState {
  if (isDone) return 'done';
  if (!isScheduled) return 'off';
  if (date === today) return 'today';
  return date < today ? 'missed' : 'upcoming';
}

export function useThisWeek({
  completedDates,
  daysOfWeek,
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
      return {
        date,
        short: WEEKDAY_SHORT[weekday] ?? '',
        state: stateFor(
          date,
          today,
          completedDates.has(date),
          isScheduledWeekday(scheduled, weekday)
        ),
      };
    });

    return {
      days,
      doneCount: days.filter((day) => day.state === 'done').length,
      scheduledCount: days.filter((day) => day.state !== 'off').length,
    };
  }, [completedDates, daysOfWeek, today]);
}
