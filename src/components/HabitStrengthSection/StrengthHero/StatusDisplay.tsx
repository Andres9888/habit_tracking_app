/**
 * StatusDisplay Component
 *
 * Displays the strength label badge and delta change indicator.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { TrendingDown, TrendingUp } from 'lucide-react-native';

import { COLORS, STRENGTH_COLORS, STRENGTH_LABELS } from '../constants';
import type { StatusDisplayProps } from './types';

/**
 * Displays strength label and delta change.
 */
export function StatusDisplay({
  label,
  delta,
  deltaLabel,
}: StatusDisplayProps) {
  // Guard against invalid label - default to 'weak'
  const safeLabel = label && STRENGTH_COLORS[label] ? label : 'weak';
  const colors = STRENGTH_COLORS[safeLabel];

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
          {STRENGTH_LABELS[safeLabel]}
        </Text>
      </View>

      {/* Delta badge */}
      <View className='flex-row items-center gap-1'>
        {deltaIsPositive ? <TrendingUp color={COLORS.positive} size={14} /> : null}
        {deltaIsNegative ? <TrendingDown color={COLORS.negative} size={14} /> : null}
        <Text
          className='text-sm'
          style={{
            color: deltaIsPositive
              ? COLORS.positive
              : deltaIsNegative
                ? COLORS.negative
                : COLORS.textSecondary,
          }}
        >
          {deltaText}
        </Text>
        <Text className='text-sm text-stone-500'>{deltaLabel}</Text>
      </View>
    </View>
  );
}
