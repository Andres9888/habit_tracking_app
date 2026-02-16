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
  const { colors: themeColors } = useThemeColors();

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

  return (
    <View style={streakStyles.streakRow}>
      <AnimatedStreakText streak={currentStreak}>
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
      </AnimatedStreakText>

      {/* Best Streak Badge - Shows when approaching or at personal record */}
      {bestStreak > 0 && currentStreak >= bestStreak - 2 && (
        <View
          style={[
            streakStyles.bestStreakBadge,
            {
              backgroundColor:
                currentStreak >= bestStreak
                  ? milestoneColors.amberLight
                  : themeColors.gray[100],
              borderColor:
                currentStreak >= bestStreak
                  ? milestoneColors.amberBorder
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
                    ? milestoneColors.amberText
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
