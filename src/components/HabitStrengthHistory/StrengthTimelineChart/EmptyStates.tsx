/**
 * Empty state components for StrengthTimelineChart
 */

import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

interface EmptyStateProps {
  height: number;
}

export function NoDataState({ height }: EmptyStateProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessible
      accessibilityLabel='Strength timeline chart - No data available yet'
      entering={FadeIn.duration(300)}
      style={{
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderRadius: 12,
        height,
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 6 }}>⚡</Text>
      <Text style={{ color: colors.text.tertiary, fontSize: 13 }}>
        Building your strength history...
      </Text>
    </Animated.View>
  );
}

export function BuildingHistoryState({ height }: EmptyStateProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessible
      accessibilityLabel='Strength timeline chart - Building history'
      entering={FadeIn.duration(400)}
      style={{
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderRadius: 12,
        height,
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 6 }}>📈</Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Keep going! Your strength chart will appear after a week of tracking.
      </Text>
    </Animated.View>
  );
}
