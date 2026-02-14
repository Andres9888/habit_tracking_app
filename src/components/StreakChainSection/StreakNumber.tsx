/**
 * StreakNumber Component
 * Large animated streak count display — theme-aware
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';
import { colors as palette } from '../../theme/colors';

/** Tier colors mapped by index — warm palette */
const TIER_COLORS = [
  palette.gray[700],    // 0 days — neutral
  '#EA580C',            // 3 days — orange
  '#D97706',            // 5 days — amber
  '#DC2626',            // 7 days — red
  '#CA8A04',            // 14 days — yellow
  '#7C3AED',            // 21 days — purple
  palette.secondary[600], // 30 days — blue
  '#DB2777',            // 60 days — pink
];

interface StreakNumberProps {
  currentStreak: number;
  tierIndex: number;
  animatedStyle: object;
}

export function StreakNumber({
  currentStreak,
  tierIndex,
  animatedStyle,
}: StreakNumberProps) {
  const { colors } = useThemeColors();
  const numberColor = TIER_COLORS[tierIndex] ?? colors.text.primary;

  return (
    <Animated.View style={[localStyles.container, animatedStyle]}>
      <Text style={[localStyles.number, { color: numberColor }]}>
        {currentStreak}
      </Text>
      <Text style={[localStyles.label, { color: colors.text.secondary }]}>
        {currentStreak === 1 ? 'day' : 'days'}
      </Text>
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  number: {
    fontSize: 60,
    fontWeight: '800',
    letterSpacing: -3,
    lineHeight: 68,
  },
});
