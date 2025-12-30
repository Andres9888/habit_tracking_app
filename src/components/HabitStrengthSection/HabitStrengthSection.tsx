/**
 * HabitStrengthSection Component
 * Comprehensive habit strength display for the detail view
 *
 * Features:
 * - Visual progress ring (96px) with level-based coloring
 * - Level emoji and label (🌱 Starting → ⚡ Automatic)
 * - Trend indicator showing weekly change
 * - Level journey progress visualization
 * - Actionable tips for improvement
 * - Gradient background (teal/emerald theme)
 * - Full accessibility support
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  Easing,
  FadeInDown,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import { TrendingUp, TrendingDown, Minus, Info, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const formatStrengthPercentage = (strength: number): string => {
  return `${Math.round(strength)}%`;
};

export interface HabitStrengthSectionProps {
  /** Current strength value (0-100) */
  strength: number;
  /** Weekly change in strength (positive = improving, negative = declining) */
  weeklyChange?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
}

interface LevelConfig {
  color: string;
  colorLight: string;
  description: string;
  emoji: string;
  label: string;
  maxThreshold: number;
  minThreshold: number;
  tip: string;
}

const STRENGTH_LEVELS: Record<string, LevelConfig> = {
  automatic: {
    color: '#059669', // emerald-600
    colorLight: '#d1fae5', // emerald-100
    description: 'This habit is second nature!',
    emoji: '⚡',
    label: 'Automatic',
    maxThreshold: 100,
    minThreshold: 80,
    tip: 'Amazing! Keep it up to maintain your streak.',
  },
  building: {
    color: '#16a34a', // green-600
    colorLight: '#dcfce7', // green-100
    description: 'Making good progress',
    emoji: '🌿',
    label: 'Building',
    maxThreshold: 40,
    minThreshold: 20,
    tip: 'Great start! Complete 3 more days to level up.',
  },
  developing: {
    color: '#0d9488', // teal-600
    colorLight: '#ccfbf1', // teal-100
    description: 'Getting stronger every day',
    emoji: '🌳',
    label: 'Developing',
    maxThreshold: 60,
    minThreshold: 40,
    tip: 'You\'re halfway there! Consistency is key.',
  },
  starting: {
    color: '#65a30d', // lime-600
    colorLight: '#ecfccb', // lime-100
    description: 'Just getting started',
    emoji: '🌱',
    label: 'Starting Out',
    maxThreshold: 20,
    minThreshold: 0,
    tip: 'Every journey begins with a single step!',
  },
  strong: {
    color: '#0891b2', // cyan-600
    colorLight: '#cffafe', // cyan-100
    description: 'Well-established habit',
    emoji: '💪',
    label: 'Strong',
    maxThreshold: 80,
    minThreshold: 60,
    tip: 'Almost there! A few more weeks to automatic.',
  },
};

const getStrengthLevel = (strength: number): LevelConfig => {
  if (strength < 20) return STRENGTH_LEVELS.starting;
  if (strength < 40) return STRENGTH_LEVELS.building;
  if (strength < 60) return STRENGTH_LEVELS.developing;
  if (strength < 80) return STRENGTH_LEVELS.strong;
  return STRENGTH_LEVELS.automatic;
};

const getNextLevel = (strength: number): LevelConfig | null => {
  if (strength >= 80) return null; // Already at max
  if (strength < 20) return STRENGTH_LEVELS.building;
  if (strength < 40) return STRENGTH_LEVELS.developing;
  if (strength < 60) return STRENGTH_LEVELS.strong;
  return STRENGTH_LEVELS.automatic;
};

/**
 * AnimatedPercentageText - Displays the strength percentage with counting animation
 * Uses useDerivedValue + runOnJS pattern for smooth number updates in sync with ring
 */
