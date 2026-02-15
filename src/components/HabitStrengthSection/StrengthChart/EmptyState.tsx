/**
 * StrengthChart EmptyState Component
 *
 * Shown when there isn't enough data to display the chart.
 */

import React from 'react';
import { Text, View } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import { CHART_HEIGHT } from '../constants';
import { useThemeColors } from '../../../theme/ThemeContext';

/**
 * Displays a message when chart has insufficient data.
 */
export const EmptyState = React.memo(function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessibilityLabel='No strength history available yet'
      entering={FadeIn.duration(300)}
      style={{
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderRadius: 12,
        height: CHART_HEIGHT,
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 32, marginBottom: 8 }}>💪</Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        Complete more days to see your strength chart
      </Text>
    </Animated.View>
  );
});
