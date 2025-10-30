import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import type { HabitStatus } from '../types';

export function useHabitTracking(tracking: any[], today: Date) {
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

      const startDate = new Date(today);
      const todayString = format(startDate, 'yyyy-MM-dd');
      startDate.setHours(0, 0, 0, 0);
      if (!completedDates.has(todayString)) {
        startDate.setDate(startDate.getDate() - 1);
      }

      let streak = 0;
      while (true) {
        const dateString = format(startDate, 'yyyy-MM-dd');
        if (completedDates.has(dateString)) {
          streak++;
          startDate.setDate(startDate.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
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

  return { completedDatesByHabit, getStreak, getHabitStatus };
}
