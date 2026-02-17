/**
 * TopStreakerBadge - Display for users with 30+ day streaks
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from '../LeaderboardScreen.styles';

interface TopStreakerBadgeProps {
  habitName: string;
  streak: number;
  delay?: number;
}

export function TopStreakerBadge({
  habitName,
  streak,
  delay = 0,
}: TopStreakerBadgeProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={styles.badgeCard}
    >
      <Text style={styles.badgeIcon}>🏆</Text>
      <Text style={styles.badgeTitle}>Top Streaker</Text>
      <Text style={styles.badgeSubtitle}>
        {habitName} • {streak} days
      </Text>
    </Animated.View>
  );
}
