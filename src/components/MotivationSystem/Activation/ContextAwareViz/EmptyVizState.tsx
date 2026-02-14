/**
 * EmptyVizState - Shown when no visualization data is available
 * Polished: spring entrance animations, proper color props, dark mode
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
      <Animated.View
        className='items-center justify-center py-4'
        entering={anim(0)}
      >
        <Text
          className={clsx(
            'text-center text-[13px] italic',
            isSuccess
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-rose-500 dark:text-rose-400'
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
    <View className='items-center justify-center py-6'>
      <Animated.View
        className={clsx(
          'mb-3 h-12 w-12 items-center justify-center rounded-xl',
          isSuccess
            ? 'bg-emerald-50 dark:bg-emerald-900/30'
            : 'bg-rose-50 dark:bg-rose-900/30'
        )}
        entering={anim(0)}
      >
        {isSuccess ? (
          <Sparkles color='#059669' size={24} strokeWidth={1.5} />
        ) : (
          <AlertTriangle color='#f43f5e' size={24} strokeWidth={1.5} />
        )}
      </Animated.View>
      <Animated.Text
        className='mb-1 text-center text-[15px] font-semibold text-stone-700 dark:text-stone-200'
        entering={anim(60)}
      >
        No visualization set up yet
      </Animated.Text>
      <Animated.Text
        className='text-center text-[13px] text-stone-400 dark:text-stone-500'
        entering={anim(120)}
      >
        Add it in the Motivation tab to see it here
      </Animated.Text>
    </View>
  );
}
