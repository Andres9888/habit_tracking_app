import { format } from 'date-fns';
import { useCallback } from 'react';
import type {
  CompletionStatus,
  DayCompletionStatus,
} from './CalendarTimeline.types';

/**
 * Custom hook for CalendarTimeline component logic
 */
export const useCalendarTimelineLogic = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  const isFuture = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() > today.getTime();
  };

  return { isFuture, isToday };
};

/** Returns a function that resolves a Date to its CompletionStatus */
export function useCompletionStatus(
  completionByDay: Record<string, DayCompletionStatus>,
  isFuture: (date: Date) => boolean
) {
  return useCallback(
    (date: Date): CompletionStatus => {
      if (isFuture(date)) return 'future';
      const dateString = format(date, 'yyyy-MM-dd');
      const dayStatus = completionByDay[dateString];
      if (!dayStatus || dayStatus.total === 0) return 'none';
      if (dayStatus.completed === dayStatus.total) return 'complete';
      if (dayStatus.completed > 0) return 'partial';
      return 'none';
    },
    [completionByDay, isFuture]
  );
}
