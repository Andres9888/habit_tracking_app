/**
 * OPTIMIZED: useHabitStats
 * 
 * Uses shared StatsNotesDataContext instead of duplicate queries
 * Properly memoizes expensive stat calculations
 * 
 * Performance improvements:
 * - Eliminates duplicate habits.list query
 * - Eliminates duplicate getTracking queries (30-day and 7-day)
 * - Uses shared pre-computed date arrays
 * - Memoizes expensive streak calculations
 */

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitStatsData } from './HabitStats.types';
import { useStatsNotesData } from '../StatsNotesDataContext';

export function useHabitStats() {
  const {
    habits,
    tracking30Days,
    tracking7Days,
    last30Days,
    today,
  } = useStatsNotesData();

  const [selectedHabitId, setSelectedHabitId] = useState<Id<'habits'> | null>(
    habits[0]?._id ?? null
  );

  const selectedHabit = useMemo(
    () => habits.find((h) => h._id === selectedHabitId),
    [habits, selectedHabitId]
  );

  const habitStats: HabitStatsData | null = useMemo(() => {
    if (!selectedHabitId) return null;

    const habitTracking30 = tracking30Days.filter(
      (t) => t.habitId === selectedHabitId
    );
    const habitTracking7 = tracking7Days.filter(
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

    const weeklyData = tracking7Days
      .filter((t) => t.habitId === selectedHabitId)
      .map((t) => ({
        completed: t.completed,
        date: t.date,
      }));

    return { completionData, currentStreak, longestStreak, weeklyData };
  }, [selectedHabitId, tracking30Days, tracking7Days, last30Days, today]);

  return {
    habits,
    habitStats,
    selectedHabit,
    selectedHabitId,
    setSelectedHabitId,
  };
}
