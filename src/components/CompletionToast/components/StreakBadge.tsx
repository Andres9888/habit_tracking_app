/**
 * StreakBadge Component
 * Displays the current streak with emoji and spring entrance animation
 */

import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { styles } from '../styles';
import { COLORS } from '../constants';
import { getStreakEmoji } from '../utils';

interface StreakBadgeProps {
  streak: number;
  onPress: () => void;
}

export function StreakBadge({ streak, onPress }: StreakBadgeProps) {
  const streakEmoji = getStreakEmoji(streak);

  return (
    <Animated.View
      entering={ZoomIn.delay(300).springify().damping(14)}
    >
      <AnimatedPressable
        accessibilityHint='Tap to dismiss'
        accessibilityLabel={`${streakEmoji} ${streak} day streak`}
        style={[styles.streakBadge, { backgroundColor: COLORS.streakBadgeBg }]}
        onPress={onPress}
      >
        <Animated.Text
          entering={FadeIn.delay(400).duration(200)}
          style={styles.streakEmoji}
        >
          {streakEmoji}
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(450).duration(200)}
          style={[styles.streakText, { color: COLORS.streakTextColor }]}
        >
          {streak}
        </Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
