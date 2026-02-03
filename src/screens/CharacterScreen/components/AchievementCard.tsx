import { View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <Animated.View
      className='flex-row items-center gap-4 rounded-3xl border border-stone-100 bg-white px-6 py-6 dark:border-stone-700 dark:bg-stone-800'
      entering={FadeInDown.duration(600)}
    >
      <View className='h-12 w-12 items-center justify-center rounded-full bg-orange-100 shadow-sm dark:bg-orange-900/30'>
        <Trophy className='text-amber-500 dark:text-amber-400' size={24} />
      </View>
      <View className='flex-1 flex-col'>
        <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-stone-900 dark:text-stone-100'>
          {achievement.title}
        </Text>
        <Text className='text-sm font-normal leading-5 tracking-[-0.15px] text-stone-500 dark:text-stone-400'>
          {achievement.description}
        </Text>
      </View>
      <Text className='text-2xl'>{achievement.icon}</Text>
    </Animated.View>
  );
}
