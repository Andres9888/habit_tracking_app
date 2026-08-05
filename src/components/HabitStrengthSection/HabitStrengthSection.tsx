/**
 * HabitStrengthSection Component
 *
 * - Circular progress ring (tier-colored) with hero microcopy
 * - Full-width timeline chart with bezier curves
 * - Chart-only time range toggle (1M / 3M / 1Y)
 * - Comparison stats row (since start / last month / last week)
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AlgorithmModeChip } from './AlgorithmModeChip';
import { getThemeColors } from './constants';
import { HabitStrengthEmptyState } from './HabitStrengthEmptyState';
import { HabitStrengthLoading } from './HabitStrengthLoading';
import { useHabitStrengthData } from './HabitStrengthSection.hooks';
import { StrengthChart } from './StrengthChart';
import { StrengthHero } from './StrengthHero';
import { StrengthStatsRow } from './StrengthStatsRow';
import { TimeRangeToggle } from './TimeRangeToggle';
import type { HabitStrengthSectionProps } from './types';

export const HabitStrengthSection = React.memo(function HabitStrengthSection({
  completedDates,
  habitCreatedAt,
  habitColor,
  habitStrength,
  strengthAlgorithm,
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
    setTimeRange,
    strengthLabel,
    timeRange,
  } = useHabitStrengthData({
    completedDates,
    habitCreatedAt,
    habitStrength,
    strengthAlgorithm,
  });

  if (isCalculating) {
    return <HabitStrengthLoading />;
  }

  if (isEmpty) {
    return <HabitStrengthEmptyState />;
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
        <View className='mb-3 flex-row items-center justify-between'>
          <Text style={{ ...typography.heading3, color: themeColors.text.primary }}>
            Habit Strength
          </Text>
          <AlgorithmModeChip habitMode={strengthAlgorithm} />
        </View>

        <View className='mb-4'>
          <StrengthHero
            deltaVsMonth={extendedMetrics.deltaVsMonth}
            deltaVsWeek={extendedMetrics.deltaVsWeek}
            label={strengthLabel}
            strength={currentStrength}
          />
        </View>

        <View className='mb-2 flex-row items-center justify-between'>
          <Text
            className='text-xs uppercase'
            style={{ color: themeColors.text.tertiary, letterSpacing: 0.6 }}
          >
            Chart range
          </Text>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
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
