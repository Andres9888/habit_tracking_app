import { useQuery } from 'convex/react';
import { format, startOfDay, subDays } from 'date-fns';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';

export function useStatsOverviewData() {
  const habits = useQuery(api.habits.list) ?? [];
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayString = format(today, 'yyyy-MM-dd');

  const range7 = useMemo(
    () => ({
      startDate: format(subDays(today, 6), 'yyyy-MM-dd'),
      endDate: todayString,
    }),
    [today, todayString]
  );

  const tracking = useQuery(api.habits.getTracking, range7) ?? [];
  const todayTracking =
    useQuery(api.habits.getTracking, { startDate: todayString, endDate: todayString }) ?? [];

  const todayCompleted = useMemo(
    () => todayTracking.filter((t) => t.completed).length,
    [todayTracking]
  );

  const weeklyCompletionPercent = useMemo(() => {
    const possibleCompletions = habits.length * 7;
    if (possibleCompletions === 0) return 0;
    const actualCompletions = tracking.filter((t) => t.completed).length;
    return Math.round((actualCompletions / possibleCompletions) * 100);
  }, [tracking, habits.length]);

  const longestStreak = useMemo(() => {
    let maxStreak = 0;

    for (const habit of habits) {
      const habitTracking = tracking.filter((t) => t.habitId === habit._id);
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
  }, [habits, tracking, today]);

  return {
    activeHabits: habits.length,
    longestStreak,
    todayCompleted,
    totalHabits: habits.length,
    weeklyCompletionPercent,
  };
}
