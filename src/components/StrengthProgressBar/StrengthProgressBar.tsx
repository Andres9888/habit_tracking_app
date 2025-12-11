/**
 * StrengthProgressBar Component
 * Horizontal progress bar showing habit strength with level indicators
 *
 * Features:
 * - Horizontal progress bar (better visibility at low %)
 * - Level markers at 20%, 40%, 60%, 80%
 * - Next level hint for motivation
 * - Animated fill with spring physics
 * - Color-coded by strength level
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export interface StrengthProgressBarProps {
  /** Strength value (0-100) */
  strength: number;
  /** Size variant */
  size?: 'compact' | 'default' | 'large';
  /** Show percentage text */
  showPercentage?: boolean;
  /** Show next level hint */
  showNextLevel?: boolean;
  /** Show level label text */
  showLabel?: boolean;
  /** Show level markers on bar */
  showMarkers?: boolean;
}

interface LevelConfig {
  color: string;
  colorBg: string;
  colorGlow: string;
  emoji: string;
  label: string;
  threshold: number;
}

const LEVELS: LevelConfig[] = [
  { color: '#65a30d', colorBg: '#ecfccb', colorGlow: '#84cc16', emoji: '🌱', label: 'Starting', threshold: 0 },
  { color: '#16a34a', colorBg: '#dcfce7', colorGlow: '#22c55e', emoji: '🌿', label: 'Building', threshold: 20 },
  { color: '#0d9488', colorBg: '#ccfbf1', colorGlow: '#14b8a6', emoji: '🌳', label: 'Developing', threshold: 40 },
  { color: '#0891b2', colorBg: '#cffafe', colorGlow: '#06b6d4', emoji: '💪', label: 'Strong', threshold: 60 },
  { color: '#059669', colorBg: '#d1fae5', colorGlow: '#10b981', emoji: '⚡', label: 'Automatic', threshold: 80 },
];

// Level thresholds for markers (skip 0 and 100)
const MARKER_THRESHOLDS = [20, 40, 60, 80];

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
  compact: { barHeight: 6, fontSize: 11, gap: 4 },
  default: { barHeight: 8, fontSize: 12, gap: 6 },
  large: { barHeight: 10, fontSize: 14, gap: 8 },
};

export const StrengthProgressBar = ({
  strength,
  size = 'default',
  showPercentage = true,
  showNextLevel = true,
  showLabel = false,
  showMarkers = true,
}: StrengthProgressBarProps) => {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const currentLevel = getCurrentLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);
  const config = SIZE_CONFIG[size];

  const pointsToNext = nextLevel ? nextLevel.threshold - clampedStrength : 0;

  // Animation values
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(clampedStrength, {
      damping: 15,
      stiffness: 100,
    });
  }, [clampedStrength]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View
      accessible
      accessibilityLabel={`${Math.round(clampedStrength)}% strength, ${currentLevel.label} level`}
      accessibilityRole="progressbar"
      style={styles.container}
    >
      {/* Top row: Bar with centered percentage */}
      <View style={styles.topRow}>
        {/* Progress Bar Container */}
        <View style={styles.barWrapper}>
          {/* Bar Background */}
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
            {/* Level Markers - simple tick marks */}
            {showMarkers && MARKER_THRESHOLDS.map((threshold) => {
              const isPassed = clampedStrength >= threshold;
              return (
                <View
                  key={threshold}
                  style={[
                    styles.marker,
                    {
                      backgroundColor: isPassed ? currentLevel.color : '#d1d5db',
                      height: config.barHeight + 4,
                      left: `${threshold}%`,
                      marginLeft: -1,
                      width: 2,
                    },
                  ]}
                />
              );
            })}

            {/* Progress Fill */}
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

            {/* Percentage centered inside bar */}
            {showPercentage && (
              <View style={styles.percentageContainer}>
                <Text
                  style={[
                    styles.percentage,
                    { color: currentLevel.color, fontSize: config.fontSize },
                  ]}
                >
                  {Math.round(clampedStrength)}%
                </Text>
              </View>
            )}
          </View>
        </View>
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
  barContainer: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
    position: 'relative',
  },
  barFill: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  barWrapper: {
    flex: 1,
    position: 'relative',
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
  },
  marker: {
    borderRadius: 1,
    position: 'absolute',
    top: -2,
    zIndex: 10,
  },
  nextHint: {
    color: '#9ca3af',
  },
  percentage: {
    fontWeight: '700',
    textAlign: 'center',
  },
  percentageContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default StrengthProgressBar;
