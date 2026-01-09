/**
 * useCalendarDays Hook
 *
 * Generates calendar day data for the monthly view.
 */

import { useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfToday,
  isBefore,
  isAfter,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import type { DayData } from './types';

interface UseCalendarDaysParams {
  currentMonth: Date;
  completedDates: Set<string>;
  habitCreatedAt?: number;
}

export function useCalendarDays({
  currentMonth,
  completedDates,
  habitCreatedAt,
}: UseCalendarDaysParams) {
  const today = startOfToday();

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ end: calendarEnd, start: calendarStart }).map(
      (date): DayData => {
        const dateString = format(date, 'yyyy-MM-dd');
        const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
        const isToday = isSameDay(date, today);
        const isFuture = isAfter(date, today);
        const isCompleted = completedDates.has(dateString);
        const isBeforeCreation = habitCreatedAt
          ? isBefore(date, new Date(habitCreatedAt)) && !isCompleted
          : false;

        return {
          date,
          dateString,
          dayNumber: date.getDate(),
          isBeforeCreation,
          isCompleted,
          isCurrentMonth,
          isFuture,
          isToday,
        };
      }
    );
  }, [currentMonth, today, completedDates, habitCreatedAt]);

  // Chunk days into weeks for row-based rendering
  const weeks = useMemo(() => {
    const result: DayData[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return { days, today, weeks };
}
