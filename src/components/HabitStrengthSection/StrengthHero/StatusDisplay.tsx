/**
 * StatusDisplay Component
 *
 * Displays the strength label badge and delta change indicator.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { getStrengthColors, getThemeColors, STRENGTH_LABELS } from '../constants';
import type { StatusDisplayProps } from './types';

/**
 * Displays strength label and delta change.
 */
export function StatusDisplay({
  label,
  delta,
  deltaLabel,
  tierDisplayLabel,
}: StatusDisplayProps) {
  const { colors: themeColors } = useThemeColors();
  const strengthColors = getStrengthColors(themeColors);
  const sectionColors = getThemeColors(themeColors);
  // Guard against invalid label - default to 'weak'
  const safeLabel = label && strengthColors[label] ? label : 'weak';
  const colors = strengthColors[safeLabel];

  // Guard against NaN/undefined delta - default to 0
  const safeDelta =
    typeof delta === 'number' && !Number.isNaN(delta) ? delta : 0;

  // Format delta for display
  const deltaText = safeDelta >= 0 ? `+${safeDelta}%` : `${safeDelta}%`;
  const deltaIsPositive = safeDelta > 0;
  const deltaIsNegative = safeDelta < 0;

  return (
    <View className='ml-4 flex-1'>
      {/* Strength label */}
      <View
        className='mb-1 self-start rounded-full px-2.5 py-1'
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className='text-sm font-semibold'
          style={{ color: colors.primary }}
        >
          {tierDisplayLabel ?? STRENGTH_LABELS[safeLabel]}
        </Text>
      </View>

      {/* Delta badge */}
      <View className='flex-row items-center gap-1'>
        {deltaIsPositive ? <TrendingUp color={sectionColors.positive} size={iconSizes.small} /> : null}
        {deltaIsNegative ? <TrendingDown color={sectionColors.negative} size={iconSizes.small} /> : null}
        <Text
          className='text-sm'
          style={{
            color: deltaIsPositive
              ? sectionColors.positive
              : deltaIsNegative
                ? sectionColors.negative
                : sectionColors.textSecondary,
          }}
        >
          {deltaText}
        </Text>
        <Text className='text-sm' style={{ color: themeColors.text.secondary }}>{deltaLabel}</Text>
      </View>
    </View>
  );
}
