/**
 * StrengthChart EmptyState Component
 *
 * Shown when there isn't enough data to display the chart.
 */

import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

import { CHART_HEIGHT } from '../constants';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';
import { durations } from '@/theme/animations';

/**
 * Displays a message when chart has insufficient data.
 */
export const EmptyState = React.memo(function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessibilityLabel='No strength history available yet'
      entering={FadeIn.duration(durations.moderate)}
      style={{
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderRadius: borderRadius.medium,
        height: CHART_HEIGHT,
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 32, marginBottom: 8 }}>💪</Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: typography.bodySmall.fontSize,
          textAlign: 'center',
        }}
      >
        Complete more days to see your strength chart
      </Text>
    </Animated.View>
  );
});
