/**
 * ContentSection - Title, streak count, and habit info for milestone celebration
 * Uses theme-aware colors for dark mode support.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { styles } from './styles';
import type { StreakMilestone } from './constants';

interface ContentSectionProps {
  milestone: StreakMilestone;
  streakDays: number;
  habitName: string;
  habitEmoji: string;
  titleAnimatedStyle: AnimatedStyle;
  contentAnimatedStyle: AnimatedStyle;
}

export function ContentSection({
  milestone,
  streakDays,
  habitName,
  habitEmoji,
  titleAnimatedStyle,
  contentAnimatedStyle,
}: ContentSectionProps) {
  const { colors } = useThemeColors();

  return (
    <>
      {/* Title */}
      <Animated.Text
        style={[styles.title, { color: colors.text.primary }, titleAnimatedStyle]}
      >
        {milestone.title}
      </Animated.Text>

      {/* Content */}
      <Animated.View style={contentAnimatedStyle}>
        {/* Streak Count */}
        <View
          style={[
            styles.streakBadge,
            { backgroundColor: colors.gray[100] },
          ]}
        >
          <Text style={[styles.streakCount, { color: milestone.color }]}>
            {streakDays}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.text.secondary }]}>
            day streak
          </Text>
        </View>

        {/* Habit Info */}
        <View style={styles.habitRow}>
          <Text style={styles.habitEmoji}>{habitEmoji}</Text>
          <Text
            numberOfLines={1}
            style={[styles.habitName, { color: colors.text.primary }]}
          >
            {habitName}
          </Text>
        </View>
      </Animated.View>
    </>
  );
}
