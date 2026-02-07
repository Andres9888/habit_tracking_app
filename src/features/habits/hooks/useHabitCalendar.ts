import { addDays, format, subMonths } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { useToday } from './useToday';

export function useHabitCalendar() {
  const today = useToday();
  const [weekAnchor, setWeekAnchor] = useState(today);

  const weekDates = useMemo(
    () => Array.from({ length: 5 }, (_, index) => addDays(weekAnchor, index - 4)),
    [weekAnchor]
  );

  const weekDateStrings = useMemo(
    () => weekDates.map((date) => format(date, 'yyyy-MM-dd')),
    [weekDates]
  );

  const handlePreviousWeek = useCallback(() => {
    setWeekAnchor((previous) => addDays(previous, -5));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekAnchor((previous) => addDays(previous, 5));
  }, []);

  const canNavigateForward = useMemo(
    () => weekAnchor.getTime() < today.getTime(),
    [weekAnchor, today]
  );

  const trackingDateRange = useMemo(() => {
    const endDate = format(today, 'yyyy-MM-dd');
    const startDate = format(subMonths(today, 12), 'yyyy-MM-dd');
    return { startDate, endDate };
  }, [today]);

  return {
    today,
    weekDates,
    weekDateStrings,
    trackingDateRange,
    handlePreviousWeek,
    handleNextWeek,
    canNavigateForward,
  };
}
