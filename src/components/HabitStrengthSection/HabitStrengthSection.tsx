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
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { shadows, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import { getThemeColors } from './constants';
import { useHabitStrengthData } from './HabitStrengthSection.hooks';
import { StrengthChart } from './StrengthChart';
import { StrengthHero } from './StrengthHero';
import { StrengthMilestoneStat } from './StrengthMilestoneStat';
import { TimeRangeToggle } from './TimeRangeToggle';
import type { HabitStrengthSectionProps } from './types';

export const HabitStrengthSection = React.memo(function HabitStrengthSection({
  completedDates,
  habitCreatedAt,
  habitColor,
  habitStrength,
}: HabitStrengthSectionProps) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);
  const reduceMotion = useReduceMotion();
  const {
    chartData,
    currentStrength,
    extendedMetrics,
    isCalculating,
    isEmpty,
    milestoneStats,
    setTimeRange,
    strengthLabel,
    timeRange,
  } = useHabitStrengthData({ completedDates, habitCreatedAt, habitStrength });

  if (isCalculating) {
    return (
      <View
        accessible
        accessibilityLabel='Calculating habit strength'
        accessibilityRole='progressbar'
        className='rounded-2xl p-5 shadow-sm'
        style={{ backgroundColor: themeColors.card }}
      >
        <View className='mb-4 flex-row items-center justify-between'>
          <SkeletonLoader borderRadius={6} height={20} reduceMotion={reduceMotion} width={140} />
          <SkeletonLoader borderRadius={999} height={28} reduceMotion={reduceMotion} width={120} />
        </View>
        <View className='mb-5 flex-row items-end gap-3'>
          <SkeletonLoader borderRadius={8} height={44} reduceMotion={reduceMotion} width={120} />
          <SkeletonLoader borderRadius={6} height={14} reduceMotion={reduceMotion} width={80} />
        </View>
        <SkeletonLoader borderRadius={12} height={120} reduceMotion={reduceMotion} />
        <View className='mt-4'>
          <SkeletonLoader borderRadius={14} height={66} reduceMotion={reduceMotion} width='100%' />
        </View>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className='rounded-2xl p-5 shadow-sm' style={{ backgroundColor: themeColors.card }}>
        <Text style={{ ...typography.heading3, marginBottom: spacing.sm, color: themeColors.text.primary }}>
          Habit Strength
        </Text>
        <View
          className='items-center rounded-2xl px-6 py-8'
          style={{
            backgroundColor: themeColors.background,
            borderColor: themeColors.border,
            borderStyle: 'dashed',
            borderWidth: 1,
          }}
        >
          <View
            className='mb-3 h-14 w-14 items-center justify-center rounded-full'
            style={{ backgroundColor: themeColors.card }}
          >
            <Text className='text-3xl'>🌱</Text>
          </View>
          <Text style={{ ...typography.heading3, color: themeColors.text.primary, textAlign: 'center' }}>
            Not enough data yet
          </Text>
          <Text
            className='mt-1 text-center'
            style={{ color: themeColors.text.secondary, maxWidth: 260 }}
          >
            Complete your first day to start building strength.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl shadow-sm'
      entering={reduceMotion ? undefined : FadeInDown.duration(durations.enter).delay(100).easing(Easing.out(Easing.cubic))}
      style={{
        ...shadows.card,
        backgroundColor: themeColors.card,
        shadowColor: sectionColors.textPrimary,
        shadowOpacity: 0.05,
      }}
    >
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text style={{ ...typography.heading3, color: themeColors.text.primary }}>
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

        <StrengthMilestoneStat
          color={habitColor}
          daysTracked={milestoneStats.daysTracked}
          longestStreak={milestoneStats.longestStreak}
          totalCompletions={milestoneStats.totalCompletions}
        />
      </View>
    </Animated.View>
  );
});

export default HabitStrengthSection;
