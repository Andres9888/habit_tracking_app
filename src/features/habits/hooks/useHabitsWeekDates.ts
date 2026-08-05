import { addDays, eachDayOfInterval, format, startOfDay } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

const PREDICTION_LOOKBACK_DAYS = 14;
const CONNECTION_LOOKAHEAD_DAYS = 1;

export function useHabitsWeekDates() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekAnchor, setWeekAnchor] = useState(today);

  const weekDates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => addDays(weekAnchor, index - 4)),
    [weekAnchor]
  );

  const weekDateStrings = useMemo(
    () => weekDates.map((date) => format(date, 'yyyy-MM-dd')),
    [weekDates]
  );

  const extendedDateRange = useMemo(() => {
    const firstVisibleDate = weekDates[0] ?? today;
    const lastVisibleDate = weekDates.at(-1) ?? today;
    const startDate = addDays(firstVisibleDate, -PREDICTION_LOOKBACK_DAYS);
    const endDate = addDays(lastVisibleDate, CONNECTION_LOOKAHEAD_DAYS);
    return eachDayOfInterval({ end: endDate, start: startDate });
  }, [today, weekDates]);

  const extendedDateStrings = useMemo(
    () => extendedDateRange.map((date) => format(date, 'yyyy-MM-dd')),
    [extendedDateRange]
  );

  const canNavigateForward = useMemo(
    () => weekAnchor.getTime() < today.getTime(),
    [today, weekAnchor]
  );

  const handlePreviousWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, -5));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekAnchor((prev) => {
      const nextAnchor = addDays(prev, 5);
      return nextAnchor.getTime() > today.getTime() ? today : nextAnchor;
    });
  }, [today]);

  const handleJumpToToday = useCallback(() => {
    setWeekAnchor(today);
  }, [today]);

  return {
    canNavigateForward,
    extendedDateStrings,
    handleJumpToToday,
    handleNextWeek,
    handlePreviousWeek,
    today,
    weekDates,
    weekDateStrings,
  };
}
