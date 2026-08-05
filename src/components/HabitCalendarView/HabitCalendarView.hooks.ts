import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  parse,
  startOfDay,
  startOfToday,
  isBefore,
  isSameDay,
} from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';

export type HabitStatus = 'done' | 'missed' | 'planned' | 'upcoming';

interface UseHabitCalendarViewLogicProps {
  habitId: Id<'habits'>;
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
}

export const useHabitCalendarViewLogic = ({
  habitId,
  tracking,
}: UseHabitCalendarViewLogicProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const trackingMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const { habitId: entryHabitId, date, completed } of tracking) {
      if (entryHabitId === habitId) {
        map.set(date, completed);
      }
    }
    return map;
  }, [habitId, tracking]);

  const getHabitStatus = useCallback(
    (dateString: string): HabitStatus => {
      const parsedDate = startOfDay(
        parse(dateString, 'yyyy-MM-dd', new Date())
      );
      const today = startOfToday();
      const completion = trackingMap.get(dateString);

      if (completion) {
        return 'done';
      }

      if (isSameDay(parsedDate, today)) {
        return 'planned';
      }

      if (isBefore(parsedDate, today)) {
        return 'missed';
      }

      return 'upcoming';
    },
    [trackingMap]
  );

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const { daysInMonth, emptyDays } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ end: monthEnd, start: monthStart });
    const firstDayOfWeek = monthStart.getDay();

    return {
      daysInMonth: days,
      emptyDays: Array.from({ length: firstDayOfWeek }, (_, i) => i),
    };
  }, [currentMonth]);

  return {
    currentMonth,
    daysInMonth,
    emptyDays,
    getHabitStatus,
    handleNextMonth,
    handlePreviousMonth,
    handleToday,
  };
};

export type HabitCalendarViewState = ReturnType<typeof useHabitCalendarViewLogic>;
