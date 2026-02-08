/**
 * EmptyVizState - Shown when no visualization data is available
 * Standardized: FadeInUp animation, proper typography
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, AlertTriangle } from 'lucide-react-native';
import { clsx } from 'clsx';
import Animated, { FadeInUp } from 'react-native-reanimated';

import type { VizType } from './types';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface EmptyVizStateProps {
  type: VizType;
  compact: boolean;
}

export function EmptyVizState({ type, compact }: EmptyVizStateProps) {
  const isSuccess = type === 'success';

  if (compact) {
    return (
      <Animated.View className='items-center justify-center py-4' entering={anim(0)}>
        <Text
          className={clsx(
            'text-center text-[13px] italic',
            isSuccess ? 'text-emerald-500' : 'text-rose-500'
          )}
        >
          {isSuccess
            ? 'Set up success visualization in the Motivation tab'
            : 'Set up failure visualization in the Motivation tab'}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View className='items-center justify-center py-6' entering={anim(0)}>
      <View
        className={clsx(
          'mb-3 h-12 w-12 items-center justify-center rounded-full',
          isSuccess ? 'bg-emerald-100' : 'bg-rose-100'
        )}
      >
        {isSuccess ? (
          <Sparkles color='#10b981' size={24} strokeWidth={1.5} />
        ) : (
          <AlertTriangle color='#f43f5e' size={24} strokeWidth={1.5} />
        )}
      </View>
      <Text className='mb-1 text-center text-[17px] font-semibold text-stone-700'>
        No Visualization Set Up Yet
      </Text>
      <Text className='text-center text-[13px] text-stone-500'>
        Add it in the Motivation tab to see it here
      </Text>
    </Animated.View>
  );
}
