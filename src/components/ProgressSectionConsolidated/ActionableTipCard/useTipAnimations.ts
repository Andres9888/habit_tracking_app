/**
 * Animation hooks for ActionableTipCard
 */

import { useEffect, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { Springs } from '../../../constants/motion';
import { ENTRANCE_DURATION } from './constants';

export function useTipAnimations() {
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 10);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    opacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    translateY.value = withSpring(0, {
      damping: 18,
      stiffness: 120,
    });
  }, [reduceMotion, opacity, translateY]);

  const handlePressIn = useCallback(() => {
    pressScale.value = withSpring(0.98, Springs.button);
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSpring(1, Springs.button);
  }, [pressScale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: pressScale.value }],
  }));

  return { containerStyle, handlePressIn, handlePressOut };
}
