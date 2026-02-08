/**
 * HabitStrengthContent Component
 * Renders the main content of the habit strength section.
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { shadows } from '../../theme/spacing';
import { COLORS } from './constants';
import { StrengthChart } from './StrengthChart';
import { StrengthHero } from './StrengthHero';
import { TimeRangeToggle } from './TimeRangeToggle';
import type { TimeRange } from './types';

export interface HabitStrengthContentProps {
  chartData: Array<{ date: string; strength: number }>;
  currentStrength: number;
  delta: number;
  habitColor?: string;
  strengthLabel: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function HabitStrengthContent({
  chartData,
  currentStrength,
  delta,
  habitColor,
  strengthLabel,
  timeRange,
  onTimeRangeChange,
}: HabitStrengthContentProps) {
  return (
    <Animated.View
      className='overflow-hidden rounded-2xl bg-white shadow-sm'
      entering={FadeInDown.delay(100).springify().damping(18)}
      style={{
        ...shadows.card,
        shadowColor: COLORS.textPrimary,
        shadowOpacity: 0.05,
      }}
    >
      <View className='p-4'>
        <View className='mb-3 flex-row items-center justify-between'>
          <Text className='text-base font-bold text-stone-800'>
            Habit Strength
          </Text>
          <TimeRangeToggle value={timeRange} onChange={onTimeRangeChange} />
        </View>

        <View className='mb-3'>
          <StrengthHero
            color={habitColor}
            delta={delta}
            deltaLabel='vs last month'
            label={strengthLabel}
            strength={currentStrength}
          />
        </View>

        <View className='-mx-4 mb-3'>
          <StrengthChart
            color={habitColor}
            currentStrength={currentStrength}
            data={chartData}
            timeRange={timeRange}
          />
        </View>
      </View>
    </Animated.View>
  );
}
