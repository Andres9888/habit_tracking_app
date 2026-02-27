/**
 * StatCard - Individual stat display with animated counting
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useCountAnimation } from './useCountAnimation';
import type { StatCardProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StatCard({
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
  const displayValue = useCountAnimation({
    animationKey,
    delay,
    reduceMotion,
    targetValue,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 18, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 150 });
  };

  const handlePress = () => {
    triggerHaptic('tap');
    onPress?.();
  };

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${label}: ${targetValue}${suffix}`}
      accessibilityRole='button'
      className='flex-1 items-center rounded-xl bg-white p-3 shadow-sm shadow-stone-200/50'
      style={animatedStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        accessibilityElementsHidden
        className={`text-2xl font-bold ${color}`}
      >
        {displayValue}
        {suffix}
      </Text>
      <View accessibilityElementsHidden className='flex-row items-center gap-1'>
        <Text className='text-xs'>{emoji}</Text>
        <Text className='text-xs text-stone-500'>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}
