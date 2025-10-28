/**
 * StreakIndicator Component (Story 1.4)
 *
 * Displays current and best streak with milestone badges
 * Variants: Compact (for habit list), Full (for detail screen)
 *
 * Milestone Badges:
 * - 7 days: ⭐ (Star)
 * - 30 days: 🏆 (Trophy)
 * - 100 days: 💎 (Diamond)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme';

export interface StreakIndicatorProps {
  /** Current consecutive days streak */
  currentStreak: number;

  /** All-time best streak */
  bestStreak: number;

  /** Compact view for list or full view for detail */
  compact?: boolean;

  /** Callback when milestone is reached (for celebration effects) */
  onMilestone?: (streak: number) => void;

  /** Accessibility label override */
  accessibilityLabel?: string;
}

const MILESTONE_BADGES = {
  7: { emoji: '⭐', label: '7-Day Streak' },
  30: { emoji: '🏆', label: '30-Day Streak' },
  100: { emoji: '💎', label: '100-Day Streak' },
} as const;

const MILESTONES = [7, 30, 100] as const;

export function StreakIndicator({
  currentStreak,
  bestStreak,
  compact = false,
  onMilestone,
  accessibilityLabel,
}: StreakIndicatorProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  // Get the highest milestone reached
  const currentMilestone = MILESTONES.reduce<number | null>((acc, milestone) => {
    if (currentStreak >= milestone) {
      return milestone;
    }
    return acc;
  }, null);

  // Trigger animation and callback when milestone changes
  useEffect(() => {
    if (currentMilestone && onMilestone) {
      onMilestone(currentMilestone);

      // Celebration animation: scale up and back
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [currentMilestone, onMilestone]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get fire emoji color based on streak
  const getFireColor = () => {
    if (currentStreak === 0) return theme.custom.colors.gray[400];
    if (currentMilestone === 100) return theme.custom.colors.info; // Diamond blue
    if (currentMilestone === 30) return theme.custom.colors.warning[500]; // Gold
    return theme.custom.colors.primary[500]; // Orange/red
  };

  // Build accessibility label
  const getAccessibilityLabel = () => {
    if (accessibilityLabel) return accessibilityLabel;

    const streakText = `${currentStreak}-day streak`;
    const bestText = bestStreak > 0 ? `, best ${bestStreak} days` : '';
    const milestoneText = currentMilestone
      ? `, ${MILESTONE_BADGES[currentMilestone].label} achieved`
      : '';

    return `${streakText}${bestText}${milestoneText}`;
  };

  if (compact) {
    return (
      <Animated.View
        style={[styles.compactContainer, animatedStyle]}
        accessible={true}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityRole="text"
      >
        {currentStreak === 0 ? (
          <View style={styles.zeroStreakContainer}>
            <Text style={[styles.fireEmoji, { color: theme.custom.colors.gray[400] }]}>
              🔥
            </Text>
            <Text style={[styles.zeroStreakText, { color: theme.custom.colors.gray[500] }]}>
              Start your streak!
            </Text>
          </View>
        ) : (
          <View style={styles.compactContent}>
            <Text style={[styles.fireEmoji, { color: getFireColor() }]}>
              🔥
            </Text>
            {currentMilestone && (
              <Text style={styles.milestoneEmoji}>
                {MILESTONE_BADGES[currentMilestone].emoji}
              </Text>
            )}
            <Text style={[styles.streakNumber, { color: theme.custom.colors.gray[900] }]}>
              {currentStreak}
            </Text>
          </View>
        )}
      </Animated.View>
    );
  }

  // Full view for detail screens
  return (
    <Animated.View
      style={[styles.fullContainer, animatedStyle]}
      accessible={true}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole="text"
    >
      {/* Current Streak */}
      <View style={styles.fullRow}>
        <View style={styles.fullStreakInfo}>
          <Text style={[styles.fireEmoji, { color: getFireColor() }]}>
            🔥
          </Text>
          {currentMilestone && (
            <Text style={styles.milestoneBadgeLarge}>
              {MILESTONE_BADGES[currentMilestone].emoji}
            </Text>
          )}
          <View style={styles.fullTextContainer}>
            <Text style={[styles.streakNumberLarge, { color: theme.custom.colors.gray[900] }]}>
              {currentStreak}
            </Text>
            <Text style={[styles.streakLabel, { color: theme.custom.colors.gray[600] }]}>
              Current Streak
            </Text>
          </View>
        </View>
      </View>

      {/* Best Streak */}
      {bestStreak > 0 && (
        <View style={[styles.bestStreakContainer, { backgroundColor: theme.custom.colors.gray[100] }]}>
          <Text style={[styles.bestStreakText, { color: theme.custom.colors.gray[700] }]}>
            Best: {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      )}

      {/* Milestone Badges Legend */}
      {currentStreak > 0 && (
        <View style={styles.milestonesLegend}>
          {MILESTONES.map((milestone) => {
            const achieved = currentStreak >= milestone;
            return (
              <View
                key={milestone}
                style={[
                  styles.milestoneBadge,
                  {
                    backgroundColor: achieved
                      ? theme.custom.colors.primary[100]
                      : theme.custom.colors.gray[100],
                  },
                ]}
              >
                <Text style={styles.milestoneBadgeEmoji}>
                  {MILESTONE_BADGES[milestone].emoji}
                </Text>
                <Text
                  style={[
                    styles.milestoneBadgeLabel,
                    {
                      color: achieved
                        ? theme.custom.colors.gray[900]
                        : theme.custom.colors.gray[500],
                    },
                  ]}
                >
                  {milestone}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Compact View Styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zeroStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fireEmoji: {
    fontSize: 16,
  },
  milestoneEmoji: {
    fontSize: 14,
    marginLeft: -2,
  },
  streakNumber: {
    fontSize: 15,
    fontWeight: '600',
  },
  zeroStreakText: {
    fontSize: 13,
    fontStyle: 'italic',
  },

  // Full View Styles
  fullContainer: {
    padding: 16,
  },
  fullRow: {
    marginBottom: 12,
  },
  fullStreakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneBadgeLarge: {
    fontSize: 24,
    marginLeft: -4,
  },
  fullTextContainer: {
    flex: 1,
  },
  streakNumberLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  bestStreakContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  bestStreakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  milestonesLegend: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  milestoneBadgeEmoji: {
    fontSize: 16,
  },
  milestoneBadgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StreakIndicator;
