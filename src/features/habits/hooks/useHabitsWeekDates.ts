import { addDays, eachDayOfInterval, format, startOfDay } from 'date-fns';
import { useCallback, useMemo, useState, useTransition } from 'react';

const PREDICTION_LOOKBACK_DAYS = 14;
const CONNECTION_LOOKAHEAD_DAYS = 1;

export function useHabitsWeekDates() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekAnchor, setWeekAnchor] = useState(today);
  // Week navigation re-renders the whole visible habits list. Mark those
  // updates as transitions so the swipe gesture + slide animation stay
  // responsive; the new week paints a frame later while cached query data
  // keeps the previous window visible, so no blank flash.
  const [, startWeekTransition] = useTransition();

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
    startWeekTransition(() => {
      setWeekAnchor((prev) => addDays(prev, -5));
    });
  }, [startWeekTransition]);

  const handleNextWeek = useCallback(() => {
    startWeekTransition(() => {
      setWeekAnchor((prev) => {
        const nextAnchor = addDays(prev, 5);
        return nextAnchor.getTime() > today.getTime() ? today : nextAnchor;
      });
    });
  }, [startWeekTransition, today]);

  const handleJumpToToday = useCallback(() => {
    startWeekTransition(() => {
      setWeekAnchor(today);
    });
  }, [startWeekTransition, today]);

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
