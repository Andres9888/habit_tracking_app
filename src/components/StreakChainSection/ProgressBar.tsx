/**
 * ProgressBar Component
 * Shows progress toward next streak tier milestone
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { TierConfig } from './types';

interface ProgressBarProps {
  next: TierConfig;
  daysToNext: number;
  barAnimatedStyle: object;
}

export function ProgressBar({
  next,
  daysToNext,
  barAnimatedStyle,
}: ProgressBarProps) {
  return (
    <View className='mb-4 px-2'>
      <View className='mb-1.5 flex-row items-center justify-between'>
        <Text className='text-xs font-medium text-stone-600'>
          Progress to {next.icon} Day {next.days}
        </Text>
        <Text className='text-xs font-bold text-orange-600'>
          {daysToNext} {daysToNext === 1 ? 'day' : 'days'}
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel={`${daysToNext} ${daysToNext === 1 ? 'day' : 'days'} until ${next.days}-day milestone`}
        accessibilityRole="progressbar"
        className='h-2 overflow-hidden rounded-full bg-stone-100'
      >
        <Animated.View
          className={`h-full rounded-full ${next.barColor}`}
          style={barAnimatedStyle}
        />
      </View>
    </View>
  );
}
