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

import { useThemeColors } from '../../theme';
import { COLORS } from './constants';
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
  labelColor,
  textColor,
}: {
  label: string;
  value: string;
  isPositive: boolean;
  labelColor: string;
  textColor: string;
}) {
  return (
    <View className='flex-1 items-center'>
      {/* Smaller label text for compact layout */}
      <Text className='text-[10px]' style={{ color: labelColor }}>{label}</Text>
      <Text
        className='text-sm font-semibold'
        style={{
          color: isPositive ? COLORS.positive : textColor,
        }}
      >
        {value}
      </Text>
    </View>
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
  // Guard against NaN/undefined values - default to 0
  const safeSinceStart =
    typeof sinceStart === 'number' && !Number.isNaN(sinceStart)
      ? sinceStart
      : 0;
  const safeLastMonth =
    typeof lastMonth === 'number' && !Number.isNaN(lastMonth) ? lastMonth : 0;
  const safeLastWeek =
    typeof lastWeek === 'number' && !Number.isNaN(lastWeek) ? lastWeek : 0;

  const { colors: themeColors, isDark } = useThemeColors();
  const labelColor = isDark ? themeColors.text.tertiary : '#a8a29e';
  const textColor = isDark ? themeColors.text.primary : COLORS.textPrimary;
  const rowBg = isDark ? 'rgba(255,255,255,0.05)' : '#fafaf9';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : COLORS.border;

  return (
    <View
      accessibilityLabel={`Statistics: ${safeSinceStart}% since start, ${formatDelta(safeLastMonth)} last month, ${formatDelta(safeLastWeek)} last week`}
      className='flex-row items-center justify-between rounded-lg px-3 py-2'
      style={{ backgroundColor: rowBg }}
    >
      <StatColumn
        isPositive={safeSinceStart > 0}
        label='Since Start'
        labelColor={labelColor}
        textColor={textColor}
        value={`${safeSinceStart}%`}
      />

      <View className='h-6 w-px' style={{ backgroundColor: borderColor }} />

      <StatColumn
        isPositive={safeLastMonth > 0}
        label='Last Month'
        labelColor={labelColor}
        textColor={textColor}
        value={formatDelta(safeLastMonth)}
      />

      <View className='h-6 w-px' style={{ backgroundColor: borderColor }} />

      <StatColumn
        isPositive={safeLastWeek > 0}
        label='Last Week'
        labelColor={labelColor}
        textColor={textColor}
        value={formatDelta(safeLastWeek)}
      />
    </View>
  );
});
