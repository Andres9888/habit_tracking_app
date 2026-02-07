/**
 * Hook for HabitStats data fetching and processing
 */

import { useQuery } from 'convex/react';
import { format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitStatsData } from './HabitStats.types';

export function useHabitStats() {
  const habits = useQuery(api.habits.list) ?? [];
  const [selectedHabitId, setSelectedHabitId] = useState<Id<'habits'> | null>(
    habits[0]?._id ?? null
  );

  const today = useMemo(() => startOfDay(new Date()), []);

  const todayString = format(today, 'yyyy-MM-dd');

  const range30 = useMemo(
    () => ({
      startDate: format(subDays(today, 29), 'yyyy-MM-dd'),
      endDate: todayString,
    }),
    [today, todayString]
  );

  const range7 = useMemo(
    () => ({
      startDate: format(subDays(today, 6), 'yyyy-MM-dd'),
      endDate: todayString,
    }),
    [today, todayString]
  );

  const last30Days = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) =>
        format(subDays(today, 29 - i), 'yyyy-MM-dd')
      ),
    [today]
  );

  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        format(subDays(today, 6 - i), 'yyyy-MM-dd')
      ),
    [today]
  );

  const tracking30 =
    useQuery(api.habits.getTracking, range30) ?? [];
  const tracking7 =
    useQuery(api.habits.getTracking, range7) ?? [];

  const selectedHabit = habits.find((h) => h._id === selectedHabitId);

  const habitStats: HabitStatsData | null = useMemo(() => {
    if (!selectedHabitId) return null;

    const habitTracking30 = tracking30.filter(
      (t) => t.habitId === selectedHabitId
    );
    const habitTracking7 = tracking7.filter(
      (t) => t.habitId === selectedHabitId
    );
    const completedDates = new Set(
      habitTracking30.filter((t) => t.completed).map((t) => t.date)
    );

    // Calculate current streak
    let currentStreak = 0;
    const currentDate = new Date(today);
    while (true) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      if (completedDates.has(dateString)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (const dateStr of last30Days) {
      if (completedDates.has(dateStr)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const completionData = last30Days.map((date) => ({
      completed: habitTracking30.some((t) => t.date === date && t.completed),
      date,
    }));

    const weeklyData = last7Days.map((date) => ({
      completed: habitTracking7.some((t) => t.date === date && t.completed),
      date,
    }));

    return { completionData, currentStreak, longestStreak, weeklyData };
  }, [selectedHabitId, tracking30, tracking7, last30Days, last7Days, today]);

  return {
    habits,
    habitStats,
    selectedHabit,
    selectedHabitId,
    setSelectedHabitId,
  };
}
