/**
 * StrengthProgressBar Component
 * Horizontal progress bar showing habit strength with level indicators
 *
 * Features:
 * - Horizontal progress bar (better visibility at low %)
 * - Level emoji showing current state
 * - Next level hint for motivation
 * - Animated fill with spring physics
 * - Color-coded by strength level
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface StrengthProgressBarProps {
  /** Strength value (0-100) */
  strength: number;
  /** Size variant */
  size?: 'compact' | 'default' | 'large';
  /** Show dividers at level thresholds */
  showDividers?: boolean;
  /** Show level emoji */
  showEmoji?: boolean;
  /** Show level label text */
  showLabel?: boolean;
  /** Show next level hint */
  showNextLevel?: boolean;
  /** Show percentage text */
  showPercentage?: boolean;
}

interface LevelConfig {
  color: string;
  colorBg: string;
  emoji: string;
  label: string;
  threshold: number;
}

const LEVELS: LevelConfig[] = [
  { color: '#65a30d', colorBg: '#ecfccb', emoji: '🌱', label: 'Starting', threshold: 0 },
  { color: '#16a34a', colorBg: '#dcfce7', emoji: '🌿', label: 'Building', threshold: 20 },
  { color: '#0d9488', colorBg: '#ccfbf1', emoji: '🌳', label: 'Developing', threshold: 40 },
  { color: '#0891b2', colorBg: '#cffafe', emoji: '💪', label: 'Strong', threshold: 60 },
  { color: '#059669', colorBg: '#d1fae5', emoji: '⚡', label: 'Automatic', threshold: 80 },
];

const getCurrentLevel = (strength: number): LevelConfig => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (strength >= LEVELS[i].threshold) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

const getNextLevel = (strength: number): LevelConfig | null => {
  for (const level of LEVELS) {
    if (strength < level.threshold) {
      return level;
    }
  }
  return null; // Already at max
};

const SIZE_CONFIG = {
  compact: { barHeight: 4, emojiContainerSize: 24, emojiSize: 18, fontSize: 11, gap: 6 },
  default: { barHeight: 6, emojiContainerSize: 28, emojiSize: 20, fontSize: 12, gap: 8 },
  large: { barHeight: 8, emojiContainerSize: 32, emojiSize: 24, fontSize: 14, gap: 8 },
};

// Threshold positions for dividers (excluding 0 and 100)
const DIVIDER_POSITIONS = [20, 40, 60, 80];

const formatStrengthPercentage = (strength: number): string => {
  return `${Math.round(strength)}%`;
};

