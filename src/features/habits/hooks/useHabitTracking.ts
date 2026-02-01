import { useCallback, useMemo } from 'react';
import { computeCurrentStreakFromDates } from '../../../utils/streak';
import type { HabitStatus } from '../types';

interface TrackingEntry {
  habitId: string;
  date: string;
  completed?: boolean;
}

export function useHabitTracking(tracking: TrackingEntry[], today: Date) {
  const completedDatesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const entry of tracking) {
      if (!entry?.completed) continue;
      if (!map.has(entry.habitId)) {
        map.set(entry.habitId, new Set<string>());
      }
      map.get(entry.habitId)!.add(entry.date);
    }
    return map;
  }, [tracking]);

  const getStreak = useCallback(
    (habitId: string) => {
      const completedDates = completedDatesByHabit.get(habitId);
      if (!completedDates) return 0;
      return computeCurrentStreakFromDates(completedDates, today);
    },
    [completedDatesByHabit, today]
  );

  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      const trackingEntry = tracking.find(
        (entry) => entry.habitId === habitId && entry.date === dateString
      );
      if (trackingEntry?.completed) return 'done';

      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);

      if (date < today) return 'missed';
      return 'planned';
    },
    [tracking, today]
  );

  return { completedDatesByHabit, getHabitStatus, getStreak };
}
