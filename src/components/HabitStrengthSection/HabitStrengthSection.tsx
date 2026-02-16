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

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useThemeColors } from '../../theme';
import { shadows } from '../../theme/spacing';
import { COLORS } from './constants';
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
}: HabitStrengthSectionProps) {
  const reduceMotion = useReduceMotion();
  const { colors: themeColors, isDark } = useThemeColors();
  const cardBg = isDark ? themeColors.card : '#ffffff';
  const textPrimary = isDark ? themeColors.text.primary : '#1c1917';
  const textMuted = isDark ? themeColors.text.tertiary : '#a8a29e';
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
      <View className='rounded-2xl p-5 shadow-sm' style={{ backgroundColor: cardBg }}>
        <View className='h-48 items-center justify-center'>
          <Text style={{ color: textMuted }}>Calculating strength...</Text>
        </View>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className='rounded-2xl p-5 shadow-sm' style={{ backgroundColor: cardBg }}>
        <Text className='mb-2 text-lg font-bold' style={{ color: textPrimary }}>
          Habit Strength
        </Text>
        <View className='items-center justify-center py-8'>
          <Text className='mb-2 text-4xl'>🌱</Text>
          <Text className='text-center' style={{ color: textMuted }}>
            Complete your first day to start building strength!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl shadow-sm'
      entering={reduceMotion ? undefined : FadeInDown.delay(100).springify().damping(18)}
      style={{
        ...shadows.card,
        backgroundColor: cardBg,
        shadowColor: COLORS.textPrimary,
        shadowOpacity: isDark ? 0.3 : 0.05,
      }}
    >
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text className='text-lg font-bold' style={{ color: textPrimary }}>
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
