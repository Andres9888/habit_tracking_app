/**
 * HabitStrengthSection Component (Redesigned)
 *
 * Comprehensive habit strength display combining:
 * - Time range switcher (1M/1Y/All)
 * - Circular progress ring (72x72px) with animated fill
 * - Full-width timeline chart with bezier curves
 * - Comparison stats row
 *
 * @see habit-strength-redesign-spec.md for design details
 *
 * @example
 * ```tsx
 * <HabitStrengthSection
 *   habitId={habit._id}
 *   completedDates={completedDates}
 *   habitCreatedAt={habit.createdAt}
 *   habitColor={habit.iconColor}
 * />
 * ```
 */

import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { useHabitStrength } from '../../hooks/useHabitStrength';
import { getStrengthLabel } from '../HabitStrengthHistory/strengthUtils';
import { COLORS } from './constants';
import { StrengthChart } from './StrengthChart';
import { StrengthHero } from './StrengthHero';
import { StrengthStatsRow } from './StrengthStatsRow';
import { TimeRangeToggle } from './TimeRangeToggle';
import type { HabitStrengthSectionProps, TimeRange } from './types';
import { calculateExtendedMetrics, generateChartDataFromCompletions, sampleHistoryForChart } from './utils';

/**
 * Main HabitStrengthSection component.
 *
 * Composes TimeRangeToggle, StrengthHero, StrengthChart, and StrengthStatsRow
 * into a cohesive card with shadow and rounded corners.
 */
export const HabitStrengthSection = React.memo(function HabitStrengthSection({
  habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  habitStrength,
}: HabitStrengthSectionProps) {
  // Time range state (default to 1 year)
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');

  // Get strength data from existing hook (for history and metrics)
  const { currentStrength: calculatedStrength, strengthHistory, metrics, isCalculating } =
    useHabitStrength(completedDates, habitCreatedAt);

  // Use database strength if provided (converted from 0-1 to 0-100), otherwise use calculated
  // This ensures consistency with HabitCard which uses habit.strength
  const currentStrength =
    habitStrength !== undefined ? Math.round(habitStrength * 100) : calculatedStrength;

  // Calculate extended metrics with time range filtering
  const extendedMetrics = useMemo(() => {
    return calculateExtendedMetrics(
      completedDates,
      habitCreatedAt,
      currentStrength,
      metrics.deltaVsMonth,
      strengthHistory,
      timeRange
    );
  }, [
    completedDates,
    habitCreatedAt,
    currentStrength,
    metrics.deltaVsMonth,
    strengthHistory,
    timeRange,
  ]);

  // Generate chart data directly from completedDates (bypasses broken strengthHistory)
  const chartData = useMemo(() => {
    const rawChartData = generateChartDataFromCompletions(completedDates, timeRange);
    return sampleHistoryForChart(rawChartData, 50);
  }, [completedDates, timeRange]);

  // Get strength label for display
  const strengthLabel = getStrengthLabel(currentStrength);

  // Handle loading state
  if (isCalculating) {
    return (
      <View className="rounded-2xl bg-white p-5 shadow-sm">
        <View className="h-48 items-center justify-center">
          <Text className="text-stone-400">Calculating strength...</Text>
        </View>
      </View>
    );
  }

  // Handle empty state (no completions)
  if (completedDates.size === 0) {
    return (
      <View className="rounded-2xl bg-white p-5 shadow-sm">
        <Text className="mb-2 text-lg font-bold text-stone-800">
          Habit Strength
        </Text>
        <View className="items-center justify-center py-8">
          <Text className="mb-2 text-4xl">🌱</Text>
          <Text className="text-center text-stone-500">
            Complete your first day to start building strength!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      className="overflow-hidden rounded-2xl bg-white shadow-sm"
      entering={FadeInDown.delay(100).springify()}
      style={{
        shadowColor: COLORS.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="p-5">
        {/* Header with Time Range Switcher */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-stone-800">
            Habit Strength
          </Text>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </View>

        {/* Hero Section - Ring + Status */}
        <View className="mb-4">
          <StrengthHero
            strength={currentStrength}
            label={strengthLabel}
            delta={extendedMetrics.deltaVsMonth}
            deltaLabel="vs last month"
            color={habitColor}
          />
        </View>

        {/* Full-Width Chart */}
        <View className="mb-4 -mx-5">
          <StrengthChart
            data={chartData}
            timeRange={timeRange}
            currentStrength={currentStrength}
            color={habitColor}
          />
        </View>

        {/* Stats Row */}
        <StrengthStatsRow
          sinceStart={extendedMetrics.sinceStart}
          lastMonth={extendedMetrics.deltaVsMonth}
          lastWeek={extendedMetrics.deltaVsWeek}
        />
      </View>
    </Animated.View>
  );
});

export default HabitStrengthSection;
