/** Reanimated 0.97 press-scale for panel option chips (copied from PresetButton). */
import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export function useChipPressScale() {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    'worklet';
    if (reduceMotion) return;
    scale.value = withTiming(0.97, { duration: durations.instant });
  }, [scale, reduceMotion]);

  const onPressOut = useCallback(() => {
    'worklet';
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSpring(1, springs.standard);
  }, [scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, pressProps: { onPressIn, onPressOut } };
}
