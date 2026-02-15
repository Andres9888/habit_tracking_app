
import { useCallback, useMemo, useState } from 'react';

import { addDays, eachDayOfInterval, format, startOfDay, subMonths } from 'date-fns';

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
    return eachDayOfInterval({ end: endDate, start: startDate });
  }, [today]);

  const extendedDateStrings = useMemo(
    () => extendedDateRange.map((date) => format(date, 'yyyy-MM-dd')),
    [extendedDateRange]
  );

  return {
    canNavigateForward,
    extendedDateStrings,
    handleNextWeek,
    handlePreviousWeek,
    today,
    weekDates,
    weekDateStrings,
  };
}
