/** useHabitDetailScreenComputed - Computed/derived values for the habit detail screen */

import { useMemo } from 'react';
import { getLocalDateString } from '../../utils/getLocalDateString';
import type { WeekDayData } from './HabitDetailScreen.types';

interface UseHabitDetailScreenComputedProps {
  completedDates: Set<string>;
  isCompletedToday: boolean;
  today: string;
}

export const useHabitDetailScreenComputed = ({
  completedDates,
  isCompletedToday,
  today,
}: UseHabitDetailScreenComputedProps) => {
  const lastSevenDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateKey = getLocalDateString(date);
        return dateKey === today
          ? isCompletedToday
          : completedDates.has(dateKey);
      }),
    [today, isCompletedToday, completedDates]
  );

  const lastThirtyDays = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateKey = getLocalDateString(date);
        return {
          completed:
            dateKey === today ? isCompletedToday : completedDates.has(dateKey),
          date: dateKey,
        };
      }),
    [today, isCompletedToday, completedDates]
  );

  const successRate = useMemo(
    () => (lastThirtyDays.filter((d) => d.completed).length / 30) * 100,
    [lastThirtyDays]
  );

  // Week data for WeeklySummaryStrip (Monday to Sunday)
  const weekData = useMemo<WeekDayData[]>(() => {
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const dateKey = getLocalDateString(date);
      const isTodayDate = dateKey === today;

      return {
        completed: isTodayDate ? isCompletedToday : completedDates.has(dateKey),
        date: dateKey,
        isToday: isTodayDate,
      };
    });
  }, [today, isCompletedToday, completedDates]);

  // Last week's completion count for trend comparison
  const lastWeekCompleted = useMemo(() => {
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastMonday = new Date(todayDate);
    lastMonday.setDate(todayDate.getDate() - mondayOffset - 7);
    lastMonday.setHours(0, 0, 0, 0);

    let count = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastMonday);
      date.setDate(lastMonday.getDate() + i);
      const dateKey = getLocalDateString(date);
      if (completedDates.has(dateKey)) {
        count++;
      }
    }
    return count;
  }, [completedDates]);

  return {
    lastSevenDays,
    lastThirtyDays,
    lastWeekCompleted,
    successRate,
    weekData,
  };
};
