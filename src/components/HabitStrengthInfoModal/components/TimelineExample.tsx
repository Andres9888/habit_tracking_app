/**
 * TimelineExample Component
 *
 * Shows the timeline to reach 100% strength.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface TimelineExampleProps {
  delay: number;
}

export function TimelineExample({ delay }: TimelineExampleProps) {
  return (
    <Animated.View
      className='rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4'
      entering={FadeInDown.delay(delay).duration(400)}
    >
      <View className='mb-3 flex-row items-center gap-2'>
        <Ionicons color='#D97706' name='time-outline' size={18} />
        <Text className='text-sm font-semibold text-amber-700'>
          Timeline to 100%
        </Text>
      </View>
      <View className='gap-1'>
        <View className='flex-row justify-between'>
          <Text className='text-xs text-stone-600'>7 days perfect</Text>
          <Text className='text-xs font-medium text-stone-800'>~30%</Text>
        </View>
        <View className='flex-row justify-between'>
          <Text className='text-xs text-stone-600'>30 days perfect</Text>
          <Text className='text-xs font-medium text-stone-800'>~78%</Text>
        </View>
        <View className='flex-row justify-between'>
          <Text className='text-xs text-stone-600'>60 days perfect</Text>
          <Text className='text-xs font-medium text-stone-800'>~95%</Text>
        </View>
        <View className='flex-row justify-between'>
          <Text className='text-xs text-stone-600'>90 days perfect</Text>
          <Text className='text-xs font-medium text-stone-800'>~99%</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default TimelineExample;
