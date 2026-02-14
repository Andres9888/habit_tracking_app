/**
 * Empty state components for StrengthTimelineChart
 * Polished: spring entrance animations, Lucide icons, premium feel
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, Loader } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface EmptyStateProps {
  height: number;
}

export function NoDataState({ height }: EmptyStateProps) {
  return (
    <Animated.View
      accessible
      accessibilityLabel='Strength timeline chart - No data available yet'
      className='items-center justify-center rounded-2xl bg-stone-50 px-6 dark:bg-stone-800'
      entering={anim(0)}
      style={{
        height,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <Animated.View
        className='mb-3 h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30'
        entering={anim(0)}
      >
        <TrendingUp color='#059669' size={24} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        className='mb-1 text-center text-[15px] font-semibold text-stone-700 dark:text-stone-200'
        entering={anim(60)}
      >
        Building Your History
      </Animated.Text>
      <Animated.Text
        className='text-center text-[13px] text-stone-400 dark:text-stone-500'
        entering={anim(120)}
      >
        Your strength chart is on its way
      </Animated.Text>
    </Animated.View>
  );
}

export function BuildingHistoryState({ height }: EmptyStateProps) {
  return (
    <Animated.View
      accessible
      accessibilityLabel='Strength timeline chart - Building history'
      className='items-center justify-center rounded-2xl bg-stone-50 px-6 dark:bg-stone-800'
      entering={anim(0)}
      style={{
        height,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <Animated.View
        className='mb-3 h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/30'
        entering={anim(0)}
      >
        <Loader color='#d97706' size={24} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        className='mb-1 text-center text-[15px] font-semibold text-stone-700 dark:text-stone-200'
        entering={anim(60)}
      >
        Almost There
      </Animated.Text>
      <Animated.Text
        className='text-center text-[13px] leading-[18px] text-stone-400 dark:text-stone-500'
        entering={anim(120)}
        style={{ maxWidth: 240 }}
      >
        Keep going — your strength chart appears after a week of tracking
      </Animated.Text>
    </Animated.View>
  );
}
