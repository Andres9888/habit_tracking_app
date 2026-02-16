/**
 * StreakBadge Component
 * Displays the current streak with fire emoji
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
import { useThemeColors } from '../../../theme/ThemeContext';
import { colors, milestoneColors } from '../../../theme/colors';
import { streakStyles } from '../HabitCard.streakStyles';

/** Design-system spring: damping 18, stiffness 150 */
const STREAK_SPRING = { damping: 18, stiffness: 150 };
const BOUNCE_SPRING = { damping: 12, stiffness: 200 };

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
}

/**
 * AnimatedStreakText — pops with a satisfying spring bounce when streak changes.
 */
function AnimatedStreakText({ children, streak }: { children: React.ReactNode; streak: number }) {
  const scale = useSharedValue(1);
  const prevStreak = useRef(streak);

  useEffect(() => {
    if (prevStreak.current !== streak && streak > 0) {
      // Bounce: overshoot then settle
      scale.value = withSequence(
        withSpring(1.15, BOUNCE_SPRING),
        withSpring(1, STREAK_SPRING)
      );
    }
    prevStreak.current = streak;
  }, [streak, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export const StreakBadge = memo(function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  const theme = useAppTheme();
  const { colors: themeColors, isDark } = useThemeColors();

  if (currentStreak <= 0) {
    return (
      <View style={streakStyles.streakRow}>
        <View
          style={[
            streakStyles.streakBadge,
            { backgroundColor: isDark ? themeColors.gray[800] : themeColors.gray[100] },
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

  // In dark mode, use a translucent amber tint so the badge doesn't look washed out
  const streakBadgeBg = isDark
    ? 'rgba(245, 158, 11, 0.15)'
    : milestoneColors.amberLight;
  const streakTextColor = isDark
    ? milestoneColors.amber
    : theme.custom.colors.warning[700];
  const bestBadgeActiveBg = isDark
    ? 'rgba(245, 158, 11, 0.15)'
    : milestoneColors.amberLight;
  const bestBadgeActiveBorder = isDark
    ? 'rgba(252, 211, 77, 0.4)'
    : milestoneColors.amberBorder;
  const bestBadgeActiveText = isDark
    ? milestoneColors.amber
    : milestoneColors.amberText;

  return (
    <View style={streakStyles.streakRow}>
      <AnimatedStreakText streak={currentStreak}>
        <View
          style={[
            streakStyles.streakBadge,
            { backgroundColor: streakBadgeBg },
          ]}
        >
          <Text style={streakStyles.streakFireIcon}>🔥</Text>
          <Text
            style={[
              streakStyles.streakText,
              { color: streakTextColor },
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
              backgroundColor:
                currentStreak >= bestStreak
                  ? bestBadgeActiveBg
                  : themeColors.gray[isDark ? 800 : 100],
              borderColor:
                currentStreak >= bestStreak
                  ? bestBadgeActiveBorder
                  : themeColors.border,
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
                    ? bestBadgeActiveText
                    : themeColors.text.secondary,
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
