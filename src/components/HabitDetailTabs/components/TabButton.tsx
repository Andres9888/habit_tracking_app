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
import { useFocusRing } from '../../../utils/accessibility';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TabButton({ isActive, label, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });

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
      {...focusHandlers}
      style={[animatedStyle, focusStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={{
          color: isActive ? '#ffffff' : '#78716c',
          fontSize: 13,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
