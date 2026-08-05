/**
 * BadgeSection - Animated badge/icon for streak milestone celebration
 */

import React from 'react';
import { Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';
import type { StreakMilestone } from './constants';

interface BadgeSectionProps {
  milestone: StreakMilestone;
  animatedStyle: AnimatedStyle;
}

export function BadgeSection({ milestone, animatedStyle }: BadgeSectionProps) {
  return (
    <Animated.View
      accessible
      accessibilityLabel={`${milestone.emoji} ${milestone.title}`}
      accessibilityRole="image"
      style={[
        styles.emojiBadge,
        { backgroundColor: milestone.color },
        animatedStyle,
      ]}
    >
      <Text style={styles.emoji}>{milestone.emoji}</Text>
    </Animated.View>
  );
}
