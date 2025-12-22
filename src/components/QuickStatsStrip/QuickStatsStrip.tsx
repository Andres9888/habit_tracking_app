/**
 * QuickStatsStrip Component
 * Displays 3 key habit metrics: streak, strength, success rate
 * Features animated counting on load with staggered timing
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface QuickStatsStripProps {
  /** Key to trigger animation replay (e.g., increment when modal opens) */
  animationKey?: number;
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
  animationKey?: number;
  color: string;
  delay: number;
  emoji: string;
  label: string;
  onPress?: () => void;
  reduceMotion: boolean;
  suffix?: string;
  targetValue: number;
}

function StatCard({
  accessibilityHint,
  animationKey,
  color,
  delay,
  emoji,
  label,
  onPress,
  reduceMotion,
  suffix = '',
  targetValue,
}: StatCardProps) {
  const scale = useSharedValue(1);
  const [displayValue, setDisplayValue] = useState(targetValue);

  // Track which animationKey we last animated for, and with what final value
  const animatedForKey = useRef<string | null>(null);

  // Counting animation - triggers when we have a new animationKey AND valid targetValue
  useEffect(() => {
    // Create a unique key combining animationKey and whether we have real data
    const currentKey = `${animationKey}-${targetValue > 0}`;

    // Skip if reduce motion or no animationKey
    if (reduceMotion || animationKey === undefined) {
      setDisplayValue(targetValue);
      return;
    }

    // Skip if targetValue is 0 (waiting for data)
    if (targetValue === 0) {
      setDisplayValue(0);
      return;
    }

    // Skip if we already animated for this exact scenario
    if (animatedForKey.current === currentKey) {
      return;
    }

    // Mark this scenario as animated
    animatedForKey.current = currentKey;

    // Reset to 0 and animate
    setDisplayValue(0);

    const startTime = Date.now() + delay + 50;

    const interval = setInterval(() => {
      const now = Date.now();

      if (now < startTime) {
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Cubic ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(easedProgress * targetValue);

      setDisplayValue(currentValue);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayValue(targetValue);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [animationKey, targetValue, delay, reduceMotion, label]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
      accessibilityLabel={`${label}: ${targetValue}${suffix}`}
      accessibilityRole="button"
      className="flex-1 items-center rounded-xl bg-white p-3 shadow-sm shadow-stone-200/50"
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <Text
        className={`text-2xl font-bold ${color}`}
        accessibilityElementsHidden
      >
        {displayValue}{suffix}
      </Text>
      <View className="flex-row items-center gap-1" accessibilityElementsHidden>
        <Text className="text-xs">{emoji}</Text>
        <Text className="text-xs text-stone-500">{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

export function QuickStatsStrip({
  animationKey,
  currentStreak,
  habitStrength,
  onStatPress,
  successRate,
}: QuickStatsStripProps) {
  // Track reduce motion preference
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription?.remove();
  }, []);

  return (
    <View
      accessible
      accessibilityLabel="Habit statistics"
      className="flex-row gap-2"
    >
      <StatCard
        accessibilityHint="Opens streak details"
        animationKey={animationKey}
        color="text-orange-500"
        delay={0}
        emoji="🔥"
        label="streak"
        onPress={() => onStatPress?.('streak')}
        reduceMotion={reduceMotion}
        targetValue={currentStreak}
      />
      <StatCard
        accessibilityHint="Opens habit strength details"
        animationKey={animationKey}
        color="text-violet-500"
        delay={STAGGER_DELAY}
        emoji="💪"
        label="strength"
        onPress={() => onStatPress?.('strength')}
        reduceMotion={reduceMotion}
        suffix="%"
        targetValue={Math.round(habitStrength * 100)}
      />
      <StatCard
        accessibilityHint="Opens success rate details"
        animationKey={animationKey}
        color="text-emerald-500"
        delay={STAGGER_DELAY * 2}
        emoji="✓"
        label="success"
        onPress={() => onStatPress?.('success')}
        reduceMotion={reduceMotion}
        suffix="%"
        targetValue={Math.round(successRate)}
      />
    </View>
  );
}

export default QuickStatsStrip;
