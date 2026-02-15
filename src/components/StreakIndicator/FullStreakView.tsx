/**
 * Full view for StreakIndicator - used in detail screens
 */

import React from 'react';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';

import type { Milestone } from './StreakIndicator.types';
import { MILESTONE_BADGES, COLORS } from './StreakIndicator.constants';
import { MilestonesLegend } from './MilestonesLegend';
import { styles } from './StreakIndicator.styles';

interface FullStreakViewProps {
  currentStreak: number;
  bestStreak: number;
  currentMilestone: Milestone | null;
  fireColor: string;
  animatedStyle: object;
  accessibilityLabel: string;
}

export function FullStreakView({
  currentStreak,
  bestStreak,
  currentMilestone,
  fireColor,
  animatedStyle,
  accessibilityLabel,
}: FullStreakViewProps) {
  return (
    <Animated.View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      style={[styles.fullContainer, animatedStyle]}
    >
      {/* Current Streak */}
      <View style={styles.fullRow}>
        <View style={styles.fullStreakInfo}>
          <Text style={[styles.fireEmoji, { color: fireColor }]}>🔥</Text>
          {currentMilestone && (
            <Text style={styles.milestoneBadgeLarge}>
              {MILESTONE_BADGES[currentMilestone].emoji}
            </Text>
          )}
          <View style={styles.fullTextContainer}>
            <Text
              style={[styles.streakNumberLarge, { color: COLORS.streakNumber }]}
            >
              {currentStreak}
            </Text>
            <Text style={[styles.streakLabel, { color: COLORS.streakLabel }]}>
              {currentStreak === 1 ? 'Day Strong' : 'Days Strong'}
            </Text>
          </View>
        </View>
      </View>

      {/* Best Streak */}
      {bestStreak > 0 && (
        <View
          style={[
            styles.bestStreakContainer,
            { backgroundColor: COLORS.bestStreakBg },
          ]}
        >
          <Text
            style={[styles.bestStreakText, { color: COLORS.bestStreakText }]}
          >
            🏅 Personal Best: {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      )}

      {/* Milestone Badges Legend */}
      {currentStreak > 0 && <MilestonesLegend currentStreak={currentStreak} />}
    </Animated.View>
  );
}
