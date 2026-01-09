/**
 * AnimatedContent - Wrapper for staggered content entrance
 */

import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  INITIAL_TRANSLATE_Y,
  SPRING_GENTLE,
  STAGGER_DELAY,
} from '../../constants';
import type { AnimatedContentProps } from '../types';

export function AnimatedContent({
  children,
  index,
  visible,
  reduceMotion = false,
}: AnimatedContentProps) {
  const translateY = useSharedValue(INITIAL_TRANSLATE_Y);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      translateY.value = INITIAL_TRANSLATE_Y;
      opacity.value = 0;
      return;
    }

    if (reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY + 200;

    translateY.value = withDelay(delay, withSpring(0, SPRING_GENTLE));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, [visible, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