export const StrengthProgressBar = ({
  showDividers = true,
  showEmoji = true,
  showLabel = false,
  showNextLevel = true,
  showPercentage = true,
  size = 'default',
  strength,
}: StrengthProgressBarProps) => {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const strengthLabel = formatStrengthPercentage(clampedStrength);
  const currentLevel = getCurrentLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);
  const config = SIZE_CONFIG[size];
  const reduceMotion = useReduceMotion();

  // Track previous level to detect actual level changes
  const previousLevelRef = useRef<string>(currentLevel.label);
  // Track previous strength to detect transitions to low values
  const previousStrengthRef = useRef<number>(clampedStrength);
  // Track if this is the first render to skip animations on mount
  const isFirstRenderRef = useRef(true);


  // Animation values
  const progressWidth = useSharedValue(clampedStrength);
  const emojiScale = useSharedValue(1);
  const emojiOpacity = useSharedValue(1);
  const emojiRotation = useSharedValue(0);

  useEffect(() => {
    // Skip animation on first render - just set the value directly
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      progressWidth.value = clampedStrength;
      previousStrengthRef.current = clampedStrength;
      return;
    }

    const previousStrength = previousStrengthRef.current;
    previousStrengthRef.current = clampedStrength;

    // Determine if we're transitioning to a low/empty value
    // Use smooth timing instead of spring to avoid overshoot/bounce effect
    const isEmptyingTransition = clampedStrength <= 5 && previousStrength > clampedStrength;

    // Animate progress bar changes
    if (reduceMotion) {
      // Respect accessibility: no animation, immediate value change
      progressWidth.value = clampedStrength;
    } else if (isEmptyingTransition) {
      // When emptying (going to 0 or very low), use smooth timing instead of spring
      // This prevents the bar from appearing to "fill" due to spring overshoot
      progressWidth.value = withTiming(clampedStrength, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      // Normal spring animation for other transitions (increasing or normal decreasing)
      progressWidth.value = withSpring(clampedStrength, {
        damping: 15,
        stiffness: 100,
      });
    }

    // Detect if level actually changed (meaningful transition)
    const levelChanged = previousLevelRef.current !== currentLevel.label;
    previousLevelRef.current = currentLevel.label;

    // Skip emoji animations if reduce motion is enabled
    if (reduceMotion) {
      return;
    }

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
  }, [clampedStrength, currentLevel.label, reduceMotion]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      { rotate: `${emojiRotation.value}deg` },
    ],
  }));

  const pointsToNext = nextLevel ? Math.round(nextLevel.threshold - clampedStrength) : 0;

  return (
    <View
      accessible
      accessibilityLabel={`${strengthLabel} strength, ${currentLevel.label} level`}
      accessibilityRole="progressbar"
      style={styles.container}
    >
      {/* Top row: Emoji + Bar + Percentage */}
      <View style={[styles.topRow, { gap: config.gap }]}>
        {/* Current Level Emoji */}
        {showEmoji && (
          <View
            style={[
              styles.emojiContainer,
              {
                height: config.emojiContainerSize,
                width: config.emojiContainerSize,
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.emoji,
                { fontSize: config.emojiSize },
                emojiAnimatedStyle,
              ]}
            >
              {currentLevel.emoji}
            </Animated.Text>
          </View>
        )}

        {/* Progress Bar */}
        <View
          style={[
            styles.barContainer,
            {
              backgroundColor: '#e5e7eb',
              borderRadius: config.barHeight / 2,
              height: config.barHeight,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.barFill,
              {
                backgroundColor: currentLevel.color,
                borderRadius: config.barHeight / 2,
              },
              progressAnimatedStyle,
            ]}
          />
          {/* Level dividers */}
          {showDividers &&
            DIVIDER_POSITIONS.map((position) => (
              <View
                key={position}
                style={[
                  styles.divider,
                  {
                    height: config.barHeight,
                    left: `${position}%`,
                  },
                ]}
              />
            ))}
        </View>

        {/* Percentage */}
        {showPercentage && (
          <Text
            style={[
              styles.percentage,
              { color: currentLevel.color, fontSize: config.fontSize },
            ]}
          >
            {strengthLabel}
          </Text>
        )}

        {/* Next Level Hint */}
        {showNextLevel && nextLevel && (
          <View style={styles.nextLevelContainer}>
            <Text style={[styles.arrow, { fontSize: config.fontSize }]}>→</Text>
            <Text style={[styles.nextEmoji, { fontSize: config.emojiSize * 0.85 }]}>
              {nextLevel.emoji}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom row: Label + Points to next (optional) */}
      {(showLabel || (showNextLevel && nextLevel)) && (
        <View style={[styles.bottomRow, { marginTop: config.gap / 2 }]}>
          {showLabel && (
            <Text
              style={[
                styles.label,
                { color: currentLevel.color, fontSize: config.fontSize * 0.9 },
              ]}
            >
              {currentLevel.label}
            </Text>
          )}
          {showNextLevel && nextLevel && (
            <Text
              style={[
                styles.nextHint,
                { fontSize: config.fontSize * 0.85 },
              ]}
            >
              {pointsToNext}% to {nextLevel.label}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrow: {
    color: '#9ca3af',
    marginRight: 2,
  },
  barContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    position: 'absolute',
    top: 0,
    width: 1,
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
  },
  emoji: {
    textAlign: 'center',
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
  nextEmoji: {
    opacity: 0.6,
  },
  nextHint: {
    color: '#9ca3af',
  },
  nextLevelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  percentage: {
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'right',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default StrengthProgressBar;
