/**
 * StreakBadge Component
 * Displays the current streak with fire emoji
 * Dark mode aware — badge backgrounds adapt to theme.
 */

import React, { memo, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../theme';
import { milestoneColors } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { streakStyles } from '../HabitCard.streakStyles';

/** Design-system spring: damping 18, stiffness 150 */
const STREAK_SPRING = { damping: 18, stiffness: 150 };
const BOUNCE_SPRING = { damping: 12, stiffness: 200 };

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
}

/** Dark-mode aware badge colors */
const BADGE_COLORS = {
  light: {
    streakBg: milestoneColors.amberLight,
    bestBg: '#F5F1ED',
    bestBorder: '#DDD8D2',
    bestText: '#6B6560',
  },
  dark: {
    streakBg: 'rgba(217, 119, 6, 0.15)',
    bestBg: '#1F2937',
    bestBorder: '#374151',
    bestText: '#9CA3AF',
  },
} as const;

export function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  const theme = useAppTheme();
  const { isDark } = useThemeColors();
  const palette = isDark ? BADGE_COLORS.dark : BADGE_COLORS.light;

  if (currentStreak <= 0) {
    return (
      <View style={streakStyles.streakRow}>
        <View
          style={[
            streakStyles.streakBadge,
            { backgroundColor: themeColors.gray[100] },
          ]}
        >
          <Text style={streakStyles.streakFireIcon}>💪</Text>
          <Text
            style={[
              streakStyles.streakText,
              { color: themeColors.text.secondary },
            ]}
          >
            Start a Streak!
          </Text>
        </View>
      </View>
    );
  }

  const isRecord = currentStreak >= bestStreak;

  return (
    <View style={streakStyles.streakRow}>
      <View
        style={[
          streakStyles.streakBadge,
          { backgroundColor: palette.streakBg },
        ]}
      >
        <Text style={streakStyles.streakFireIcon}>🔥</Text>
        <Text
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
      </AnimatedStreakText>

      {/* Best Streak Badge - Shows when approaching or at personal record */}
      {bestStreak > 0 && currentStreak >= bestStreak - 2 && (
        <View
          style={[
            streakStyles.bestStreakBadge,
            {
              backgroundColor: isRecord
                ? palette.streakBg
                : palette.bestBg,
              borderColor: isRecord
                ? milestoneColors.amberBorder
                : palette.bestBorder,
            },
          ]}
        >
          <Text style={streakStyles.bestStreakIcon}>🏅</Text>
          <Text
            style={[
              streakStyles.bestStreakText,
              {
                color: isRecord
                  ? milestoneColors.amberText
                  : palette.bestText,
              },
            ]}
          >
            {isRecord ? 'New Record!' : `Best: ${bestStreak}`}
          </Text>
        </View>
      )}
    </View>
  );
});
