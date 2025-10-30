import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import type { HabitTrackingEntry, HabitStatus } from '../types';

export function useHabitsTracking(extendedDateStrings: string[], today: Date) {
  const tracking =
    useQuery(api.habits.getTracking, { dates: extendedDateStrings }) ?? [];

  const completedDatesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const entry of tracking) {
      if (!entry.completed) continue;
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
      if (!completedDates) {
        return 0;
      }

      const todayCopy = new Date(today);
      const todayString = format(todayCopy, 'yyyy-MM-dd');
      const currentDate = completedDates.has(todayString)
        ? new Date(todayCopy)
        : new Date(todayCopy.getTime() - 24 * 60 * 60 * 1000);

      let streak = 0;
      while (true) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        if (completedDates.has(dateString)) {
          streak += 1;
          currentDate.setDate(currentDate.getDate() - 1);
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
      const entry = tracking.find(
        (item) => item.habitId === habitId && item.date === dateString
      );

      if (entry?.completed) {
        return 'done';
      }

      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);

      if (date < today) {
        return 'missed';
      }
      return 'planned';
    },
    [today, tracking]
  );

  return { tracking: tracking as HabitTrackingEntry[], getStreak, getHabitStatus };
}
