/**
 * Compact view for StreakIndicator - used in habit lists
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Milestone } from './StreakIndicator.types';
import { MILESTONE_BADGES, COLORS } from './StreakIndicator.constants';
import { styles } from './StreakIndicator.styles';

interface CompactStreakViewProps {
  currentStreak: number;
  currentMilestone: Milestone | null;
  fireColor: string;
  animatedStyle: object;
  accessibilityLabel: string;
}

export function CompactStreakView({
  currentStreak,
  currentMilestone,
  fireColor,
  animatedStyle,
  accessibilityLabel,
}: CompactStreakViewProps) {
  return (
    <Animated.View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      style={[styles.compactContainer, animatedStyle]}
    >
      {currentStreak === 0 ? (
        <View style={styles.zeroStreakContainer}>
          <Text style={[styles.fireEmoji, { color: COLORS.zeroStreakEmoji }]}>
            🌱
          </Text>
          <Text
            style={[styles.zeroStreakText, { color: COLORS.zeroStreakText }]}
          >
            Ready to grow!
          </Text>
        </View>
      ) : (
        <View style={styles.compactContent}>
          <Text style={[styles.fireEmoji, { color: fireColor }]}>🔥</Text>
          {currentMilestone && (
            <Text style={styles.milestoneEmoji}>
              {MILESTONE_BADGES[currentMilestone].emoji}
            </Text>
          )}
          <Text style={[styles.streakNumber, { color: COLORS.streakNumber }]}>
            {currentStreak}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
