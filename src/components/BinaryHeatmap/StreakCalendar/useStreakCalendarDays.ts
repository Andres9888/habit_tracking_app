/**
 * useStreakCalendarDays Hook
 * Calculates the day grid for the streak calendar
 */

import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  isFuture,
  format,
  isBefore,
  startOfDay,
} from 'date-fns';
import type { DayData, UseStreakCalendarDaysProps, UseStreakCalendarDaysReturn } from './types';

export function useStreakCalendarDays({
  completedDates,
  currentMonth,
  habitCreatedAt,
}: UseStreakCalendarDaysProps): UseStreakCalendarDaysReturn {
  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const createdAtDate = habitCreatedAt ? new Date(habitCreatedAt) : null;
    const createdAtDateStart = createdAtDate
      ? startOfDay(createdAtDate)
      : null;

    const dayDataArray: DayData[] = allDays.map((date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const today = isToday(date);
      const isFutureDate = isFuture(date);
      const isBeforeCreation =
        createdAtDateStart && isBefore(date, createdAtDateStart);
      const isCompleted = completedDates.has(dateString);

      return {
        date,
        dateString,
        dayNumber: date.getDate(),
        isCurrentMonth,
        isToday: today,
        isFuture: isFutureDate,
        isBeforeCreation: isBeforeCreation || false,
        isCompleted,
      };
    });

    // Split into weeks
    const weeksArray: (DayData | null)[][] = [];
    for (let i = 0; i < dayDataArray.length; i += 7) {
      weeksArray.push(dayDataArray.slice(i, i + 7));
    }

    return weeksArray;
  }, [completedDates, currentMonth, habitCreatedAt]);

  return { weeks };
}
