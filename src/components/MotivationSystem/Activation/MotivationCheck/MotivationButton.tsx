/**
 * MotivationButton Component
 *
 * Individual emoji button for motivation selection with animated feedback
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { clsx } from 'clsx';

import { SPRING_BUTTON, SPRING_BOUNCY, ACCENT_CLASSES } from './constants';
import type { MotivationButtonProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function MotivationButton({
  emoji,
  label,
  isSelected,
  onPress,
  reduceMotion = false,
  accentColor,
}: MotivationButtonProps) {
  const scale = useSharedValue(1);
  const selectionScale = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      selectionScale.value = isSelected ? 1 : 0;
    } else {
      selectionScale.value = isSelected
        ? withSequence(
            withSpring(1.15, SPRING_BOUNCY),
            withSpring(1, SPRING_BUTTON)
          )
        : withTiming(0, { duration: 150 });
    }
  }, [isSelected, reduceMotion, selectionScale]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerHaptic('tap');
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const selectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectionScale.value,
    transform: [{ scale: selectionScale.value }],
  }));

  return (
    <Pressable
      accessibilityHint={
        accentColor === 'emerald'
          ? 'Selecting this will show success visualization'
          : 'Selecting this will show failure visualization to motivate you'
      }
      accessibilityLabel={`${label} motivation level`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center'
        style={animatedStyle}
      >
        <Animated.View
          className={clsx(
            'absolute h-16 w-16 rounded-full',
            ACCENT_CLASSES[accentColor].ring
          )}
          style={selectionAnimatedStyle}
        />
        <View
          className={clsx(
            'h-16 w-16 items-center justify-center rounded-full',
            isSelected ? '' : 'bg-stone-100'
          )}
        >
          <Text className='text-4xl'>{emoji}</Text>
        </View>
        <Text
          className={clsx(
            'mt-2 text-xs',
            isSelected ? ACCENT_CLASSES[accentColor].label : 'text-stone-500'
          )}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
