import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { StatCardProps } from '../types';

export function StatCard({ emoji, value, label }: StatCardProps) {
  return (
    <Animated.View
      className='flex-1 flex-col items-center gap-1 rounded-2xl border border-stone-100 bg-white px-4 py-4'
      entering={FadeInDown.duration(500)}
    >
      <Text className='text-2xl leading-8'>{emoji}</Text>
      <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
        {value}
      </Text>
      <Text className='text-center text-xs font-normal leading-4 text-[#6a7282]'>
        {label}
      </Text>
    </Animated.View>
  );
}
