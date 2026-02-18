import { useQuery } from 'convex/react';
import { format, startOfDay, subDays } from 'date-fns';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';

export function useStatsOverviewData() {
  const habitsData = useQuery(api.habits.list);
  const habits = habitsData ?? [];
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayString = format(today, 'yyyy-MM-dd');

  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        format(subDays(today, i), 'yyyy-MM-dd')
      ),
    [today]
  );

  const trackingData = useQuery(api.habits.getTracking, { dates: last7Days });
  const tracking = trackingData ?? [];
  const todayTrackingData =
    useQuery(api.habits.getTracking, { dates: [todayString] });
  const todayTracking = todayTrackingData ?? [];
  
  const isLoading = habitsData === undefined || trackingData === undefined || todayTrackingData === undefined;

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
    isLoading,
    longestStreak,
    todayCompleted,
    totalHabits: habits.length,
    weeklyCompletionPercent,
  };
}
