/**
 * StreakBadge Component
 * Displays the current streak with emoji
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
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
    <Pressable
      accessibilityHint='Tap to dismiss'
      accessibilityLabel={`${streakEmoji} ${streak} day streak`}
      accessibilityRole='button'
      style={[styles.streakBadge, { backgroundColor: COLORS.streakBadgeBg }]}
      onPress={onPress}
    >
      <Text style={styles.streakEmoji}>{streakEmoji}</Text>
      <Text style={[styles.streakText, { color: COLORS.streakTextColor }]}>
        {streak}
      </Text>
    </Pressable>
  );
}
