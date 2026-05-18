/**
 * StatusDisplay Component
 *
 * Displays the strength tier badge plus a single line of generated microcopy
 * (e.g. "First dip in 2 weeks", "+5% last 7 days") and a compact dual delta.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { getStrengthColors, getThemeColors, STRENGTH_LABELS } from '../constants';
import type { StatusDisplayProps } from './types';

function formatDelta(value: number): string {
  if (value === 0) return '0%';
  return value > 0 ? `+${value}%` : `${value}%`;
}

function getMicrocopy(week: number, month: number): string {
  if (week <= -2 && month >= 2) return 'First dip after a strong month';
  if (week >= 5) return `Climbing — ${formatDelta(week)} this week`;
  if (week <= -5) return `Cooling off — ${formatDelta(week)} this week`;
  if (week > 0) return `Up ${formatDelta(week)} last 7 days`;
  if (week < 0) return `Down ${formatDelta(week)} last 7 days`;
  return 'Holding steady';
}

function pickDeltaColor(
  value: number,
  positive: string,
  negative: string,
  neutral: string
): string {
  if (value > 0) return positive;
  if (value < 0) return negative;
  return neutral;
}

export function StatusDisplay({
  label,
  deltaVsWeek,
  deltaVsMonth,
}: StatusDisplayProps) {
  const { colors: themeColors } = useThemeColors();
  const strengthColors = getStrengthColors(themeColors);
  const sectionColors = getThemeColors(themeColors);
  const safeLabel = label && strengthColors[label] ? label : 'weak';
  const colors = strengthColors[safeLabel];

  const safeWeek =
    typeof deltaVsWeek === 'number' && !Number.isNaN(deltaVsWeek)
      ? deltaVsWeek
      : 0;
  const safeMonth =
    typeof deltaVsMonth === 'number' && !Number.isNaN(deltaVsMonth)
      ? deltaVsMonth
      : 0;

  const microcopy = getMicrocopy(safeWeek, safeMonth);
  const weekColor = pickDeltaColor(
    safeWeek,
    sectionColors.positive,
    sectionColors.negative,
    sectionColors.textSecondary
  );
  const monthColor = pickDeltaColor(
    safeMonth,
    sectionColors.positive,
    sectionColors.negative,
    sectionColors.textSecondary
  );
  const weekIsPositive = safeWeek > 0;
  const weekIsNegative = safeWeek < 0;

  return (
    <View className='ml-4 flex-1'>
      <View
        className='mb-1 self-start rounded-full px-2.5 py-1'
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className='text-sm font-semibold'
          style={{ color: colors.primary }}
        >
          {STRENGTH_LABELS[safeLabel]}
        </Text>
      </View>

      <Text
        className='mt-1 text-sm font-medium'
        style={{ color: sectionColors.textPrimary }}
      >
        {microcopy}
      </Text>

      <View className='mt-1 flex-row items-center gap-1'>
        {weekIsPositive ? <TrendingUp color={weekColor} size={iconSizes.small} /> : null}
        {weekIsNegative ? <TrendingDown color={weekColor} size={iconSizes.small} /> : null}
        <Text className='text-xs font-semibold' style={{ color: weekColor }}>
          {formatDelta(safeWeek)}
        </Text>
        <Text className='text-xs' style={{ color: themeColors.text.secondary }}>
          7d ·
        </Text>
        <Text className='text-xs font-semibold' style={{ color: monthColor }}>
          {formatDelta(safeMonth)}
        </Text>
        <Text className='text-xs' style={{ color: themeColors.text.secondary }}>
          30d
        </Text>
      </View>
    </View>
  );
}
