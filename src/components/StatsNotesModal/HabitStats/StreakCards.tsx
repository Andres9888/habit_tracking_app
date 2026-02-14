/**
 * Streak display cards for HabitStats
 */

import { Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface StreakCardsProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCards({
  currentStreak,
  longestStreak,
}: StreakCardsProps) {
  return (
    <View className='flex-row gap-3'>
      <View className='flex-1 rounded-2xl bg-stone-50 p-4'>
        <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
          CURRENT STREAK
        </Text>
        <View className='mt-2 flex-row items-baseline gap-2'>
          <Text
            className='text-3xl font-bold'
            style={{ color: colors.streak[500] }}
          >
            {currentStreak}
          </Text>
          <Text className='text-xl font-semibold text-stone-500'>
            {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
      <View className='flex-1 rounded-2xl bg-stone-50 p-4'>
        <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
          LONGEST STREAK
        </Text>
        <View className='mt-2 flex-row items-baseline gap-2'>
          <Text
            className='text-3xl font-bold'
            style={{ color: colors.streak[500] }}
          >
            {longestStreak}
          </Text>
          <Text className='text-xl font-semibold text-stone-500'>
            {longestStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
    </View>
  );
}
