/**
 * TrendMessage Component
 *
 * A single encouraging line below the chart that reacts to recent momentum.
 * Always framed positively — a dip is shown as a recoverable nudge, never an
 * alarm — so the section keeps motivating regardless of state.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { TrendingDown, TrendingUp } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

import { getThemeColors } from './constants';

interface TrendMessageProps {
  /** Change in strength vs ~30 days ago (percentage points) */
  delta: number;
}

export function TrendMessage({ delta }: TrendMessageProps) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);
  const safeDelta = typeof delta === 'number' && !Number.isNaN(delta) ? delta : 0;

  const up = safeDelta > 0;
  const down = safeDelta < 0;
  const message = up
    ? `Up ${safeDelta}% this month — keep showing up`
    : down
      ? `Down ${Math.abs(safeDelta)}% — a few days back on track rebuilds it fast`
      : 'Holding steady — consistency is doing its work';
  const tint = up ? sectionColors.positive : themeColors.text.secondary;

  return (
    <View className='mb-3 flex-row items-center justify-center gap-1.5'>
      {up ? <TrendingUp color={tint} size={iconSizes.small} /> : null}
      {down ? <TrendingDown color={themeColors.text.tertiary} size={iconSizes.small} /> : null}
      <Text className='text-sm font-medium' style={{ color: tint }}>
        {message}
      </Text>
    </View>
  );
}
