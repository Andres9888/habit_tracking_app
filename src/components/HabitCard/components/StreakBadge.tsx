/**
 * StreakBadge Component
 * Displays the current streak with fire emoji
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { milestoneColors } from '../../../theme/colors';
import { streakStyles } from '../HabitCard.streakStyles';
import { AnimatedStreakText, BestStreakBadge } from './StreakBadgeParts';

// Dark-mode amber tints derived from milestone palette
const DARK_AMBER_BG = `${milestoneColors.amber}26`; // amber at 15% opacity
const DARK_AMBER_BORDER = `${milestoneColors.amberBorder}66`; // amberBorder at 40% opacity

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
}

export const StreakBadge = memo(function StreakBadge({
  currentStreak,
  bestStreak,
}: StreakBadgeProps) {
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
  const streakBadgeBg = isDark ? DARK_AMBER_BG : milestoneColors.amberLight;
  const streakTextColor = isDark
    ? milestoneColors.amber
    : theme.custom.colors.warning[700];
  const bestBadgeActiveBg = isDark ? DARK_AMBER_BG : milestoneColors.amberLight;
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
          style={[streakStyles.streakBadge, { backgroundColor: streakBadgeBg }]}
        >
          <Text style={streakStyles.streakFireIcon}>🔥</Text>
          <Text style={[streakStyles.streakText, { color: streakTextColor }]}>
            {currentStreak} Day{currentStreak === 1 ? '' : 's'} Streak
          </Text>
        </View>
      </AnimatedStreakText>

      {/* Best Streak Badge — gated to genuine record moments (at/above the all-time
          best, and at least a week) so it isn't near-permanent chrome on the card. */}
      {bestStreak >= 7 && currentStreak >= bestStreak ? (
        <BestStreakBadge
          backgroundColor={
            currentStreak >= bestStreak
              ? bestBadgeActiveBg
              : themeColors.gray[isDark ? 800 : 100]
          }
          borderColor={
            currentStreak >= bestStreak
              ? bestBadgeActiveBorder
              : themeColors.border
          }
          currentStreak={currentStreak}
          textColor={
            currentStreak >= bestStreak
              ? bestBadgeActiveText
              : themeColors.text.secondary
          }
        />
      ) : null}
    </View>
  );
});
