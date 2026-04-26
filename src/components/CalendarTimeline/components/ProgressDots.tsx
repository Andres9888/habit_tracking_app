import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors as palette } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { StreakGreetingResult } from '../hooks/useStreakGreeting';

interface ProgressDotsProps {
  completed: number;
  total: number;
  variant?: StreakGreetingResult['variant'];
}

function getDotColors(variant: ProgressDotsProps['variant'], isDark: boolean, colors: ReturnType<typeof useThemeColors>['colors']) {
  const active = variant === 'risk'
    ? palette.error
    : variant === 'success' || variant === 'almostDone'
      ? colors.primary[600]
      : isDark ? palette.streak[300] : palette.streak[700];

  return {
    active,
    inactive: colors.border,
  };
}

export function ProgressDots({ completed, total, variant }: ProgressDotsProps) {
  const { colors, isDark } = useThemeColors();

  if (total <= 0) return null;

  const cappedCompleted = Math.min(Math.max(completed, 0), total);
  const { active, inactive } = getDotColors(variant, isDark, colors);

  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < cappedCompleted;

        return (
          <View
            key={`${index}-${isActive ? 'on' : 'off'}`}
            accessibilityRole='image'
            style={[styles.dot, { backgroundColor: isActive ? active : inactive }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    borderRadius: borderRadius.full,
    height: 8,
    width: 8,
  },
});
