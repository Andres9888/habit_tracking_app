/**
 * DeltaBadge - Badge showing the change in strength vs 30 days ago
 */

import React from 'react';
import { View, Text } from 'react-native';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

import type { DeltaBadgeProps } from './types';
import { DELTA_BADGE_COLORS } from './constants';

export function DeltaBadge({ delta }: DeltaBadgeProps) {
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  const iconColor = isPositive
    ? DELTA_BADGE_COLORS.positive
    : isNegative
      ? DELTA_BADGE_COLORS.negative
      : DELTA_BADGE_COLORS.neutral;

  // Text colors using WCAG AA compliant shades (-700 variants)
  const textColor = isPositive
    ? 'text-emerald-700'
    : isNegative
      ? 'text-red-700'
      : 'text-stone-500';

  const bgColor = isPositive
    ? 'bg-emerald-50'
    : isNegative
      ? 'bg-red-50'
      : 'bg-stone-100';

  const accessibilityText = isPositive
    ? `Up ${Math.abs(delta)}% vs last month`
    : isNegative
      ? `Down ${Math.abs(delta)}% vs last month`
      : 'No change vs last month';

  return (
    <View
      accessible
      accessibilityLabel={accessibilityText}
      className={`mt-1.5 flex-row items-center gap-0.5 rounded-full px-2 py-0.5 ${bgColor}`}
    >
      <Icon color={iconColor} size={10} />
      <Text className={`text-[10px] font-semibold ${textColor}`}>
        {isPositive ? '+' : ''}
        {delta.toFixed(1)}%
      </Text>
    </View>
  );
}
