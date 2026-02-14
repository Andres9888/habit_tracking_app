/**
 * StreakBadge Component
 * Displays the current streak with fire emoji
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { milestoneColors } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { streakStyles } from '../HabitCard.streakStyles';

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  const theme = useAppTheme();
  const { colors: themeColors, isDark } = useThemeColors();

  if (currentStreak <= 0) {
    return null;
  }

  const isRecord = currentStreak >= bestStreak;

  return (
    <View style={streakStyles.streakRow}>
      <View
        style={[
          streakStyles.streakBadge,
          {
            backgroundColor: isDark
              ? 'rgba(245, 158, 11, 0.15)'
              : milestoneColors.amberLight,
          },
        ]}
      >
        <Text style={streakStyles.streakFireIcon}>🔥</Text>
        <Text
          style={[
            streakStyles.streakText,
            {
              color: isDark ? '#FCD34D' : theme.custom.colors.warning[700],
            },
          ]}
        >
          {currentStreak} Day{currentStreak === 1 ? '' : 's'} Streak
        </Text>
      </View>

      {/* Best Streak Badge - Shows when approaching or at personal record */}
      {bestStreak > 0 && currentStreak >= bestStreak - 2 && (
        <View
          style={[
            streakStyles.bestStreakBadge,
            {
              backgroundColor: isRecord
                ? isDark
                  ? 'rgba(245, 158, 11, 0.15)'
                  : milestoneColors.amberLight
                : themeColors.gray[100],
              borderColor: isRecord
                ? isDark
                  ? '#92400E'
                  : milestoneColors.amberBorder
                : themeColors.border,
            },
          ]}
        >
          <Text style={streakStyles.bestStreakIcon}>🏅</Text>
          <Text
            style={[
              streakStyles.bestStreakText,
              {
                color: isRecord
                  ? isDark
                    ? '#FCD34D'
                    : milestoneColors.amberText
                  : themeColors.gray[500],
              },
            ]}
          >
            {isRecord ? 'New Record!' : `Best: ${bestStreak}`}
          </Text>
        </View>
      )}
    </View>
  );
}
