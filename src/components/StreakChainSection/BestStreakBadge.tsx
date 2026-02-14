/**
 * BestStreakBadge Component
 * Shows the user's personal best streak record — theme-aware
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { colors as palette } from '../../theme/colors';

interface BestStreakBadgeProps {
  bestStreak: number;
  isNewRecord: boolean;
  currentStreak: number;
}

export function BestStreakBadge({
  bestStreak,
  isNewRecord,
  currentStreak,
}: BestStreakBadgeProps) {
  if (bestStreak <= 0 || isNewRecord || currentStreak <= 0) {
    return null;
  }

  const { colors, isDark } = useThemeColors();

  const bgColor = isDark ? 'rgba(217, 119, 6, 0.12)' : palette.streak[100];
  const borderColor = isDark ? 'rgba(217, 119, 6, 0.25)' : '#FDE68A'; // amber-200

  return (
    <View
      style={[
        localStyles.badge,
        {
          backgroundColor: bgColor,
          borderColor,
        },
      ]}
    >
      <Ionicons color={palette.streak[500]} name="trophy" size={16} />
      <Text style={[localStyles.text, { color: colors.text.secondary }]}>
        Best:{' '}
        <Text style={[localStyles.value, { color: palette.streak[700] }]}>
          {bestStreak}
        </Text>
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2, // 10px
  },
  text: {
    fontSize: 14,
  },
  value: {
    fontWeight: '700',
  },
});
