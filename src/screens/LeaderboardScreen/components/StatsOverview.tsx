/**
 * StatsOverview - Display overall leaderboard statistics
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from '../LeaderboardScreen.styles';
import type { LeaderboardStats } from '../LeaderboardScreen.types';

interface StatsOverviewProps {
  stats: LeaderboardStats;
  delay?: number;
}

export function StatsOverview({ stats, delay = 0 }: StatsOverviewProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={styles.card}
    >
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Active Streaks</Text>
        <Text style={styles.statValueHighlight}>{stats.activeStreaks}</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Average Streak</Text>
        <Text style={styles.statValue}>{stats.averageStreak} days</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Longest Ever</Text>
        <Text style={styles.statValue}>{stats.longestEverStreak} days</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Total Habits</Text>
        <Text style={styles.statValue}>{stats.totalHabits}</Text>
      </View>
    </Animated.View>
  );
}
