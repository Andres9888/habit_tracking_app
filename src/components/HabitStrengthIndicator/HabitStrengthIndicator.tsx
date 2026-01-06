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

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme';

// Safely import AccessibilityInfo (may not be available in all environments)
let AccessibilityInfo: any;
try {
  AccessibilityInfo = require('react-native').AccessibilityInfo;
} catch (e) {
  AccessibilityInfo = null;
}

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
  automatic: {
    description: 'Fully automatic',
    emoji: '⚡',
    label: 'Automatic',
    maxThreshold: 100,
    minThreshold: 80,
  },
  building: {
    description: 'Making progress',
    emoji: '🌿',
    label: 'Building',
    maxThreshold: 40,
    minThreshold: 20,
  },
  developing: {
    description: 'Getting stronger',
    emoji: '🌳',
    label: 'Developing',
    maxThreshold: 60,
    minThreshold: 40,
  },
  starting: {
    description: 'Just beginning',
    emoji: '🌱',
    label: 'Starting Out',
    maxThreshold: 20,
    minThreshold: 0,
  },
  strong: {
    description: 'Well-established',
    emoji: '💪',
    label: 'Strong',
    maxThreshold: 80,
    minThreshold: 60,
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
      case 'starting': {
        return theme.custom.colors.strength.starting;
      }
      case 'building': {
        return theme.custom.colors.strength.building;
      }
      case 'developing': {
        return theme.custom.colors.strength.developing;
      }
      case 'strong': {
        return theme.custom.colors.strength.strong;
      }
      case 'automatic': {
        return theme.custom.colors.strength.automatic;
      }
    }
  };

  // Track previous level to detect actual level changes
  const previousLevelRef = useRef<StrengthLevel>(level);

  // Animation values
  const progressWidth = useSharedValue(0);
  const emojiScale = useSharedValue(1);
  const emojiOpacity = useSharedValue(1);
  const emojiRotation = useSharedValue(0);

  // Animate progress bar and emoji when strength/level changes
  useEffect(() => {
    // Smooth progress bar fill
    progressWidth.value = withSpring(strength, {
      damping: 15,
      stiffness: 150,
    });

    // Detect if level actually changed (meaningful transition)
    const levelChanged = previousLevelRef.current !== level;
    previousLevelRef.current = level;

    if (levelChanged) {
      // 🌱→🌿→🌳 LEVEL-UP ANIMATION: Meaningful growth transition
      // Phase 1: Fade out + shrink old emoji (transformation begins)
      emojiOpacity.value = withTiming(0.3, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
      emojiScale.value = withTiming(0.6, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
      // Gentle wobble like a plant swaying
      emojiRotation.value = withSequence(
        withTiming(-8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 60, easing: Easing.out(Easing.ease) })
      );

      // Phase 2: Fade in + grow new emoji (emergence)
      emojiOpacity.value = withDelay(
        150,
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
      );
      emojiScale.value = withDelay(
        150,
        withSequence(
          // Grow with overshoot (blossoming)
          withSpring(1.4, { damping: 6, stiffness: 120 }),
          // Settle to final size (rooted)
          withSpring(1, { damping: 10, stiffness: 180 })
        )
      );
    } else {
      // Regular strength update: subtle pulse to acknowledge change
      emojiScale.value = withSequence(
        withTiming(1.08, { duration: 100, easing: Easing.out(Easing.ease) }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
    }
  }, [strength, level]);

  // Accessibility announcement
  useEffect(() => {
    const message = habitName
      ? `${habitName}, ${Math.round(strength)}% strength, ${config.label} level`
      : `${Math.round(strength)}% strength, ${config.label} level`;

    AccessibilityInfo?.announceForAccessibility?.(message);
  }, [strength, level, habitName]);

  // Animated styles
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
      { rotate: `${Math.round(emojiRotation.value)}deg` },
    ],
  }));

  // Compact Variant (for habit list)
  if (variant === 'compact') {
    return (
      <View
        accessible
        accessibilityLabel={`${Math.round(strength)}% strength, ${config.label}`}
        accessibilityRole='progressbar'
        style={styles.compactContainer}
      >
        <Animated.Text style={[styles.compactEmoji, emojiStyle]}>
          {config.emoji}
        </Animated.Text>

        <View
          style={[
            styles.compactBarContainer,
            { backgroundColor: theme.custom.colors.gray[200] },
          ]}
        >
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
        accessible
        accessibilityLabel={`${Math.round(strength)}% strength, ${config.label} level. ${config.description}`}
        accessibilityRole='progressbar'
        style={styles.fullContainer}
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
                  {
                    color: getStrengthColor(),
                    fontFamily: theme.custom.fontFamilies.monospace,
                  },
                ]}
              >
                {Math.round(strength)}%
              </Text>
            )}
          </View>
        )}

        <View
          style={[
            styles.fullBarContainer,
            { backgroundColor: theme.custom.colors.gray[200] },
          ]}
        >
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
  compactBar: {
    borderRadius: 2,
    height: '100%',
  },

  compactBarContainer: {
    borderRadius: 2,
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
  // Compact variant (list view)
  compactContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  compactEmoji: {
    fontSize: 16,
  },

  fullBar: {
    borderRadius: 4,
    height: '100%',
  },

  fullBarContainer: {
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  // Full variant (detail view)
  fullContainer: {
    gap: 8,
  },
  fullEmoji: {
    fontSize: 32,
  },
  fullHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  // Graph variant (premium)
  graphContainer: {
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },

  percentage: {
    minWidth: 40,
    textAlign: 'right',
  },
});

export { STRENGTH_LEVEL_CONFIG, getStrengthLevel };