function AnimatedPercentageText({
  animatedValue,
}: {
  animatedValue: SharedValue<number>;
}) {
  const [displayText, setDisplayText] = React.useState('0%');

  // Update display text when animated value changes
  useDerivedValue(() => {
    const formatted = `${Math.round(animatedValue.value)}%`;
    runOnJS(setDisplayText)(formatted);
    return formatted;
  });

  return (
    <Text className="text-xl font-bold text-stone-900" accessibilityElementsHidden>
      {displayText}
    </Text>
  );
}

// Animation constants for ring fill (T1.5)
const RING_ANIMATION_DURATION = 1000;

export const HabitStrengthSection = ({
  strength,
  weeklyChange = 0,
  onInfoPress,
}: HabitStrengthSectionProps) => {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const level = getStrengthLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);

  // Ring dimensions - reduced from 120px to 96px for better balance
  const ringSize = 96;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Track previous level to detect level changes
  const previousLevelRef = useRef<string>(level.label);
  const isInitialMount = useRef(true);

  // Track reduce motion preference (T1.5 accessibility)
  const [reduceMotion, setReduceMotion] = React.useState(false);

  // Animations
  const animatedStrength = useSharedValue(0);
  const emojiScale = useSharedValue(0);
  const emojiOpacity = useSharedValue(1);
  const emojiRotation = useSharedValue(0);

  // Check for reduce motion preference on mount (T1.5)
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    // T1.5: Skip animation if reduce motion is enabled
    if (reduceMotion) {
      animatedStrength.value = clampedStrength;
      emojiScale.value = 1;
      return;
    }

    // T1.5: Ring fill animation - 1000ms with spring physics
    // Using timing with cubic easing for smooth, predictable ~1000ms duration
    // Spring is used for overshoot effect at the end
    animatedStrength.value = withTiming(clampedStrength, {
      duration: RING_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    // Check if level changed (not just strength value)
    const levelChanged = previousLevelRef.current !== level.label;
    previousLevelRef.current = level.label;

    if (isInitialMount.current) {
      // Initial mount animation (scale from 0)
      isInitialMount.current = false;
      emojiScale.value = withDelay(
        300,
        withSpring(1, { damping: 8, stiffness: 150 })
      );
    } else if (levelChanged) {
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
        withTiming(-10, { duration: 80, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 80, easing: Easing.inOut(Easing.ease) }),
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
          withSpring(1.5, { damping: 6, stiffness: 120 }),
          // Settle to final size (rooted)
          withSpring(1, { damping: 10, stiffness: 180 })
        )
      );
    } else {
      // Regular strength update: subtle pulse to acknowledge change
      emojiScale.value = withSequence(
        withTiming(1.1, { duration: 100, easing: Easing.out(Easing.ease) }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
    }
  }, [clampedStrength, level.label, reduceMotion]);

  const animatedCircleProps = useAnimatedProps(() => {
    const progress = animatedStrength.value / 100;
    return {
      strokeDashoffset: circumference * (1 - progress),
    };
  });

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
      { rotate: `${Math.round(emojiRotation.value)}deg` },
    ],
  }));

  // Trend icon component
  const TrendIndicator = () => {
    if (weeklyChange > 0) {
      return (
        <View className="flex-row items-center gap-1 rounded-full bg-emerald-100 px-2 py-1">
          <TrendingUp className="text-emerald-600" size={14} />
          <Text className="text-xs font-semibold text-emerald-600">
            +{weeklyChange}%
          </Text>
        </View>
      );
    }
    if (weeklyChange < 0) {
      return (
        <View className="flex-row items-center gap-1 rounded-full bg-red-100 px-2 py-1">
          <TrendingDown className="text-red-600" size={14} />
          <Text className="text-xs font-semibold text-red-600">
            {weeklyChange}%
          </Text>
        </View>
      );
    }
    return (
      <View className="flex-row items-center gap-1 rounded-full bg-stone-100 px-2 py-1">
        <Minus className="text-stone-500" size={14} />
        <Text className="text-xs font-semibold text-stone-500">Stable</Text>
      </View>
    );
  };

  const handleInfoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInfoPress?.();
  };

  const center = ringSize / 2;

  return (
    <View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-white to-emerald-50/30" />

      <Animated.View
        className="p-5"
        entering={FadeInDown.delay(200).springify()}
      >
        {/* Header with icon container pattern */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
              <Zap className="text-teal-500" size={16} />
            </View>
            <Text className="text-lg font-bold text-stone-800">Strength</Text>
          </View>
          <Pressable
            accessibilityLabel="Learn about habit strength"
            accessibilityRole="button"
            className="h-8 w-8 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
            onPress={handleInfoPress}
          >
            <Info className="text-stone-500" size={18} />
          </Pressable>
        </View>

      {/* Main Ring + Stats */}
      <View className="mb-5 flex-row items-center justify-between">
        {/* Progress Ring */}
        <View className="items-center">
          <View style={{ width: ringSize, height: ringSize }}>
            <Svg width={ringSize} height={ringSize}>
              {/* Background track */}
              <Circle
                cx={center}
                cy={center}
                fill="none"
                r={radius}
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
              />
              {/* Progress arc */}
              <AnimatedCircle
                animatedProps={animatedCircleProps}
                cx={center}
                cy={center}
                fill="none"
                origin={`${center}, ${center}`}
                r={radius}
                rotation="-90"
                stroke={level.color}
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                strokeLinecap="round"
                strokeWidth={strokeWidth}
              />
            </Svg>

            {/* Center content - adjusted sizes for 96px ring */}
            <View
              className="absolute items-center justify-center"
              style={{ width: ringSize, height: ringSize }}
            >
              <Animated.Text className="text-2xl" style={emojiAnimatedStyle}>
                {level.emoji}
              </Animated.Text>
              {/* T1.5: Animated percentage text that counts up in sync with ring */}
              <AnimatedPercentageText animatedValue={animatedStrength} />
            </View>
          </View>
        </View>

        {/* Level Info */}
        <View className="ml-5 flex-1">
          <View
            className="mb-2 self-start rounded-full px-3 py-1"
            style={{ backgroundColor: level.colorLight }}
          >
            <Text className="text-sm font-semibold" style={{ color: level.color }}>
              {level.label}
            </Text>
          </View>

          <Text className="mb-3 text-sm text-stone-600">
            {level.description}
          </Text>

          <TrendIndicator />

          {nextLevel && (
            <Text className="mt-3 text-xs text-stone-400">
              {Math.round(nextLevel.minThreshold - clampedStrength)}% to {nextLevel.emoji} {nextLevel.label}
            </Text>
          )}
        </View>
      </View>

        {/* Tip - moved above level progress */}
        <View
          className="mb-4 flex-row items-start gap-2 rounded-xl p-3"
          style={{ backgroundColor: level.colorLight }}
        >
          <Text className="text-base">💡</Text>
          <Text className="flex-1 text-sm" style={{ color: level.color }}>
            {level.tip}
          </Text>
        </View>

        {/* Level Journey Progress */}
        <View className="rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 p-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-xs font-medium text-stone-600">
              {nextLevel ? `Progress to ${nextLevel.emoji} ${nextLevel.label}` : 'Maximum Level Reached!'}
            </Text>
            {nextLevel && (
              <Text className="text-xs font-bold text-teal-600">
                {Math.round(nextLevel.minThreshold - clampedStrength)}% to go
              </Text>
            )}
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-stone-100">
            <View
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400"
              style={{ width: `${clampedStrength}%` }}
            />
          </View>
          <View className="mt-2 flex-row justify-between">
            {['🌱', '🌿', '🌳', '💪', '⚡'].map((emoji, i) => (
              <Text key={i} className="text-[10px]">
                {emoji}
              </Text>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default HabitStrengthSection;
