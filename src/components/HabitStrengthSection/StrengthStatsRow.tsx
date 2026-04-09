/**
 * StrengthStatsRow Component
 *
 * Three-column layout displaying comparison metrics:
 * - Since Start: Total growth since habit creation
 * - Last Month: Month-over-month change
 * - Last Week: Week-over-week change
 *
 * Positive changes are highlighted in emerald.
 *
 * @example
 * ```tsx
 * <StrengthStatsRow
 *   sinceStart={72}
 *   lastMonth={12}
 *   lastWeek={3}
 * />
 * ```
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { getThemeColors } from './constants';
import type { StrengthStatsRowProps } from './types';

/**
 * Format a delta value for display with + or - prefix.
 */
function formatDelta(value: number): string {
  if (value === 0) return '0%';
  return value > 0 ? `+${value}%` : `${value}%`;
}

/**
 * Single stat column component (compact version for above-fold layout).
 */
function StatColumn({
  label,
  value,
  isPositive,
}: {
  label: string;
  value: string;
  isPositive: boolean;
}) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);

  return (
    <View className='flex-1 items-center'>
      <Text className='text-[10px]' style={{ color: themeColors.text.tertiary }}>{label}</Text>
      <Text
        className='text-sm font-semibold'
        style={{
          color: isPositive ? sectionColors.positive : sectionColors.textPrimary,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

/**
 * Vertical divider between stat columns (compact height).
 */
function Divider() {
  const { colors: themeColors } = useThemeColors();
  return (
    <View className='h-6 w-px' style={{ backgroundColor: themeColors.border }} />
  );
}

/**
 * StrengthStatsRow displays three comparison metrics in a row (compact version).
 */
export const StrengthStatsRow = React.memo(function StrengthStatsRow({
  sinceStart,
  lastMonth,
  lastWeek,
}: StrengthStatsRowProps) {
  const { colors: themeColors } = useThemeColors();
  // Guard against NaN/undefined values - default to 0
  const safeSinceStart =
    typeof sinceStart === 'number' && !Number.isNaN(sinceStart)
      ? sinceStart
      : 0;
  const safeLastMonth =
    typeof lastMonth === 'number' && !Number.isNaN(lastMonth) ? lastMonth : 0;
  const safeLastWeek =
    typeof lastWeek === 'number' && !Number.isNaN(lastWeek) ? lastWeek : 0;

  return (
    <View
      accessibilityLabel={`Statistics: ${safeSinceStart}% since start, ${formatDelta(safeLastMonth)} last month, ${formatDelta(safeLastWeek)} last week`}
      className='flex-row items-center justify-between rounded-lg px-3 py-2'
      style={{ backgroundColor: themeColors.background }}
    >
      <StatColumn
        isPositive={safeSinceStart > 0}
        label='Since Start'
        value={`${safeSinceStart}%`}
      />

      <Divider />

      <StatColumn
        isPositive={safeLastMonth > 0}
        label='Last Month'
        value={formatDelta(safeLastMonth)}
      />

      <Divider />

      <StatColumn
        isPositive={safeLastWeek > 0}
        label='Last Week'
        value={formatDelta(safeLastWeek)}
      />
    </View>
  );
});
