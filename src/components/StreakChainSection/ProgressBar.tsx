/**
 * ProgressBar Component
 * Shows progress toward next streak tier milestone — theme-aware
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { colors as palette } from '../../theme/colors';
import type { TierConfig } from './types';

/** Map NativeWind bar colors to actual hex values */
const BAR_COLOR_MAP: Record<string, string> = {
  'bg-amber-500': '#F59E0B',
  'bg-blue-500': '#3B82F6',
  'bg-orange-500': '#F97316',
  'bg-pink-500': '#EC4899',
  'bg-purple-500': '#8B5CF6',
  'bg-red-500': '#EF4444',
  'bg-stone-400': palette.gray[400],
  'bg-yellow-500': '#EAB308',
};

interface ProgressBarProps {
  next: TierConfig;
  daysToNext: number;
  barAnimatedStyle: object;
}

export function ProgressBar({
  next,
  daysToNext,
  barAnimatedStyle,
}: ProgressBarProps) {
  const { colors, isDark } = useThemeColors();
  const barColor = BAR_COLOR_MAP[next.barColor] ?? palette.streak[500];
  const trackBg = isDark ? colors.gray[200] : colors.gray[50];

  return (
    <View style={localStyles.container}>
      <View style={localStyles.labelRow}>
        <Text style={[localStyles.labelText, { color: colors.text.secondary }]}>
          Progress to {next.icon} Day {next.days}
        </Text>
        <Text style={[localStyles.countdownText, { color: palette.streak[600] }]}>
          {daysToNext} {daysToNext === 1 ? 'day' : 'days'}
        </Text>
      </View>
      <View style={[localStyles.track, { backgroundColor: trackBg }]}>
        <Animated.View
          style={[
            localStyles.fill,
            { backgroundColor: barColor },
            barAnimatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    paddingHorizontal: spacing.sm,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fill: {
    borderRadius: borderRadius.full,
    height: '100%',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  track: {
    borderRadius: borderRadius.full,
    height: 8,
    overflow: 'hidden',
  },
});
