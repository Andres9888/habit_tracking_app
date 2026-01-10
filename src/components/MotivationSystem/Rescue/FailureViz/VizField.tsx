/**
 * VizField Component
 * Individual visualization field with icon and animated entrance
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import type { VizFieldProps } from './FailureViz.types';
import { SPRING_GENTLE } from './FailureViz.constants';

export function VizField({
  label,
  value,
  icon,
  index,
  reduceMotion,
}: VizFieldProps) {
  const translateX = useSharedValue(reduceMotion ? 0 : -10);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      translateX.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * 100 + 200;

    translateX.value = withDelay(delay, withSpring(0, SPRING_GENTLE));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, [reduceMotion, index, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      className='flex-row items-start gap-3 py-2'
      style={animatedStyle}
    >
      <View className='mt-0.5 h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
        {icon}
      </View>
      <View className='flex-1'>
        <Text className='text-xs font-medium text-rose-600'>{label}</Text>
        <Text className='text-sm leading-5 text-rose-800'>{value}</Text>
      </View>
    </Animated.View>
  );
}
