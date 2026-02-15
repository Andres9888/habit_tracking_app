/**
 * Streak display cards for HabitStats
 */

import { Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';

interface StreakCardsProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCards({
  currentStreak,
  longestStreak,
}: StreakCardsProps) {
  const { colors: themeColors } = useThemeColors();
  return (
    <View className='flex-row gap-3'>
      <View className='flex-1 rounded-2xl p-4' style={{ backgroundColor: themeColors.gray[50] }}>
        <Text className='text-xs font-semibold uppercase tracking-[2px]' style={{ color: themeColors.text.tertiary }}>
          CURRENT STREAK
        </Text>
        <View className='mt-2 flex-row items-baseline gap-2'>
          <Text
            className='text-3xl font-bold'
            style={{ color: colors.streak[500] }}
          >
            {currentStreak}
          </Text>
          <Text className='text-xl font-semibold' style={{ color: themeColors.text.tertiary }}>
            {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
      <View className='flex-1 rounded-2xl p-4' style={{ backgroundColor: themeColors.gray[50] }}>
        <Text className='text-xs font-semibold uppercase tracking-[2px]' style={{ color: themeColors.text.tertiary }}>
          LONGEST STREAK
        </Text>
        <View className='mt-2 flex-row items-baseline gap-2'>
          <Text
            className='text-3xl font-bold'
            style={{ color: colors.streak[500] }}
          >
            {longestStreak}
          </Text>
          <Text className='text-xl font-semibold' style={{ color: themeColors.text.tertiary }}>
            {longestStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
    </View>
  );
}
