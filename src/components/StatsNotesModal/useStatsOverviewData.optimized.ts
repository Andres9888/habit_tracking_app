/**
 * OPTIMIZED: useStatsOverviewData
 * 
 * Eliminates duplicate queries by using shared StatsNotesDataContext
 * Adds memoization for expensive longestStreak calculation
 * 
 * Performance improvements:
 * - No duplicate habits.list query
 * - No duplicate getTracking queries
 * - Expensive calculations properly memoized
 * - Client-side filtering from shared data
 */

import { useMemo } from 'react';
import { format } from 'date-fns';
import { useStatsNotesData } from './StatsNotesDataContext';

export function useStatsOverviewData() {
  const {
    habits,
    tracking7Days,
    trackingToday,
    today,
  } = useStatsNotesData();

  const todayCompleted = useMemo(
    () => trackingToday.filter((t) => t.completed).length,
    [trackingToday]
  );

  const weeklyCompletionPercent = useMemo(() => {
    const possibleCompletions = habits.length * 7;
    if (possibleCompletions === 0) return 0;
    const actualCompletions = tracking7Days.filter((t) => t.completed).length;
    return Math.round((actualCompletions / possibleCompletions) * 100);
  }, [tracking7Days, habits.length]);

  // Memoized expensive longest streak calculation
  const longestStreak = useMemo(() => {
    let maxStreak = 0;

    for (const habit of habits) {
      const habitTracking = tracking7Days.filter((t) => t.habitId === habit._id);
      const completedDates = new Set(
        habitTracking.filter((t) => t.completed).map((t) => t.date)
      );

      const currentDate = new Date(today);
      let streak = 0;

      while (true) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        if (completedDates.has(dateString)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      maxStreak = Math.max(maxStreak, streak);
    }

    return maxStreak;
  }, [habits, tracking7Days, today]); // Only recalculate when data changes

  return {
    activeHabits: habits.length,
    longestStreak,
    todayCompleted,
    totalHabits: habits.length,
    weeklyCompletionPercent,
  };
}
