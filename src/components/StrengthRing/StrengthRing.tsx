import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface StrengthRingProps {
  /**
   * Strength value (0-100)
   */
  strength: number;

  /**
   * Ring size variant
   * - tiny: 32px diameter (for compact habit cards)
   * - small: 48px diameter (for habit cards)
   * - medium: 72px diameter (for detail screens)
   * - large: 96px diameter (for hero displays)
   */
  size?: 'tiny' | 'small' | 'medium' | 'large';

  /**
   * Show percentage text in center of ring
   */
  showPercentage?: boolean;

  /**
   * Show level emoji in center (overrides percentage if both true)
   */
  showEmoji?: boolean;

  /**
   * Show level label below ring
   */
  showLevel?: boolean;

  /**
   * Trend indicator: 'up', 'down', 'stable', or undefined to hide
   */
  trend?: 'up' | 'down' | 'stable';

  /**
   * Weekly change percentage (shown next to percentage)
   */
  weeklyChange?: number;
}

interface LevelInfo {
  color: string;
  colorLight: string;
  emoji: string;
  label: string;
}

const LEVELS: Record<string, LevelInfo> = {
  automatic: {
    color: '#059669', // emerald-600
    colorLight: '#d1fae5', // emerald-100
    emoji: '⚡',
    label: 'Automatic',
  },
  building: {
    color: '#16a34a', // green-600
    colorLight: '#dcfce7', // green-100
    emoji: '🌿',
    label: 'Building',
  },
  developing: {
    color: '#0d9488', // teal-600
    colorLight: '#ccfbf1', // teal-100
    emoji: '🌳',
    label: 'Developing',
  },
  starting: {
    color: '#65a30d', // lime-600
    colorLight: '#ecfccb', // lime-100
    emoji: '🌱',
    label: 'Starting',
  },
  strong: {
    color: '#0891b2', // cyan-600
    colorLight: '#cffafe', // cyan-100
    emoji: '💪',
    label: 'Strong',
  },
};

const BACKGROUND_COLOR = '#e5e7eb'; // stone-200

/**
 * Get level info based on strength percentage
 */
function getLevelInfo(strength: number): LevelInfo {
  if (strength < 20) return LEVELS.starting;
  if (strength < 40) return LEVELS.building;
  if (strength < 60) return LEVELS.developing;
  if (strength < 80) return LEVELS.strong;
  return LEVELS.automatic;
}

// Size configurations
const SIZE_CONFIG = {
  large: { fontSize: 24, ringSize: 96, strokeWidth: 10 },
  medium: { fontSize: 18, ringSize: 72, strokeWidth: 8 },
  small: { fontSize: 13, ringSize: 48, strokeWidth: 5 },
  tiny: { fontSize: 10, ringSize: 32, strokeWidth: 4 },
};

/**
 * StrengthRing - Apple Watch-style ring visualization for habit strength
 *
 * Enhanced features:
 * - Multiple size variants for different contexts
 * - Dynamic level-based coloring with better contrast
 * - Level emoji display option
 * - Trend indicator support
 * - Smooth spring animation on value changes
 * - Full accessibility support
 */
