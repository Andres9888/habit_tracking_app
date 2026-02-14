/**
 * StreakHeader Component
 * Header section showing flame icon and title — theme-aware
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { colors as palette } from '../../theme/colors';

interface StreakHeaderProps {
  currentIcon: string;
}

export function StreakHeader({ currentIcon }: StreakHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View style={localStyles.row}>
      <View
        style={[
          localStyles.iconBox,
          { backgroundColor: palette.streak[100] },
        ]}
      >
        <Ionicons color={palette.streak[500]} name="flame" size={16} />
      </View>
      <Text style={[localStyles.title, { color: colors.text.primary }]}>
        Streak
      </Text>
      {currentIcon ? (
        <Text style={localStyles.tierIcon}>{currentIcon}</Text>
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  tierIcon: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
