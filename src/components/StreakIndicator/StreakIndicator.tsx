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
  7: { emoji: '⭐', label: '1 Week Strong', color: '#f59e0b' }, // amber-500
  30: { emoji: '🏆', label: 'Monthly Champion', color: '#eab308' }, // yellow-500
  100: { emoji: '💎', label: 'Legendary', color: '#8b5cf6' }, // violet-500
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
  let currentMilestone: number | null = null;
  for (const milestone of MILESTONES) {
    if (currentStreak >= milestone) {
      currentMilestone = milestone;
    }
  }

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
        accessible
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityRole='text'
        style={[styles.compactContainer, animatedStyle]}
      >
        {currentStreak === 0 ? (
          <View style={styles.zeroStreakContainer}>
            <Text
              style={[
                styles.fireEmoji,
                { color: '#a8a29e' }, // stone-400
              ]}
            >
              🌱
            </Text>
            <Text
              style={[
                styles.zeroStreakText,
                { color: '#78716c' }, // stone-500
              ]}
            >
              Ready to grow!
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
            <Text
              style={[
                styles.streakNumber,
                { color: '#1c1917' }, // stone-900
              ]}
            >
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
      accessible
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole='text'
      style={[styles.fullContainer, animatedStyle]}
    >
      {/* Current Streak */}
      <View style={styles.fullRow}>
        <View style={styles.fullStreakInfo}>
          <Text style={[styles.fireEmoji, { color: getFireColor() }]}>🔥</Text>
          {currentMilestone && (
            <Text style={styles.milestoneBadgeLarge}>
              {MILESTONE_BADGES[currentMilestone].emoji}
            </Text>
          )}
          <View style={styles.fullTextContainer}>
            <Text
              style={[
                styles.streakNumberLarge,
                { color: '#1c1917' }, // stone-900
              ]}
            >
              {currentStreak}
            </Text>
            <Text
              style={[
                styles.streakLabel,
                { color: '#57534e' }, // stone-600
              ]}
            >
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
            { backgroundColor: '#fef3c7' }, // amber-100
          ]}
        >
          <Text
            style={[
              styles.bestStreakText,
              { color: '#92400e' }, // amber-800
            ]}
          >
            🏅 Personal Best: {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      )}

      {/* Milestone Badges Legend */}
      {currentStreak > 0 && (
        <View style={styles.milestonesLegend}>
          {MILESTONES.map((milestone) => {
            const achieved = currentStreak >= milestone;
            const badge = MILESTONE_BADGES[milestone];
            return (
              <View
                key={milestone}
                style={[
                  styles.milestoneBadge,
                  {
                    backgroundColor: achieved
                      ? '#fef3c7' // amber-100
                      : '#f5f5f4', // stone-100
                    borderWidth: achieved ? 1 : 0,
                    borderColor: achieved ? '#fcd34d' : 'transparent', // amber-300
                  },
                ]}
              >
                <Text style={[
                  styles.milestoneBadgeEmoji,
                  { opacity: achieved ? 1 : 0.5 }
                ]}>
                  {badge.emoji}
                </Text>
                <Text
                  style={[
                    styles.milestoneBadgeLabel,
                    {
                      color: achieved
                        ? '#78350f' // amber-900
                        : '#a8a29e', // stone-400
                    },
                  ]}
                >
                  {milestone}d
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  compactContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  fireEmoji: {
    fontSize: 16,
  },
  // Full View Styles
  fullContainer: {
    padding: 16,
  },

  fullRow: {
    marginBottom: 12,
  },

  bestStreakContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },

  fullStreakInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  bestStreakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fullTextContainer: {
    flex: 1,
  },
  milestoneBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    paddingVertical: 6,
  },
  milestoneEmoji: {
    fontSize: 14,
    marginLeft: -2,
  },
  milestoneBadgeEmoji: {
    fontSize: 16,
  },
  zeroStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  milestoneBadgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  streakNumber: {
    fontSize: 15,
    fontWeight: '600',
  },
  milestoneBadgeLarge: {
    fontSize: 24,
    marginLeft: -4,
  },
  zeroStreakText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  milestonesLegend: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  streakLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  streakNumberLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
});

export default StreakIndicator;
