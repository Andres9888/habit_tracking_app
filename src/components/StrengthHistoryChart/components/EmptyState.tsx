/**
 * EmptyState - Displayed when not enough data is available
 * Standardized: FadeInUp animation, icon, proper typography
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Activity } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface EmptyStateProps {
  height: number;
}

export function EmptyState({ height }: EmptyStateProps) {
  return (
    <View
      className='items-center justify-center rounded-xl bg-stone-50 px-6'
      style={{ height }}
    >
      <Animated.View
        className='mb-3 h-12 w-12 items-center justify-center rounded-xl bg-violet-100'
        entering={anim(0)}
      >
        <Activity color='#8b5cf6' size={24} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        className='mb-1 text-center font-semibold text-stone-700'
        entering={anim(60)}
        style={{ fontSize: 17 }}
      >
        Not Enough Data Yet
      </Animated.Text>
      <Animated.Text
        className='text-center text-[13px] text-stone-500'
        entering={anim(120)}
      >
        Keep tracking to see your progress
      </Animated.Text>
    </View>
  );
}
