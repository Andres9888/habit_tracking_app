/**
 * HabitStrengthIndicator Component
 * Based on UX Specification Section 4.2
 *
 * Variants: Compact (list), Full (detail), Graph (trend line - premium)
 * States: Starting 🌱 (0-20%), Building 🌿 (20-40%), Developing 🌳 (40-60%),
 *         Strong 💪 (60-80%), Automatic ⚡ (80-100%)
 * Animation: Progress bar fills with spring physics, emoji changes with scale bounce
 * Accessibility: Announces "Meditation habit, 65% strength, Strong level"
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme';

export type StrengthLevel =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

export type StrengthVariant = 'compact' | 'full' | 'graph';

interface HabitStrengthIndicatorProps {
  /** Strength value (0-100 scale) */
  strength: number;

  /** Optional override for strength level */
  strengthLevel?: StrengthLevel;

  /** Display variant */
  variant?: StrengthVariant;

  /** Show percentage number */
  showPercentage?: boolean;

  /** Show label text (Full variant only) */
  showLabel?: boolean;

  /** Habit name for accessibility */
  habitName?: string;

  /** Historical data for graph variant (array of strength values over time) */
  historicalData?: number[];
}

/**
 * Strength Level Configuration
 * Colors from theme/colors.ts strength levels
 */
const STRENGTH_LEVEL_CONFIG: Record<
  StrengthLevel,
  {
    emoji: string;
    label: string;
    description: string;
    minThreshold: number;
    maxThreshold: number;
  }
> = {
  starting: {
    emoji: '🌱',
    label: 'Starting Out',
    description: 'Just beginning',
    minThreshold: 0,
    maxThreshold: 20,
  },
  building: {
    emoji: '🌿',
    label: 'Building',
    description: 'Making progress',
    minThreshold: 20,
    maxThreshold: 40,
  },
  developing: {
    emoji: '🌳',
    label: 'Developing',
    description: 'Getting stronger',
    minThreshold: 40,
    maxThreshold: 60,
  },
  strong: {
    emoji: '💪',
    label: 'Strong',
    description: 'Well-established',
    minThreshold: 60,
    maxThreshold: 80,
  },
  automatic: {
    emoji: '⚡',
    label: 'Automatic',
    description: 'Fully automatic',
    minThreshold: 80,
    maxThreshold: 100,
  },
};

/**
 * Get strength level from percentage
 */
function getStrengthLevel(strength: number): StrengthLevel {
  if (strength < 20) return 'starting';
  if (strength < 40) return 'building';
  if (strength < 60) return 'developing';
  if (strength < 80) return 'strong';
  return 'automatic';
}

export default function HabitStrengthIndicator({
  strength,
  strengthLevel,
  variant = 'compact',
  showPercentage = true,
  showLabel = true,
  habitName,
  historicalData = [],
}: HabitStrengthIndicatorProps) {
  const theme = useAppTheme();
  const level = strengthLevel || getStrengthLevel(strength);
  const config = STRENGTH_LEVEL_CONFIG[level];

  // Get color from theme based on strength level
  const getStrengthColor = (): string => {
    switch (level) {
      case 'starting':
        return theme.custom.colors.strength.starting;
      case 'building':
        return theme.custom.colors.strength.building;
      case 'developing':
        return theme.custom.colors.strength.developing;
      case 'strong':
        return theme.custom.colors.strength.strong;
      case 'automatic':
        return theme.custom.colors.strength.automatic;
    }
  };

  // Animation values
  const progressWidth = useSharedValue(0);
  const emojiScale = useSharedValue(1);

  // Animate progress bar when strength changes
  useEffect(() => {
    progressWidth.value = withSpring(strength, {
      damping: 15,
      stiffness: 150,
    });

    // Emoji bounce animation when level changes (scale up then down)
    emojiScale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 100 }),
      withSpring(1.0, { damping: 15, stiffness: 150 })
    );
  }, [strength, level]);

  // Accessibility announcement
  useEffect(() => {
    const message = habitName
      ? `${habitName}, ${Math.round(strength)}% strength, ${config.label} level`
      : `${Math.round(strength)}% strength, ${config.label} level`;

    AccessibilityInfo.announceForAccessibility(message);
  }, [strength, level, habitName]);

  // Animated styles
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  // Compact Variant (for habit list)
  if (variant === 'compact') {
    return (
      <View
        style={styles.compactContainer}
        accessible={true}
        accessibilityLabel={`${Math.round(strength)}% strength, ${config.label}`}
        accessibilityRole="progressbar"
      >
        <Animated.Text style={[styles.compactEmoji, emojiStyle]}>
          {config.emoji}
        </Animated.Text>

        <View style={[styles.compactBarContainer, { backgroundColor: theme.custom.colors.gray[200] }]}>
          <Animated.View
            style={[
              styles.compactBar,
              progressBarStyle,
              { backgroundColor: getStrengthColor() },
            ]}
          />
        </View>

        {showPercentage && (
          <Text
            style={[
              theme.custom.typography.bodySmall,
              styles.percentage,
              { color: theme.custom.colors.gray[600] },
            ]}
          >
            {Math.round(strength)}%
          </Text>
        )}
      </View>
    );
  }

  // Full Variant (for habit detail)
  if (variant === 'full') {
    return (
      <View
        style={styles.fullContainer}
        accessible={true}
        accessibilityLabel={`${Math.round(strength)}% strength, ${config.label} level. ${config.description}`}
        accessibilityRole="progressbar"
      >
        {showLabel && (
          <View style={styles.fullHeader}>
            <View style={styles.fullLabelContainer}>
              <Animated.Text style={[styles.fullEmoji, emojiStyle]}>
                {config.emoji}
              </Animated.Text>
              <Text
                style={[
                  theme.custom.typography.heading3,
                  { color: theme.custom.colors.gray[900] },
                ]}
              >
                {config.label}
              </Text>
            </View>

            {showPercentage && (
              <Text
                style={[
                  theme.custom.typography.heading2,
                  { color: getStrengthColor(), fontFamily: theme.custom.fontFamilies.monospace },
                ]}
              >
                {Math.round(strength)}%
              </Text>
            )}
          </View>
        )}

        <View style={[styles.fullBarContainer, { backgroundColor: theme.custom.colors.gray[200] }]}>
          <Animated.View
            style={[
              styles.fullBar,
              progressBarStyle,
              { backgroundColor: getStrengthColor() },
            ]}
          />
        </View>

        {showLabel && (
          <Text
            style={[
              theme.custom.typography.caption,
              { color: theme.custom.colors.gray[500] },
            ]}
          >
            {config.description}
          </Text>
        )}
      </View>
    );
  }

  // Graph Variant (trend line for premium analytics)
  if (variant === 'graph') {
    // TODO: Implement graph variant with Victory Native or react-native-svg
    // For now, show a placeholder
    return (
      <View style={styles.graphContainer}>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[500] },
          ]}
        >
          Graph variant - Coming soon (Premium feature)
        </Text>
        {/* This will be implemented in Phase 7: Premium Features */}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  // Compact variant (list view)
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactEmoji: {
    fontSize: 16,
  },
  compactBarContainer: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactBar: {
    height: '100%',
    borderRadius: 2,
  },
  percentage: {
    minWidth: 40,
    textAlign: 'right',
  },

  // Full variant (detail view)
  fullContainer: {
    gap: 8,
  },
  fullHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fullLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fullEmoji: {
    fontSize: 32,
  },
  fullBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fullBar: {
    height: '100%',
    borderRadius: 4,
  },

  // Graph variant (premium)
  graphContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { STRENGTH_LEVEL_CONFIG, getStrengthLevel };
