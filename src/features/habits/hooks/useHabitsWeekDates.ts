import { addDays, eachDayOfInterval, format, startOfDay, subMonths } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Returns today's date, refreshed when the app resumes from background
 * or when a midnight boundary is crossed. Prevents stale date bugs
 * when the app stays open overnight.
 */
function useLiveToday() {
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const todayRef = useRef(today);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        const now = startOfDay(new Date());
        if (now.getTime() !== todayRef.current.getTime()) {
          todayRef.current = now;
          setToday(now);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Also check on a 60s interval for apps left in foreground overnight
    const interval = setInterval(() => {
      const now = startOfDay(new Date());
      if (now.getTime() !== todayRef.current.getTime()) {
        todayRef.current = now;
        setToday(now);
      }
    }, 60_000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return today;
}

export function useHabitsWeekDates() {
  const today = useLiveToday();
  const [weekAnchor, setWeekAnchor] = useState(today);

  // When the day rolls over (e.g., midnight), reset the anchor to today
  // so the user sees the current week, not yesterday's
  useEffect(() => {
    setWeekAnchor(today);
  }, [today]);

  const weekDates = useMemo(
    () => Array.from({ length: 5 }, (_, index) => addDays(weekAnchor, index - 4)),
    [weekAnchor]
  );

  const weekDateStrings = useMemo(
    () => weekDates.map((date) => format(date, 'yyyy-MM-dd')),
    [weekDates]
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
    canNavigateForward,
    extendedDateStrings,
    handleNextWeek,
    handlePreviousWeek,
    today,
    weekDates,
    weekDateStrings,
  };
}
