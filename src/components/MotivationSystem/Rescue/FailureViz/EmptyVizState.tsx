/**
 * EmptyVizState Component
 * Shown when no visualization data is available
 * Standardized: FadeInUp animation, proper typography
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyVizState() {
  return (
    <Animated.View className='items-center justify-center py-6' entering={anim(0)}>
      <View className='mb-3 h-12 w-12 items-center justify-center rounded-full bg-rose-100'>
        <AlertTriangle color='#f43f5e' size={24} strokeWidth={1.5} />
      </View>
      <Text className='mb-1 text-center text-[17px] font-semibold text-stone-700'>
        Imagine How You'll Feel If You Skip
      </Text>
      <Text className='text-center text-[13px] text-stone-500'>
        Add failure visualization in the Motivation tab
      </Text>
    </Animated.View>
  );
}
