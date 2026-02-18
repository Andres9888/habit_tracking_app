import { ActivityIndicator, Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
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
    isLoading,
  } = useStatsOverviewData();
  const { colors } = useThemeColors();
  
  if (isLoading) {
    return (
      <View className='items-center justify-center py-12'>
        <ActivityIndicator color={colors.accent} size='large' />
      </View>
    );
  }

  return (
    <View className='gap-8'>
      <View className='gap-4'>
        <Text className='text-lg font-semibold' style={{ color: colors.text.primary }}>Overview</Text>

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
            valueColor={colors.text.primary}
          />
        </View>
      </View>

      <View className='h-px' style={{ backgroundColor: colors.border }} />
      <HabitStats />
    </View>
  );
}
