/**
 * HabitStats Component
 *
 * Displays per-habit statistics including streaks and completion charts
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { useHabitStats } from './useHabitStats';
import { EmptyState } from './EmptyState';
import { HabitSelector } from './HabitSelector';
import { StreakCards } from './StreakCards';
import { WeeklyBarChart } from './WeeklyBarChart';
import { TrendLineChart } from './TrendLineChart';

export default function HabitStats() {
  const { colors: themeColors } = useThemeColors();
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
      <Text
        className='text-lg font-semibold'
        style={{ color: themeColors.text.primary }}
      >
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
          <View
            className='rounded-2xl p-4'
            style={{ backgroundColor: themeColors.surface }}
          >
            <Text
              className='mb-3 text-xs font-semibold uppercase tracking-[2px]'
              style={{ color: themeColors.text.secondary }}
            >
              LAST 7 DAYS
            </Text>
            <WeeklyBarChart data={habitStats.weeklyData} />
          </View>

          {/* 30-day trend line chart */}
          <View
            className='rounded-2xl p-4'
            style={{ backgroundColor: themeColors.surface }}
          >
            <Text
              className='mb-3 text-xs font-semibold uppercase tracking-[2px]'
              style={{ color: themeColors.text.secondary }}
            >
              30-DAY TREND
            </Text>
            <TrendLineChart data={habitStats.completionData} />
          </View>
        </View>
      )}
    </View>
  );
}
