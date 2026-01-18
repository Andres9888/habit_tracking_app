/**
 * StreakBadge Component
 *
 * Displays the current streak count with a flame icon.
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';

import { styles } from './StatsRow.styles';
import { getHabitColor50, formatStreakText } from './StatsRow.helpers';

const FLAME_ICON_SIZE = 14;

export interface StreakBadgeProps {
  currentStreak: number;
  habitColor: string;
}

export const StreakBadge = memo(function StreakBadge({
  currentStreak,
  habitColor,
}: StreakBadgeProps) {
  const streakBadgeBackground = getHabitColor50(habitColor);
  const streakText = formatStreakText(currentStreak);

  return (
    <View
      accessible
      accessibilityLabel={`Current streak: ${streakText}`}
      accessibilityRole='text'
      style={[styles.streakBadge, { backgroundColor: streakBadgeBackground }]}
    >
      <Flame
        color={habitColor}
        size={FLAME_ICON_SIZE}
        strokeWidth={2.5}
        testID='streak-flame-icon'
      />
      <Text style={[styles.streakText, { color: habitColor }]}>
        {streakText}
      </Text>
    </View>
  );
});
