/**
 * Empty state components for StrengthTimelineChart
 */

import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';

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
        borderRadius: borderRadius.medium,
        height,
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 6 }}>⚡</Text>
      <Text style={{ color: colors.text.tertiary, fontFamily: fontFamilies.primary.text, fontSize: 14 }}>
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
        borderRadius: borderRadius.medium,
        height,
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 6 }}>📈</Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: typography.bodySmall.fontSize,
          textAlign: 'center',
        }}
      >
        Keep going! Your strength chart will appear after a week of tracking.
      </Text>
    </Animated.View>
  );
}
