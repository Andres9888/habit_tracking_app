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
import { milestoneColors } from '../../../theme/colors';
import { streakStyles } from '../HabitCard.streakStyles';
import { springs } from '@/theme/animations';
import { HapticPatterns } from '../../../utils/haptics';

// Dark-mode amber tints derived from milestone palette
const DARK_AMBER_BG = `${milestoneColors.amber}26`; // amber at 15% opacity
const DARK_AMBER_BORDER = `${milestoneColors.amberBorder}66`; // amberBorder at 40% opacity

/** Design-system spring: damping 18, stiffness 150 */
const STREAK_SPRING = springs.standard;
const BOUNCE_SPRING = springs.celebration;

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
    const isIncrement = streak > prevStreak.current;
    if (prevStreak.current !== streak && streak > 0) {
      if (isIncrement) void HapticPatterns.streak();
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
            { backgroundColor: themeColors.gray[isDark ? 200 : 100] },
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
    ? DARK_AMBER_BG
    : milestoneColors.amberLight;
  const streakTextColor = isDark
    ? milestoneColors.amber
    : theme.custom.colors.warning[700];
  const bestBadgeActiveBg = isDark
    ? DARK_AMBER_BG
    : milestoneColors.amberLight;
  const bestBadgeActiveBorder = isDark
    ? DARK_AMBER_BORDER
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

      {/* Best Streak Badge — gated to genuine record moments (at/above the all-time
          best, and at least a week) so it isn't near-permanent chrome on the card. */}
      {bestStreak >= 7 && currentStreak >= bestStreak ? <View
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
        </View> : null}
    </View>
  );
});
