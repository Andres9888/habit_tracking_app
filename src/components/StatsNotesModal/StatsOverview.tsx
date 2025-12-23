import { useQuery } from 'convex/react';
import { format, startOfDay, subDays } from 'date-fns';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { api } from '../../../convex/_generated/api';
import HabitStats from './HabitStats';

export default function StatsOverview() {
  const habits = useQuery(api.habits.list) ?? [];

  const today = useMemo(() => startOfDay(new Date()), []);
  const todayString = format(today, 'yyyy-MM-dd');

  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        format(subDays(today, i), 'yyyy-MM-dd')
      ),
    [today]
  );

  const tracking = useQuery(api.habits.getTracking, { dates: last7Days }) ?? [];
  const todayTracking =
    useQuery(api.habits.getTracking, {
      dates: [todayString],
    }) ?? [];

  // Today's completion
  const todayCompleted = useMemo(
    () => todayTracking.filter((t) => t.completed).length,
    [todayTracking]
  );

  const totalHabits = habits.length;

  // Weekly completion %
  const weeklyCompletionPercent = useMemo(() => {
    const possibleCompletions = habits.length * 7;
    if (possibleCompletions === 0) return 0;
    const actualCompletions = tracking.filter((t) => t.completed).length;
    return Math.round((actualCompletions / possibleCompletions) * 100);
  }, [tracking, habits.length]);

  // Longest streak across all habits
  const longestStreak = useMemo(() => {
    let maxStreak = 0;

    for (const habit of habits) {
      const habitTracking = tracking.filter((t) => t.habitId === habit._id);
      const completedDates = new Set(
        habitTracking.filter((t) => t.completed).map((t) => t.date)
      );

      const currentDate = new Date(today);
      let streak = 0;

      // Count consecutive days backward from today
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

  const activeHabits = habits.length;

  return (
    <View className='gap-8'>
      {/* Overview Section */}
      <View className='gap-4'>
        <Text className='text-lg font-semibold text-stone-900'>Overview</Text>

        <View className='gap-3'>
          {/* Today's completion */}
          <View className='rounded-2xl bg-stone-50 p-4'>
            <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
              TODAY
            </Text>
            <View className='mt-2 flex-row items-baseline gap-2'>
              <Text className='text-3xl font-bold text-[#48bb78]'>
                {todayCompleted}
              </Text>
              <Text className='text-xl font-semibold text-stone-400'>
                / {totalHabits}
              </Text>
            </View>
            <Text className='mt-1 text-sm text-stone-600'>
              Habits completed today
            </Text>
          </View>

          {/* Weekly completion */}
          <View className='rounded-2xl bg-stone-50 p-4'>
            <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
              THIS WEEK
            </Text>
            <View className='mt-2 flex-row items-baseline gap-2'>
              <Text className='text-3xl font-bold text-[#48bb78]'>
                {weeklyCompletionPercent}%
              </Text>
            </View>
            <Text className='mt-1 text-sm text-stone-600'>
              Completion rate (last 7 days)
            </Text>
          </View>

          {/* Longest streak */}
          <View className='rounded-2xl bg-stone-50 p-4'>
            <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
              LONGEST STREAK
            </Text>
            <View className='mt-2 flex-row items-baseline gap-2'>
              <Text className='text-3xl font-bold text-[#48bb78]'>
                {longestStreak}
              </Text>
              <Text className='text-xl font-semibold text-stone-400'>
                {longestStreak === 1 ? 'day' : 'days'}
              </Text>
            </View>
            <Text className='mt-1 text-sm text-stone-600'>
              Across all habits
            </Text>
          </View>

          {/* Active habits */}
          <View className='rounded-2xl bg-stone-50 p-4'>
            <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
              ACTIVE HABITS
            </Text>
            <View className='mt-2'>
              <Text className='text-3xl font-bold text-stone-900'>
                {activeHabits}
              </Text>
            </View>
            <Text className='mt-1 text-sm text-stone-600'>
              Currently tracking
            </Text>
          </View>
        </View>
      </View>

      {/* Separator */}
      <View className='h-px bg-stone-200' />

      {/* Per-Habit Stats Section */}
      <HabitStats />
    </View>
  );
}
