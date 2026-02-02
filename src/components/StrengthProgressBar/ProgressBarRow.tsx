/**
 * ProgressBarRow - Top row containing emoji, bar, percentage, next level
 * Enhanced with gradient fill and glow effect at leading edge
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './StrengthProgressBar.styles';
import { DIVIDER_POSITIONS } from './StrengthProgressBar.constants';
import type { ProgressBarRowProps } from './ProgressBarRow.types';

/**
 * Get gradient colors for strength level
 * Creates a richer visual with gradient instead of solid fill
 */
function getGradientColors(baseColor: string): [string, string, string] {
  // Map base colors to gradient pairs (lighter to darker)
  const gradientMap: Record<string, [string, string, string]> = {
    '#ef4444': ['#fca5a5', '#ef4444', '#dc2626'], // Red (Starting)
    '#f97316': ['#fdba74', '#f97316', '#ea580c'], // Orange (Building)
    '#eab308': ['#fde047', '#eab308', '#ca8a04'], // Yellow (Developing)
    '#22c55e': ['#86efac', '#22c55e', '#16a34a'], // Green (Strong)
    '#6366f1': ['#a5b4fc', '#6366f1', '#4f46e5'], // Indigo (Automatic)
  };
  return gradientMap[baseColor] || [baseColor, baseColor, baseColor];
}

export function ProgressBarRow({
  config,
  currentLevel,
  emojiAnimatedStyle,
  nextLevel,
  progressAnimatedStyle,
  showDividers,
  showEmoji,
  showNextLevel,
  showPercentage,
  strengthLabel,
}: ProgressBarRowProps) {
  // Glow pulse animation at the leading edge
  const glowPulse = useSharedValue(0);
  
  React.useEffect(() => {
    glowPulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [glowPulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.4, 0.9]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.8, 1.2]) }],
  }));

  const gradientColors = getGradientColors(currentLevel.color);

  return (
    <View style={[styles.topRow, { gap: config.gap }]}>
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
        {/* Gradient-filled progress bar */}
        <Animated.View
          style={[
            styles.barFill,
            {
              borderRadius: config.barHeight / 2,
              overflow: 'hidden',
            },
            progressAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{ flex: 1, height: '100%' }}
          />
          {/* Glow effect at leading edge */}
          <Animated.View
            style={[
              {
                backgroundColor: 'white',
                borderRadius: config.barHeight,
                height: config.barHeight * 1.5,
                position: 'absolute',
                right: -2,
                top: -(config.barHeight * 0.25),
                width: config.barHeight * 1.5,
              },
              glowStyle,
            ]}
          />
        </Animated.View>
        {showDividers &&
          DIVIDER_POSITIONS.map((pos) => (
            <View
              key={pos}
              style={[
                styles.divider,
                { height: config.barHeight, left: `${pos}%` },
              ]}
            />
          ))}
      </View>

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

      {showNextLevel && nextLevel && (
        <View style={styles.nextLevelContainer}>
          <Text style={[styles.arrow, { fontSize: config.fontSize }]}>→</Text>
          <Text
            style={[styles.nextEmoji, { fontSize: config.emojiSize * 0.85 }]}
          >
            {nextLevel.emoji}
          </Text>
        </View>
      )}
    </View>
  );
}
