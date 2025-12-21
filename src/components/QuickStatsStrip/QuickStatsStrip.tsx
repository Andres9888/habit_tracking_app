/**
 * QuickStatsStrip Component
 * Displays 3 key habit metrics: streak, strength, success rate
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface QuickStatsStripProps {
  currentStreak: number;
  habitStrength: number;
  onStatPress?: (statType: 'streak' | 'strength' | 'success') => void;
  successRate: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StatCardProps {
  accessibilityHint?: string;
  color: string;
  emoji: string;
  label: string;
  onPress?: () => void;
  value: string;
}

function StatCard({
  accessibilityHint,
  color,
  emoji,
  label,
  onPress,
  value,
}: StatCardProps) {
  const scale = useSharedValue(1);

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
      accessibilityLabel={`${label}: ${value}`}
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
        {value}
      </Text>
      <View className="flex-row items-center gap-1" accessibilityElementsHidden>
        <Text className="text-xs">{emoji}</Text>
        <Text className="text-xs text-stone-500">{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

export function QuickStatsStrip({
  currentStreak,
  habitStrength,
  onStatPress,
  successRate,
}: QuickStatsStripProps) {
  return (
    <View
      accessible
      accessibilityLabel="Habit statistics"
      className="flex-row gap-2"
    >
      <StatCard
        accessibilityHint="Opens streak details"
        color="text-orange-500"
        emoji="🔥"
        label="streak"
        onPress={() => onStatPress?.('streak')}
        value={String(currentStreak)}
      />
      <StatCard
        accessibilityHint="Opens habit strength details"
        color="text-violet-500"
        emoji="💪"
        label="strength"
        onPress={() => onStatPress?.('strength')}
        value={`${Math.round(habitStrength * 100)}%`}
      />
      <StatCard
        accessibilityHint="Opens success rate details"
        color="text-emerald-500"
        emoji="✓"
        label="success"
        onPress={() => onStatPress?.('success')}
        value={`${Math.round(successRate)}%`}
      />
    </View>
  );
}

export default QuickStatsStrip;
