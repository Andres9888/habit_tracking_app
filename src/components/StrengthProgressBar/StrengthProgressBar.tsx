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

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

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
  const currentLevel = getCurrentLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);
  const config = SIZE_CONFIG[size];

  // Animation values
  const progressWidth = useSharedValue(0);
  const emojiScale = useSharedValue(1);

  useEffect(() => {
    progressWidth.value = withSpring(clampedStrength, {
      damping: 15,
      stiffness: 100,
    });

    // Bounce emoji on change
    emojiScale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
  }, [clampedStrength]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const pointsToNext = nextLevel ? nextLevel.threshold - clampedStrength : 0;

  return (
    <View
      accessible
      accessibilityLabel={`${Math.round(clampedStrength)}% strength, ${currentLevel.label} level`}
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
            {Math.round(clampedStrength)}%
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
