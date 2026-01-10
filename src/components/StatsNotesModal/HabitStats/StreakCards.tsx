/**
 * Streak display cards for HabitStats
 */

import { Text, View } from 'react-native';

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
          <Text className='text-3xl font-bold text-[#48bb78]'>
            {currentStreak}
          </Text>
          <Text className='text-xl font-semibold text-stone-400'>
            {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
      <View className='flex-1 rounded-2xl bg-stone-50 p-4'>
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
      </View>
    </View>
  );
}
