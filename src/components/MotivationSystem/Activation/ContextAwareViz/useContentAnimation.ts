/**
 * useContentAnimation - Hook for visualization content entrance animation
 */

import { useEffect } from 'react';

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { VizType } from './types';
import { SPRING_GENTLE } from './constants';

interface UseContentAnimationProps {
  type: VizType;
  reduceMotion: boolean;
}

export function useContentAnimation({
  type,
  reduceMotion,
}: UseContentAnimationProps) {
  const scale = useSharedValue(reduceMotion ? 1 : 0.9);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    scale.value = withSpring(1, SPRING_GENTLE);
    opacity.value = withTiming(1, { duration: 300 });
  }, [reduceMotion, scale, opacity, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle };
}
