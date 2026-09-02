import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import {
  getHabitDayState,
  type HabitDayContext,
} from '../../../features/habits/habitDayState';
import type { DayData } from './types';

interface BuildCalendarDaysArgs {
  completedDates: Set<string>;
  currentMonth: Date;
  dayContext: HabitDayContext;
  today: string;
}

function dateKey(date: Date): string {
  try {
    return date instanceof Date && isValid(date)
      ? format(date, 'yyyy-MM-dd')
      : '';
  } catch {
    return '';
  }
}

export function buildCalendarDays({
  completedDates,
  currentMonth,
  dayContext,
  today,
}: BuildCalendarDaysArgs): DayData[] {
  if (!currentMonth || Number.isNaN(currentMonth.getTime())) return [];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const start = startOfWeek(monthStart, { weekStartsOn: 1 });
  const naturalEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const naturalDays =
    Math.round((naturalEnd.getTime() - start.getTime()) / 86_400_000) + 1;
  const end =
    naturalDays < 42 ? new Date(start.getTime() + 41 * 86_400_000) : naturalEnd;

  return eachDayOfInterval({ end, start })
    .filter((date) => date && isValid(date))
    .map((date): DayData => {
      const dateString = dateKey(date);
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const isCompleted = completedDates.has(dateString);
      const state = getHabitDayState({
        ...dayContext,
        completed: isCompleted,
        date: dateString,
        today,
      });
      return {
        date,
        dateString,
        dayNumber: date.getDate(),
        isBeforeCreation: state === 'before-creation',
        isCompleted,
        isCurrentMonth,
        isFuture: dateString > today,
        isMissed: state === 'missed' && isCurrentMonth,
        isToday: dateString === today,
        state,
      };
    });
}
