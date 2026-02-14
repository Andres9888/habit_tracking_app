/**
 * Empty state components for StrengthTimelineChart
 * Dark mode aware via useThemeColors
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

interface EmptyStateProps {
  height: number;
}

export function NoDataState({ height }: EmptyStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel='Strength timeline chart - No data available yet'
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: isDark ? colors.gray[100] : colors.gray[50],
        padding: 16,
        height,
      }}
    >
      <Text style={{ fontSize: 14, color: colors.text.secondary }}>
        Building your strength history...
      </Text>
    </View>
  );
}

export function BuildingHistoryState({ height }: EmptyStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      accessible
      accessibilityLabel='Strength timeline chart - Building history'
      entering={FadeIn.duration(400)}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: isDark ? colors.gray[100] : colors.gray[50],
        padding: 16,
        height,
      }}
    >
      <Text style={{ textAlign: 'center', fontSize: 14, color: colors.text.secondary }}>
        Keep going! Your strength chart will appear after a week of tracking.
      </Text>
    </Animated.View>
  );
}
