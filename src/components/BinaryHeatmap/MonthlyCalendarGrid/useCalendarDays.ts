/**
 * useCalendarDays Hook
 *
 * Generates calendar day data for the monthly view.
 */

import { useMemo } from 'react';
import type { HabitDayContext } from '../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { DayData } from './types';
import { buildCalendarDays } from './buildCalendarDays';

interface UseCalendarDaysParams {
  currentMonth: Date;
  completedDates: Set<string>;
  dayContext?: HabitDayContext;
  today?: string;
}

export function useCalendarDays({
  currentMonth,
  completedDates,
  dayContext = {},
  today: todayOverride,
}: UseCalendarDaysParams) {
  const systemToday = useMemo(() => getLocalDateString(), []);
  const todayString = todayOverride ?? systemToday;

  const days = useMemo(() => {
    return buildCalendarDays({
      completedDates,
      currentMonth,
      dayContext,
      today: todayString,
    });
  }, [
    completedDates,
    currentMonth,
    dayContext.createdAt,
    dayContext.daysOfWeek,
    dayContext.pausedAt,
    dayContext.resumedAt,
    todayString,
  ]);

  // Chunk days into weeks for row-based rendering
  const weeks = useMemo(() => {
    const result: DayData[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return { days, today: todayString, weeks };
}
