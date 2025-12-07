import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface StrengthRingProps {
  /**
   * Strength value (0-100)
   */
  strength: number;

  /**
   * Ring size variant
   * - small: 40px diameter (for habit cards)
   * - medium: 64px diameter (for detail screens)
   */
  size?: 'small' | 'medium';

  /**
   * Show percentage text in center of ring
   */
  showPercentage?: boolean;

  /**
   * Show level label below ring
   */
  showLevel?: boolean;
}

interface LevelInfo {
  label: string;
  emoji: string;
  color: string;
}

const LEVELS: Record<string, LevelInfo> = {
  starting: {
    label: 'Starting',
    emoji: '🌱',
    color: '#86efac', // green-300
  },
  building: {
    label: 'Building',
    emoji: '🌿',
    color: '#4ade80', // green-400
  },
  strong: {
    label: 'Strong',
    emoji: '💪',
    color: '#22c55e', // green-500
  },
  automatic: {
    label: 'Automatic',
    emoji: '⚡',
    color: '#15803d', // green-700
  },
};

const BACKGROUND_COLOR = '#f3f4f6'; // gray-100

/**
 * Get level info based on strength percentage
 */
function getLevelInfo(strength: number): LevelInfo {
  if (strength < 30) return LEVELS.starting;
  if (strength < 60) return LEVELS.building;
  if (strength < 85) return LEVELS.strong;
  return LEVELS.automatic;
}

/**
 * StrengthRing - Apple Watch-style ring visualization for habit strength
 *
 * Displays habit strength as a circular progress ring with:
 * - Dynamic color based on strength level
 * - Smooth spring animation on value changes
 * - Optional percentage text in center
 * - Optional level label below
 * - Full accessibility support
 */
export function StrengthRing({
  strength,
  size = 'small',
  showPercentage = false,
  showLevel = false,
}: StrengthRingProps): JSX.Element {
  // Clamp strength to 0-100 range
  const clampedStrength = Math.max(0, Math.min(100, strength));

  // Size configuration
  const ringSize = size === 'small' ? 40 : 64;
  const strokeWidth = size === 'small' ? 4 : 6;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Get level info for color and label
  const levelInfo = getLevelInfo(clampedStrength);

  // Animated value for smooth transitions
  const animatedStrength = useSharedValue(clampedStrength);

  // Update animated value with spring animation when strength changes
  useEffect(() => {
    animatedStrength.value = withSpring(clampedStrength, {
      damping: 15,
      stiffness: 100,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    });
  }, [clampedStrength, animatedStrength]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const progress = animatedStrength.value / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return {
      strokeDashoffset,
    };
  });

  // Center position for the ring
  const center = ringSize / 2;

  return (
    <View style={styles.container} accessible={true} accessibilityRole="progressbar">
      {/* Accessibility label */}
      <View
        accessible={true}
        accessibilityLabel={`${Math.round(clampedStrength)}% strength, ${levelInfo.label} level ${levelInfo.emoji}`}
        accessibilityRole="text"
      >
        {/* SVG Ring */}
        <View style={{ width: ringSize, height: ringSize }}>
          <Svg width={ringSize} height={ringSize}>
            {/* Background circle (gray track) */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={BACKGROUND_COLOR}
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Animated progress circle */}
            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke={levelInfo.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              // Rotate to start at 12 o'clock (-90 degrees)
              rotation="-90"
              origin={`${center}, ${center}`}
              animatedProps={animatedProps}
            />
          </Svg>

          {/* Percentage text in center */}
          {showPercentage && (
            <View style={[styles.centerText, { width: ringSize, height: ringSize }]}>
              <Text
                style={[
                  styles.percentageText,
                  { fontSize: size === 'small' ? 12 : 18 },
                ]}
              >
                {Math.round(clampedStrength)}%
              </Text>
            </View>
          )}
        </View>

        {/* Level label below ring */}
        {showLevel && (
          <Text style={[styles.levelText, { fontSize: size === 'small' ? 10 : 12 }]}>
            {levelInfo.label} {levelInfo.emoji}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '600',
    color: '#374151', // gray-700
  },
  levelText: {
    marginTop: 4,
    color: '#6b7280', // gray-500
    textAlign: 'center',
    fontWeight: '500',
  },
});
