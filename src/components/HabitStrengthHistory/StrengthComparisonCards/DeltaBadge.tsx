/**
 * DeltaBadge - Badge showing the change in strength vs 30 days ago
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { DELTA_BADGE_COLORS } from './constants';
import type { DeltaBadgeProps } from './types';
import { iconSizes } from '@/theme/iconSizes';

export function DeltaBadge({ delta }: DeltaBadgeProps) {
  const { colors: themeColors } = useThemeColors();
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  const iconColor = isPositive
    ? DELTA_BADGE_COLORS.positive
    : isNegative
      ? DELTA_BADGE_COLORS.negative
      : DELTA_BADGE_COLORS.neutral;

  const textColor = isPositive
    ? themeColors.status.successText
    : isNegative
      ? themeColors.status.errorText
      : themeColors.text.secondary;

  const bgColor = isPositive
    ? themeColors.status.successLight
    : isNegative
      ? themeColors.status.errorLight
      : themeColors.background;

  return (
    <View
      accessible
      accessibilityLabel={
        isPositive
          ? `Up ${Math.abs(delta)}% vs last month`
          : isNegative
            ? `Down ${Math.abs(delta)}% vs last month`
            : 'No change vs last month'
      }
      className='mt-1.5 flex-row items-center gap-0.5 rounded-full px-2 py-0.5'
      style={{ backgroundColor: bgColor }}
    >
      <Icon color={iconColor} size={iconSizes.micro} />
      <Text className='text-[10px] font-semibold' style={{ color: textColor }}>
        {isPositive ? '+' : ''}
        {delta.toFixed(1)}%
      </Text>
    </View>
  );
}
