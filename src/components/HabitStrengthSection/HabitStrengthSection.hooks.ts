/**
 * HabitStrengthSection - Business Logic Hook
 *
 * Handles input sanitization, strength calculations, chart data generation,
 * and extended metrics. Keeps the component file focused on rendering.
 */

import { useMemo, useState } from 'react';
import { useHabitStrength } from '../../hooks/useHabitStrength';
import {
  calculateBestStreakFromDates,
  differenceInDays,
} from '../../lib/offline/calculations';
import { getStrengthLabel } from '../HabitStrengthHistory/strengthUtils';
import type { TimeRange } from './types';
import {
  calculateExtendedMetrics,
  generateChartDataFromCompletions,
  sampleHistoryForChart,
} from './utils';

interface HabitStrengthInput {
  completedDates: Set<string>;
  habitCreatedAt: number;
  habitStrength?: number;
}

export function useHabitStrengthData({
  completedDates,
  habitCreatedAt,
  habitStrength,
}: HabitStrengthInput) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');

  // Ensure completedDates is a valid Set
  const safeCompletedDates = useMemo(() => {
    if (!completedDates) return new Set<string>();
    if (completedDates instanceof Set) return completedDates;
    if (Array.isArray(completedDates))
      return new Set(completedDates as unknown as string[]);
    return new Set<string>();
  }, [completedDates]);

  // Ensure habitCreatedAt is valid
  const safeHabitCreatedAt = useMemo(() => {
    if (typeof habitCreatedAt !== 'number' || Number.isNaN(habitCreatedAt)) {
      return Date.now();
    }
    return habitCreatedAt;
  }, [habitCreatedAt]);

  const {
    currentStrength: calculatedStrength,
    strengthHistory,
    isCalculating,
  } = useHabitStrength(safeCompletedDates, safeHabitCreatedAt);

  // Use database strength if provided (0-1 → 0-100), otherwise calculated
  const currentStrength =
    habitStrength === undefined
      ? calculatedStrength
      : Math.round(habitStrength * 100);

  const extendedMetrics = useMemo(
    () =>
      calculateExtendedMetrics(
        safeCompletedDates,
        safeHabitCreatedAt,
        currentStrength,
        strengthHistory,
        timeRange
      ),
    [
      safeCompletedDates,
      safeHabitCreatedAt,
      currentStrength,
      strengthHistory,
      timeRange,
    ]
  );

  const chartData = useMemo(() => {
    const raw = generateChartDataFromCompletions(safeCompletedDates, timeRange);
    return sampleHistoryForChart(raw, 50);
  }, [safeCompletedDates, timeRange]);

  const milestoneStats = useMemo(() => {
    const longestStreak = calculateBestStreakFromDates([...safeCompletedDates]);
    const totalCompletions = safeCompletedDates.size;
    const elapsed = differenceInDays(new Date(), new Date(safeHabitCreatedAt));
    const daysTracked = Math.max(1, elapsed + 1);
    return { daysTracked, longestStreak, totalCompletions };
  }, [safeCompletedDates, safeHabitCreatedAt]);

  const strengthLabel = getStrengthLabel(currentStrength);

  return {
    chartData,
    currentStrength,
    extendedMetrics,
    isCalculating,
    isEmpty: safeCompletedDates.size === 0,
    milestoneStats,
    setTimeRange,
    strengthLabel,
    timeRange,
  };
}
