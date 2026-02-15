
import { View, Text } from 'react-native';

import { Flame } from 'lucide-react-native';

interface StreakBadgeProps {
  streak: number;
  bestStreak: number;
}

export function StreakBadge({ streak, bestStreak }: StreakBadgeProps) {
  return (
    <View className='items-end'>
      <View className='flex-row items-center rounded-full bg-orange-50 px-3 py-1'>
        <Flame color='#ea580c' size={16} />
        <Text className='ml-1 text-xs font-semibold text-orange-700'>Current streak</Text>
      </View>
      <Text className='mt-2 text-lg font-semibold text-stone-900'>{streak} days</Text>
      <Text className='text-xs text-stone-400'>
        Best {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
      </Text>
    </View>
  );
}
