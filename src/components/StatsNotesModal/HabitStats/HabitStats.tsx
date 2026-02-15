/**
 * HabitStats Component
 *
 * Displays per-habit statistics including streaks and completion charts
 */

import { Text, View } from 'react-native';

import { EmptyState } from './EmptyState';
import { HabitSelector } from './HabitSelector';
import { StreakCards } from './StreakCards';
import { TrendLineChart } from './TrendLineChart';
import { WeeklyBarChart } from './WeeklyBarChart';
import { useHabitStats } from './useHabitStats';

export default function HabitStats() {
  const {
    habits,
    selectedHabitId,
    setSelectedHabitId,
    selectedHabit,
    habitStats,
  } = useHabitStats();

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <View className='gap-4'>
      <Text className='text-lg font-semibold text-stone-900'>
        Per-Habit Stats
      </Text>

      <HabitSelector
        habits={habits}
        selectedHabitId={selectedHabitId}
        onSelect={setSelectedHabitId}
      />

      {selectedHabit && habitStats && (
        <View className='gap-4'>
          <StreakCards
            currentStreak={habitStats.currentStreak}
            longestStreak={habitStats.longestStreak}
          />

          {/* Weekly bar chart */}
          <View className='rounded-2xl bg-stone-50 p-4'>
            <Text className='mb-3 text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
              LAST 7 DAYS
            </Text>
            <WeeklyBarChart data={habitStats.weeklyData} />
          </View>

          {/* 30-day trend line chart */}
          <View className='rounded-2xl bg-stone-50 p-4'>
            <Text className='mb-3 text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
              30-DAY TREND
            </Text>
            <TrendLineChart data={habitStats.completionData} />
          </View>
        </View>
      )}
    </View>
  );
}
