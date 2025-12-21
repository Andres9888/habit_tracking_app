/**
 * QuickStatsStrip Component
 * Displays 3 key habit metrics: streak, strength, success rate
 * Features animated counting on load with staggered timing
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  useDerivedValue,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface QuickStatsStripProps {
  currentStreak: number;
  habitStrength: number;
  onStatPress?: (statType: 'streak' | 'strength' | 'success') => void;
  successRate: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Animation constants
const ANIMATION_DURATION = 800;
const STAGGER_DELAY = 100;

interface StatCardProps {
  accessibilityHint?: string;
  animatedValue: SharedValue<number>;
  color: string;
  emoji: string;
  formatValue: (val: number) => string;
  label: string;
  onPress?: () => void;
  targetValue: number;
}

function StatCard({
  accessibilityHint,
  animatedValue,
  color,
  emoji,
  formatValue,
  label,
  onPress,
  targetValue,
}: StatCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Derive the displayed value from the animated value
  const displayValue = useDerivedValue(() => {
    return formatValue(Math.round(animatedValue.value));
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${label}: ${formatValue(targetValue)}`}
      accessibilityRole="button"
      className="flex-1 items-center rounded-xl bg-white p-3 shadow-sm shadow-stone-200/50"
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <AnimatedStatValue
        animatedValue={animatedValue}
        color={color}
        formatValue={formatValue}
      />
      <View className="flex-row items-center gap-1" accessibilityElementsHidden>
        <Text className="text-xs">{emoji}</Text>
        <Text className="text-xs text-stone-500">{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

/**
 * AnimatedStatValue - Renders the animated counting text
 * Uses ReText pattern with useDerivedValue for smooth number updates
 */
interface AnimatedStatValueProps {
  animatedValue: SharedValue<number>;
  color: string;
  formatValue: (val: number) => string;
}

function AnimatedStatValue({
  animatedValue,
  color,
  formatValue,
}: AnimatedStatValueProps) {
  const [displayText, setDisplayText] = React.useState('0');

  // Update display text when animated value changes
  useDerivedValue(() => {
    const formattedValue = formatValue(Math.round(animatedValue.value));
    runOnJS(setDisplayText)(formattedValue);
    return formattedValue;
  });

  return (
    <Text
      className={`text-2xl font-bold ${color}`}
      accessibilityElementsHidden
    >
      {displayText}
    </Text>
  );
}

export function QuickStatsStrip({
  currentStreak,
  habitStrength,
  onStatPress,
  successRate,
}: QuickStatsStripProps) {
  // Animated values for counting up effect
  const streakAnimatedValue = useSharedValue(0);
  const strengthAnimatedValue = useSharedValue(0);
  const successAnimatedValue = useSharedValue(0);

  // Track if reduce motion is enabled
  const [reduceMotion, setReduceMotion] = React.useState(false);

  // Check for reduce motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Start counting animation on mount
  useEffect(() => {
    // Convert habitStrength from 0-1 to 0-100 for animation
    const strengthPercent = Math.round(habitStrength * 100);
    const successPercent = Math.round(successRate);

    if (reduceMotion) {
      // Skip animation, set values immediately
      streakAnimatedValue.value = currentStreak;
      strengthAnimatedValue.value = strengthPercent;
      successAnimatedValue.value = successPercent;
      return;
    }

    // Animate with staggered delays
    const easing = Easing.out(Easing.cubic);

    streakAnimatedValue.value = withDelay(
      0,
      withTiming(currentStreak, { duration: ANIMATION_DURATION, easing })
    );

    strengthAnimatedValue.value = withDelay(
      STAGGER_DELAY,
      withTiming(strengthPercent, { duration: ANIMATION_DURATION, easing })
    );

    successAnimatedValue.value = withDelay(
      STAGGER_DELAY * 2,
      withTiming(successPercent, { duration: ANIMATION_DURATION, easing })
    );
  }, [currentStreak, habitStrength, successRate, reduceMotion]);

  // Format functions for each stat type
  const formatStreak = (val: number) => String(val);
  const formatPercent = (val: number) => `${val}%`;

  return (
    <View
      accessible
      accessibilityLabel="Habit statistics"
      className="flex-row gap-2"
    >
      <StatCard
        accessibilityHint="Opens streak details"
        animatedValue={streakAnimatedValue}
        color="text-orange-500"
        emoji="🔥"
        formatValue={formatStreak}
        label="streak"
        onPress={() => onStatPress?.('streak')}
        targetValue={currentStreak}
      />
      <StatCard
        accessibilityHint="Opens habit strength details"
        animatedValue={strengthAnimatedValue}
        color="text-violet-500"
        emoji="💪"
        formatValue={formatPercent}
        label="strength"
        onPress={() => onStatPress?.('strength')}
        targetValue={Math.round(habitStrength * 100)}
      />
      <StatCard
        accessibilityHint="Opens success rate details"
        animatedValue={successAnimatedValue}
        color="text-emerald-500"
        emoji="✓"
        formatValue={formatPercent}
        label="success"
        onPress={() => onStatPress?.('success')}
        targetValue={Math.round(successRate)}
      />
    </View>
  );
}

export default QuickStatsStrip;
