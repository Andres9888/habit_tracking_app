import { addDays, eachDayOfInterval, format, startOfDay, subMonths } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

export function useHabitCalendar() {
  const today = useMemo(() => startOfDay(new Date()), []);
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

  const extendedDateRange = useMemo(() => {
    const endDate = today;
    const startDate = subMonths(endDate, 12);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [today]);

  const extendedDateStrings = useMemo(
    () => extendedDateRange.map((date) => format(date, 'yyyy-MM-dd')),
    [extendedDateRange]
  );

  return {
    today,
    weekDates,
    weekDateStrings,
    extendedDateStrings,
    handlePreviousWeek,
    handleNextWeek,
    canNavigateForward,
  };
}
