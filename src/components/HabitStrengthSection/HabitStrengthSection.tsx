/**
 * HabitStrengthSection Component (Redesigned)
 *
 * Comprehensive habit strength display combining:
 * - Time range switcher (1M/1Y/All)
 * - Circular progress ring with animated fill
 * - Full-width timeline chart with bezier curves
 * - Comparison stats row
 */

import React from 'react';
import { Text, View } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import type { HabitStrengthSectionProps } from './types';
import { COLORS } from './constants';
import { StrengthChart } from './StrengthChart';
import { StrengthHero } from './StrengthHero';
import { StrengthStatsRow } from './StrengthStatsRow';
import { TimeRangeToggle } from './TimeRangeToggle';
import { shadows } from '../../theme/spacing';
import { useHabitStrengthData } from './HabitStrengthSection.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export const HabitStrengthSection = React.memo(function HabitStrengthSection({
  completedDates,
  habitCreatedAt,
  habitColor,
  habitStrength,
}: HabitStrengthSectionProps) {
  const reduceMotion = useReduceMotion();
  const {
    chartData,
    currentStrength,
    extendedMetrics,
    isCalculating,
    isEmpty,
    setTimeRange,
    strengthLabel,
    timeRange,
  } = useHabitStrengthData({ completedDates, habitCreatedAt, habitStrength });

  if (isCalculating) {
    return (
      <View className='rounded-2xl bg-white p-5 shadow-sm'>
        <View className='h-48 items-center justify-center'>
          <Text className='text-stone-400'>Calculating strength...</Text>
        </View>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className='rounded-2xl bg-white p-5 shadow-sm'>
        <Text className='mb-2 text-lg font-bold text-stone-800'>
          Habit Strength
        </Text>
        <View className='items-center justify-center py-8'>
          <Text className='mb-2 text-4xl'>🌱</Text>
          <Text className='text-center text-stone-500'>
            Complete your first day to start building strength!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl bg-white shadow-sm'
      entering={reduceMotion ? undefined : FadeInDown.delay(100).springify().damping(18)}
      style={{
        ...shadows.card,
        shadowColor: COLORS.textPrimary,
        shadowOpacity: 0.05,
      }}
    >
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text className='text-lg font-bold text-stone-800'>
            Habit Strength
          </Text>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </View>

        <View className='mb-4'>
          <StrengthHero
            color={habitColor}
            delta={extendedMetrics.deltaVsMonth}
            deltaLabel='vs last month'
            label={strengthLabel}
            strength={currentStrength}
          />
        </View>

        <View className='-mx-5 mb-4'>
          <StrengthChart
            color={habitColor}
            currentStrength={currentStrength}
            data={chartData}
            timeRange={timeRange}
          />
        </View>

        <StrengthStatsRow
          lastMonth={extendedMetrics.deltaVsMonth}
          lastWeek={extendedMetrics.deltaVsWeek}
          sinceStart={extendedMetrics.sinceStart}
        />
      </View>
    </Animated.View>
  );
});

export default HabitStrengthSection;
