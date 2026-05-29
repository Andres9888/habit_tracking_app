/**
 * StrengthStatsRow — Peak, month delta, and distance to next tier.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { getThemeColors } from './constants';
import type { StrengthStatsRowProps } from './types';

function formatDelta(value: number): string {
  if (value === 0) return '0%';
  return value > 0 ? `+${value}%` : `${value}%`;
}

function StatColumn({
  label,
  value,
  isPositive,
  valueColor,
}: {
  label: string;
  value: string;
  isPositive?: boolean;
  valueColor?: string;
}) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);

  return (
    <View className='flex-1 items-center'>
      <Text className='text-[10px]' style={{ color: themeColors.text.tertiary }}>
        {label}
      </Text>
      <Text
        className='text-sm font-semibold'
        style={{
          color:
            valueColor ??
            (isPositive ? sectionColors.positive : sectionColors.textPrimary),
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  const { colors: themeColors } = useThemeColors();
  return (
    <View className='h-6 w-px' style={{ backgroundColor: themeColors.border }} />
  );
}

export const StrengthStatsRow = React.memo(function StrengthStatsRow({
  peak,
  deltaVsMonth,
  pointsToNextTier,
}: StrengthStatsRowProps) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);

  const safePeak =
    typeof peak === 'number' && !Number.isNaN(peak) ? peak : 0;
  const safeDelta =
    typeof deltaVsMonth === 'number' && !Number.isNaN(deltaVsMonth)
      ? deltaVsMonth
      : 0;
  const safeToNext =
    typeof pointsToNextTier === 'number' && !Number.isNaN(pointsToNextTier)
      ? pointsToNextTier
      : 0;

  const deltaIsPositive = safeDelta > 0;
  const deltaIsNegative = safeDelta < 0;
  const nextValue =
    safeToNext <= 0 ? 'Max' : `−${Math.round(safeToNext)}%`;

  return (
    <View
      accessibilityLabel={`Peak ${safePeak} percent, ${formatDelta(safeDelta)} versus last month, ${nextValue} to next tier`}
      className='flex-row items-center justify-between rounded-lg px-3 py-2'
      style={{ backgroundColor: themeColors.background }}
    >
      <StatColumn label='Peak' value={`${safePeak}%`} />

      <Divider />

      <StatColumn
        isPositive={deltaIsPositive}
        label='vs Month'
        value={formatDelta(safeDelta)}
        valueColor={
          deltaIsPositive
            ? sectionColors.positive
            : deltaIsNegative
              ? sectionColors.negative
              : sectionColors.textPrimary
        }
      />

      <Divider />

      <StatColumn label='Next tier' value={nextValue} />
    </View>
  );
});
