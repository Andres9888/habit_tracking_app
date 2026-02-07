import { addDays, format, startOfDay, subMonths } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

export function useHabitsWeekDates() {
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

  const trackingDateRange = useMemo(() => {
    const endDate = format(today, 'yyyy-MM-dd');
    const startDate = format(subMonths(today, 12), 'yyyy-MM-dd');
    return { startDate, endDate };
  }, [today]);

  const canNavigateForward = useMemo(
    () => weekAnchor.getTime() < today.getTime(),
    [today, weekAnchor]
  );

  const handlePreviousWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, -5));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, 5));
  }, []);

  return {
    today,
    weekDates,
    weekDateStrings,
    trackingDateRange,
    canNavigateForward,
    handleNextWeek,
    handlePreviousWeek,
  };
}
