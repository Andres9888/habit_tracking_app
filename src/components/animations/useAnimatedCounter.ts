/**
 * useAnimatedCounter Hook
 *
 * Provides a satisfying count-up animation for numeric values.
 * Uses spring physics for a premium feel when numbers change.
 *
 * Design system: damping 18, stiffness 150 (snappy spring).
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

const COUNTER_SPRING = { damping: 18, stiffness: 150 };

/**
 * Returns an animated shared value that springs toward `target`.
 * Read `.value` inside `useAnimatedStyle` or `useDerivedValue`.
 */
export function useAnimatedCounter(target: number) {
  const animatedValue = useSharedValue(target);

  useEffect(() => {
    animatedValue.value = withSpring(target, COUNTER_SPRING);
  }, [target, animatedValue]);

  const displayValue = useDerivedValue(() =>
    Math.round(animatedValue.value)
  );

  return { animatedValue, displayValue };
}
