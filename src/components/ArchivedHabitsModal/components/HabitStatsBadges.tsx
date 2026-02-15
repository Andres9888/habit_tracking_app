
import { Text, View } from 'react-native';

import type { ArchivedHabit, StrengthInfo } from '../types';

interface HabitStatsBadgesProps {
  habit: ArchivedHabit;
  strength: number;
  strengthInfo: StrengthInfo;
}

export function HabitStatsBadges({
  habit,
  strength,
  strengthInfo,
}: HabitStatsBadgesProps) {
  return (
    <View className='mb-3 flex-row flex-wrap gap-2'>
      {/* Strength Badge */}
      <View
        className={`flex-row items-center gap-1.5 rounded-lg px-2.5 py-1 ${strengthInfo.bgColor}`}
      >
        <Text className='text-sm'>{strengthInfo.emoji}</Text>
        <Text className={`text-xs font-semibold ${strengthInfo.textColor}`}>
          {Math.round(strength)}% {strengthInfo.label}
        </Text>
      </View>

      {/* Streak Badge */}
      {(habit.currentStreak ?? 0) > 0 ? (
        <View className='flex-row items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1'>
          <Text className='text-sm'>🔥</Text>
          <Text className='text-xs font-semibold text-amber-700'>
            {habit.currentStreak} day streak
          </Text>
        </View>
      ) : (
        <View className='flex-row items-center gap-1.5 rounded-lg bg-stone-100 px-2.5 py-1'>
          <Text className='text-sm'>🔥</Text>
          <Text className='text-xs font-semibold text-stone-500'>
            No streak
          </Text>
        </View>
      )}

      {/* Total Completions Badge */}
      {(habit.totalCompletions ?? 0) > 0 && (
        <View className='flex-row items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1'>
          <Text className='text-xs font-bold text-blue-600'>✓</Text>
          <Text className='text-xs font-semibold text-blue-700'>
            {habit.totalCompletions} total
          </Text>
        </View>
      )}
    </View>
  );
}
