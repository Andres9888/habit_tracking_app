/**
 * StrengthActionTip — Actionable nudge toward the next strength tier.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';

import { typography } from '../../theme/typography';

export interface StrengthActionTipProps {
  pointsToNext: number;
  nextTierLabel: string | null;
}

export const StrengthActionTip = React.memo(function StrengthActionTip({
  pointsToNext,
  nextTierLabel,
}: StrengthActionTipProps) {
  const { colors: themeColors } = useThemeColors();

  if (!nextTierLabel || pointsToNext <= 0) {
    return null;
  }

  const rounded = Math.round(pointsToNext);

  return (
    <View
      accessibilityLabel={`${rounded} percent to reach ${nextTierLabel}`}
      className='mt-3 rounded-xl px-3 py-2.5'
      style={{
        backgroundColor: themeColors.status.warningLight,
        borderColor: themeColors.status.warning,
        borderWidth: 1,
      }}
    >
      <Text style={{ ...typography.bodySmall, color: themeColors.text.primary }}>
        <Text style={{ fontWeight: '600' }}>Tip: </Text>
        {rounded}% to reach{' '}
        <Text style={{ fontWeight: '600', color: themeColors.primary[700] }}>
          {nextTierLabel}
        </Text>
        . Keep showing up — consistency builds strength.
      </Text>
    </View>
  );
});
