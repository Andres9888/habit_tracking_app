import { parse, startOfDay } from 'date-fns';
import { useCallback, useMemo } from 'react';
import type { HabitStatus } from './types';

export const useHabitChainVisualizerLogic = (
  weekDateStrings: string[],
  weekStatus: HabitStatus[],
  isConnectedToPreviousWeek: boolean
) => {
  const todayTime = useMemo(() => startOfDay(new Date()).getTime(), []);

  const dateTimes = useMemo(
    () =>
      weekDateStrings.map((dateString) =>
        startOfDay(parse(dateString, 'yyyy-MM-dd', new Date())).getTime()
      ),
    [weekDateStrings]
  );

  const completedIndices = useMemo(() => {
    const set = new Set<number>();
    weekStatus.forEach((status, index) => {
      if (status === 'done') set.add(index);
    });
    return set;
  }, [weekStatus]);

  const isFutureDate = useCallback(
    (index: number): boolean => (dateTimes[index] ?? 0) > todayTime,
    [dateTimes, todayTime]
  );

  const isCompleted = useCallback(
    (index: number): boolean => completedIndices.has(index),
    [completedIndices]
  );

  const isStreakBreak = useCallback(
    (index: number): boolean => {
      if (weekStatus[index] !== 'missed') return false;
      if (index === 0) return isConnectedToPreviousWeek;
      return weekStatus[index - 1] === 'done';
    },
    [isConnectedToPreviousWeek, weekStatus]
  );

  const isToday = useCallback(
    (index: number): boolean => (dateTimes[index] ?? -1) === todayTime,
    [dateTimes, todayTime]
  );

  return {
    isCompleted,
    isFutureDate,
    isStreakBreak,
    isToday,
  };
};
