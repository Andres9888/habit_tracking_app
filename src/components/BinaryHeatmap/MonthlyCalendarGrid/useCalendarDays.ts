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
  isValid,
} from 'date-fns';
import type { DayData } from './types';

/** Safely format a date, returning empty string on error */
function safeFormat(date: Date, formatStr: string): string {
  try {
    if (!date || !(date instanceof Date) || !isValid(date)) {
      return '';
    }
    return format(date, formatStr);
  } catch {
    return '';
  }
}

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
  // Memoize today's date string to prevent new Date object on every render
  const todayString = useMemo(() => safeFormat(startOfToday(), 'yyyy-MM-dd'), []);
  const today = useMemo(() => startOfToday(), [todayString]);

  const days = useMemo(() => {
    // Guard against invalid currentMonth
    if (!currentMonth || Number.isNaN(currentMonth.getTime())) {
      return [];
    }
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    let calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    // Always generate 6 weeks (42 days) so the grid height is constant
    // and there's no blank row at the bottom for 5-week months
    const naturalDays = Math.round((calendarEnd.getTime() - calendarStart.getTime()) / 86_400_000) + 1;
    if (naturalDays < 42) {
      calendarEnd = new Date(calendarStart.getTime() + 41 * 86_400_000);
    }

    return eachDayOfInterval({ end: calendarEnd, start: calendarStart })
      .filter((date) => date && isValid(date))
      .map((date): DayData => {
        const dateString = safeFormat(date, 'yyyy-MM-dd');
        const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
        const isToday = isSameDay(date, today);
        const isFuture = isAfter(date, today);
        const isCompleted = dateString ? (completedDates?.has(dateString) ?? false) : false;
        const isBeforeCreation = habitCreatedAt
          ? isBefore(date, new Date(habitCreatedAt)) && !isCompleted
          : false;
        // A day is "missed" if it's in the past, not before creation, not completed, and not in the future
        const isMissed = !isFuture && !isBeforeCreation && !isCompleted && isCurrentMonth;

        return {
          date,
          dateString,
          dayNumber: date.getDate(),
          isBeforeCreation,
          isCompleted,
          isCurrentMonth,
          isFuture,
          isToday,
          isMissed,
        };
      });
  }, [currentMonth, todayString, completedDates, habitCreatedAt]);

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
