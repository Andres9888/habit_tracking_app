/**
 * TabButton Component
 *
 * Individual tab button with press animation for HabitDetailTabs.
 */

import React, { useCallback } from 'react';
import { Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { TabButtonProps } from '../HabitDetailTabs.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TabButton({ isActive, label, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 350 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 350 });
  }, [scale]);

  return (
    <AnimatedPressable
      accessibilityLabel={`${label} tab`}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      className='z-10 flex-1 items-center justify-center py-2.5'
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        className={`text-sm font-semibold ${
          isActive ? 'text-white' : 'text-stone-500'
        }`}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