export function StrengthRing({
  strength,
  size = 'small',
  showPercentage = false,
  showEmoji = false,
  showLevel = false,
  trend,
  weeklyChange,
}: StrengthRingProps) {
  // Clamp strength to 0-100 range
  const clampedStrength = Math.max(0, Math.min(100, strength));

  // Size configuration
  const config = SIZE_CONFIG[size];
  const { ringSize, strokeWidth, fontSize } = config;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Get level info for color and label
  const levelInfo = getLevelInfo(clampedStrength);

  // Track previous level to detect actual level changes
  const previousLevelRef = useRef<string>(levelInfo.label);

  // Animated values
  const animatedStrength = useSharedValue(clampedStrength);
  const emojiScale = useSharedValue(1);
  const emojiOpacity = useSharedValue(1);
  const emojiRotation = useSharedValue(0);

  // Update animated value with spring animation when strength changes
  useEffect(() => {
    animatedStrength.value = withSpring(clampedStrength, {
      damping: 15,
      mass: 1,
      overshootClamping: false,
      stiffness: 100,
    });

    // Detect if level actually changed (meaningful transition)
    const levelChanged = previousLevelRef.current !== levelInfo.label;
    previousLevelRef.current = levelInfo.label;

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
  }, [clampedStrength, levelInfo.label]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const progress = animatedStrength.value / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return {
      strokeDashoffset,
    };
  });

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      { rotate: `${emojiRotation.value}deg` },
    ],
  }));

  // Center position for the ring
  const center = ringSize / 2;

  // Trend arrow component
  const TrendArrow = () => {
    if (!trend) return null;

    const trendConfig = {
      down: { color: '#ef4444', symbol: '↓' }, // red-500
      stable: { color: '#6b7280', symbol: '→' }, // stone-500
      up: { color: '#22c55e', symbol: '↑' }, // green-500
    };

    const { symbol, color } = trendConfig[trend];

    return (
      <Text style={[styles.trendArrow, { color, fontSize: fontSize * 0.7 }]}>
        {symbol}
      </Text>
    );
  };

  return (
    <View accessible accessibilityRole="progressbar" style={styles.container}>
      {/* Accessibility label */}
      <View
        accessible
        accessibilityLabel={`${Math.round(clampedStrength)}% strength, ${levelInfo.label} level ${levelInfo.emoji}`}
        accessibilityRole="text"
      >
        {/* SVG Ring */}
        <View style={{ height: ringSize, width: ringSize }}>
          <Svg height={ringSize} width={ringSize}>
            {/* Background circle (gray track) */}
            <Circle
              cx={center}
              cy={center}
              fill="none"
              r={radius}
              stroke={BACKGROUND_COLOR}
              strokeWidth={strokeWidth}
            />

            {/* Animated progress circle */}
            <AnimatedCircle
              animatedProps={animatedProps}
              cx={center}
              cy={center}
              fill="none"
              origin={`${center}, ${center}`}
              r={radius}
              // Rotate to start at 12 o'clock (-90 degrees)
              rotation="-90"
              stroke={levelInfo.color}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            />
          </Svg>

          {/* Center content */}
          <View style={[styles.centerText, { height: ringSize, width: ringSize }]}>
            {showEmoji ? (
              <Animated.Text
                style={[styles.emojiText, { fontSize: fontSize * 1.2 }, emojiAnimatedStyle]}
              >
                {levelInfo.emoji}
              </Animated.Text>
            ) : showPercentage ? (
              <View style={styles.percentageContainer}>
                <Text
                  style={[
                    styles.percentageText,
                    { color: levelInfo.color, fontSize },
                  ]}
                >
                  {Math.round(clampedStrength)}%
                </Text>
                <TrendArrow />
              </View>
            ) : null}
          </View>
        </View>

        {/* Level label below ring */}
        {showLevel && (
          <View style={styles.levelContainer}>
            <Text style={[styles.levelEmoji, { fontSize: fontSize * 0.9 }]}>
              {levelInfo.emoji}
            </Text>
            <Text
              style={[
                styles.levelText,
                { color: levelInfo.color, fontSize: fontSize * 0.75 },
              ]}
            >
              {levelInfo.label}
            </Text>
            {weeklyChange !== undefined && weeklyChange !== 0 && (
              <Text
                style={[
                  styles.changeText,
                  {
                    color: weeklyChange > 0 ? '#22c55e' : '#ef4444',
                    fontSize: fontSize * 0.65,
                  },
                ]}
              >
                {weeklyChange > 0 ? '+' : ''}{weeklyChange}%
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  changeText: {
    fontWeight: '600',
    marginLeft: 4,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    textAlign: 'center',
  },
  levelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  levelEmoji: {
    marginRight: 2,
  },
  levelText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  percentageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '700',
  },
  trendArrow: {
    fontWeight: 'bold',
    marginLeft: 1,
  },
});
