/**
 * HabitStrengthSection Component (Redesigned)
 * Comprehensive habit strength display with time range switcher, ring, and chart.
 */

import React, { useMemo, useState } from 'react';
import { useHabitStrength } from '../../hooks/useHabitStrength';
import { getStrengthLabel } from '../HabitStrengthHistory/strengthUtils';
import { EmptyState, LoadingState } from './components';
import { HabitStrengthContent } from './HabitStrengthContent';
import type { HabitStrengthSectionProps, TimeRange } from './types';
import {
  calculateExtendedMetrics,
  generateChartDataFromCompletions,
  sampleHistoryForChart,
} from './utils';

export const HabitStrengthSection = React.memo(function HabitStrengthSection({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  habitStrength,
}: HabitStrengthSectionProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');

  const {
    currentStrength: calculatedStrength,
    strengthHistory,
    metrics,
    isCalculating,
  } = useHabitStrength(completedDates, habitCreatedAt);

  const currentStrength =
    habitStrength === undefined
      ? calculatedStrength
      : Math.round(habitStrength * 100);

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

  const chartData = useMemo(() => {
    const rawChartData = generateChartDataFromCompletions(
      completedDates,
      timeRange
    );
    return sampleHistoryForChart(rawChartData, 50);
  }, [completedDates, timeRange]);

  const strengthLabel = getStrengthLabel(currentStrength);

  if (isCalculating) return <LoadingState />;
  if (completedDates.size === 0) return <EmptyState />;

  return (
    <HabitStrengthContent
      chartData={chartData}
      currentStrength={currentStrength}
      delta={extendedMetrics.deltaVsMonth}
      habitColor={habitColor}
      strengthLabel={strengthLabel}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
    />
  );
});

export default HabitStrengthSection;
