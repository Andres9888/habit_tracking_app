/**
 * StreakBadge Component
 * Displays the current streak with fire emoji
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { colors, milestoneColors } from '../../../theme/colors';
import { streakStyles } from '../HabitCard.streakStyles';

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
}

export const StreakBadge = memo(function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  const theme = useAppTheme();

  if (currentStreak <= 0) {
    return null;
  }

  return (
    <View style={streakStyles.streakRow}>
      <View
        style={[
          streakStyles.streakBadge,
          { backgroundColor: milestoneColors.amberLight },
        ]}
      >
        <Text style={streakStyles.streakFireIcon}>🔥</Text>
        <Text
          style={[
            streakStyles.streakText,
            { color: theme.custom.colors.warning[700] },
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
              backgroundColor:
                currentStreak >= bestStreak
                  ? milestoneColors.amberLight
                  : colors.gray[100],
              borderColor:
                currentStreak >= bestStreak
                  ? milestoneColors.amberBorder
                  : colors.border,
            },
          ]}
        >
          <Text style={streakStyles.bestStreakIcon}>🏅</Text>
          <Text
            style={[
              streakStyles.bestStreakText,
              {
                color:
                  currentStreak >= bestStreak
                    ? milestoneColors.amberText
                    : colors.gray[500],
              },
            ]}
          >
            {currentStreak >= bestStreak
              ? 'New Record!'
              : `Best: ${bestStreak}`}
          </Text>
        </View>
      )}
    </View>
  );
});
