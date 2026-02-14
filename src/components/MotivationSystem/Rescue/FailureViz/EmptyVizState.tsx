/**
 * EmptyVizState Component
 * Shown when no failure visualization data is available
 * Polished: spring entrance animation, proper color props, dark mode
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyVizState() {
  return (
    <View className='items-center justify-center py-6'>
      <Animated.View
        className='mb-3 h-12 w-12 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/30'
        entering={anim(0)}
      >
        <AlertTriangle color='#f43f5e' size={24} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        className='mb-1 text-center text-[15px] font-semibold text-stone-700 dark:text-stone-200'
        entering={anim(60)}
      >
        Imagine how you'll feel if you skip
      </Animated.Text>
      <Animated.Text
        className='text-center text-[13px] text-stone-400 dark:text-stone-500'
        entering={anim(120)}
      >
        Add failure visualization in the Motivation tab
      </Animated.Text>
    </View>
  );
}
