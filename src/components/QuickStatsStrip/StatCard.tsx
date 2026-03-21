/**
 * StatCard - Individual stat display with animated counting
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useCountAnimation } from './useCountAnimation';
import type { StatCardProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StatCard({
  accessibilityHint,
  animationKey,
  color,
  colorStyle,
  delay,
  emoji,
  label,
  onPress,
  reduceMotion,
  suffix = '',
  targetValue,
}: StatCardProps) {
  const { colors: themeColors } = useThemeColors();
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
    scale.value = withSpring(0.95, springs.button);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.button);
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
      className='flex-1 items-center rounded-xl p-3 shadow-sm'
      style={[animatedStyle, { backgroundColor: themeColors.card, shadowColor: themeColors.border }]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        accessibilityElementsHidden
        className={`text-2xl font-bold ${color}`}
        style={colorStyle ? { color: colorStyle } : undefined}
      >
        {displayValue}
        {suffix}
      </Text>
      <View accessibilityElementsHidden className='flex-row items-center gap-1'>
        <Text className='text-xs'>{emoji}</Text>
        <Text className='text-xs' style={{ color: themeColors.text.secondary }}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}
