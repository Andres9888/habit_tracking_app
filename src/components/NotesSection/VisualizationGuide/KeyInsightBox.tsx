/**
 * Key insight box component for VisualizationGuide
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';

export function KeyInsightBox() {
  return (
    <Animated.View
      className='flex-row items-start gap-3 rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-yellow-50 p-4'
      entering={FadeInDown.delay(100).springify().damping(18)}
    >
      <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
        <Zap className='text-amber-600' size={20} />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-bold text-amber-900'>
          🧠 The Key Insight
        </Text>
        <Text className='mt-1 text-sm leading-relaxed text-amber-800'>
          Visualizing <Text className='font-semibold'>the process</Text>{' '}
          activates goal-pursuit neural circuits. Visualizing{' '}
          <Text className='font-semibold'>only the outcome</Text> can actually{' '}
          <Text className='italic'>reduce</Text> your motivation.
        </Text>
      </View>
    </Animated.View>
  );
}
