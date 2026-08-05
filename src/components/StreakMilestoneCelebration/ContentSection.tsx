/**
 * ContentSection - Title, streak count, and habit info for milestone celebration
 */

import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';
import type { StreakMilestone } from './constants';

interface ContentSectionProps {
  milestone: StreakMilestone;
  streakDays: number;
  habitName: string;
  habitEmoji: string;
  titleAnimatedStyle: AnimatedStyle<ViewStyle>;
  contentAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function ContentSection({
  milestone,
  streakDays,
  habitName,
  habitEmoji,
  titleAnimatedStyle,
  contentAnimatedStyle,
}: ContentSectionProps) {
  return (
    <>
      {/* Title */}
      <Animated.Text style={[styles.title, titleAnimatedStyle]}>
        {milestone.title}
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, contentAnimatedStyle]}>
        You've built an incredible habit!
      </Animated.Text>

      {/* Content */}
      <Animated.View style={contentAnimatedStyle}>
        {/* Streak Count */}
        <View style={[styles.streakBadge, { alignSelf: 'center' }]}>
          <Text style={[styles.streakCount, { color: milestone.color }]}>
            {streakDays}
          </Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>

        {/* Habit Info */}
        <View style={[styles.habitRow, { justifyContent: 'center' }]}>
          <Text style={styles.habitEmoji}>{habitEmoji}</Text>
          <Text numberOfLines={1} style={styles.habitName}>
            {habitName}
          </Text>
        </View>
      </Animated.View>
    </>
  );
}
