/**
 * useFailureVizAnimation Hook
 * Handles entry animation for the FailureViz component.
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SPRING_GENTLE } from './FailureViz.constants';

export function useFailureVizAnimation(reduceMotion: boolean) {
  const scale = useSharedValue(reduceMotion ? 1 : 0.95);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    scale.value = withSpring(1, SPRING_GENTLE);
    opacity.value = withTiming(1, { duration: 300 });
  }, [reduceMotion, scale, opacity]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
}
