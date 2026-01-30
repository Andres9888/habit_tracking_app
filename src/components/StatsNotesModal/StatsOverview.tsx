import { Text, View } from 'react-native';
import HabitStats from './HabitStats';
import { StatCard } from './StatCard';
import { useStatsOverviewData } from './useStatsOverviewData';

export default function StatsOverview() {
  const {
    todayCompleted,
    totalHabits,
    weeklyCompletionPercent,
    longestStreak,
    activeHabits,
  } = useStatsOverviewData();

  return (
    <View className='gap-8'>
      <View className='gap-4'>
        <Text className='text-lg font-semibold text-stone-900'>Overview</Text>

        <View className='gap-3'>
          <StatCard
            description='Habits completed today'
            label='TODAY'
            suffix={`/ ${totalHabits}`}
            value={todayCompleted}
          />
          <StatCard
            description='Completion rate (last 7 days)'
            label='THIS WEEK'
            value={`${weeklyCompletionPercent}%`}
          />
          <StatCard
            description='Across all habits'
            label='LONGEST STREAK'
            suffix={longestStreak === 1 ? 'day' : 'days'}
            value={longestStreak}
          />
          <StatCard
            description='Currently tracking'
            label='ACTIVE HABITS'
            value={activeHabits}
            valueColor='#1c1917'
          />
        </View>
      </View>

      <View className='h-px bg-stone-200' />
      <HabitStats />
    </View>
  );
}
