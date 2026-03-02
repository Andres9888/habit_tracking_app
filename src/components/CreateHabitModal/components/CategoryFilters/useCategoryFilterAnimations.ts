/**
 * useCategoryFilterAnimations Hook
 * Manages entrance and press animations for category filter items
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import {
  ENTRANCE_STAGGER_DELAY,
  ENTRANCE_DURATION,
  ENTRANCE_TRANSLATE_Y,
} from './CategoryFilters.constants';

export function useCategoryFilterAnimations(index: number) {
  const reduceMotion = useReduceMotion();
  const entranceOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const entranceTranslateY = useSharedValue(
    reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y
  );
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      entranceOpacity.value = 1;
      entranceTranslateY.value = 0;
      return;
    }
    const delay = index * ENTRANCE_STAGGER_DELAY;
    entranceOpacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    entranceTranslateY.value = withDelay(
      delay,
      withSpring(0, springs.standard)
    );
    return () => {
      cancelAnimation(entranceOpacity);
      cancelAnimation(entranceTranslateY);
    };
  }, [index, reduceMotion, entranceOpacity, entranceTranslateY]);

  const entranceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceTranslateY.value }],
  }));

  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) scale.value = withTiming(0.95, { duration: 50 });
  };

  const handlePressOut = () => {
    if (!reduceMotion)
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return {
    entranceAnimatedStyle,
    handlePressIn,
    handlePressOut,
    pressAnimatedStyle,
  };
}
