/**
 * StreakBadge Component
 * Displays the current streak with fire emoji
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { streakStyles } from '../HabitCard.streakStyles';

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  const theme = useAppTheme();

  if (currentStreak <= 0) {
    return null;
  }

  return (
    <View style={streakStyles.streakRow}>
      <View style={[streakStyles.streakBadge, { backgroundColor: '#FEF3C7' }]}>
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
                currentStreak >= bestStreak ? '#FEF9C3' : '#f5f5f4',
              borderColor: currentStreak >= bestStreak ? '#FACC15' : '#e7e5e4',
            },
          ]}
        >
          <Text style={streakStyles.bestStreakIcon}>🏅</Text>
          <Text
            style={[
              streakStyles.bestStreakText,
              {
                color: currentStreak >= bestStreak ? '#A16207' : '#6B7280',
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
}
