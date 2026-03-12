/**
 * Animation Helper Utilities
 * Reusable animation patterns to reduce duplication
 */

import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  SPRING_CONFIG,
  ANIMATION_DURATIONS,
  STAGGER_DELAYS,
} from '../constants/animations';

/**
 * Hook for creating a simple fade-in animation
 * @param duration Animation duration in milliseconds
 * @param delay Initial delay before animation starts
 */
export function useFadeInAnimation(
  duration = ANIMATION_DURATIONS.STANDARD,
  delay = 0
) {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const trigger = () => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  };

  return { opacity, animatedStyle, trigger };
}

/**
 * Hook for creating a fade-in + slide-up animation (common entrance pattern)
 * @param duration Animation duration in milliseconds
 * @param delay Initial delay before animation starts
 * @param translateDistance How far to translate from (in logical units, often pixels)
 */
export function useFadeInUpAnimation(
  duration = ANIMATION_DURATIONS.STANDARD,
  delay = 0,
  translateDistance = 30
) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(translateDistance);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const trigger = () => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIG));
  };

  return { opacity, translateY, animatedStyle, trigger };
}

/**
 * Hook for creating a fade-in + scale animation (common entrance pattern)
 * @param duration Animation duration in milliseconds
 * @param delay Initial delay before animation starts
 * @param fromScale Starting scale value
 */
export function useFadeInScaleAnimation(
  duration = ANIMATION_DURATIONS.STANDARD,
  delay = 0,
  fromScale = 0.5
) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(fromScale);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const trigger = () => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    scale.value = withDelay(delay, withSpring(1, SPRING_CONFIG));
  };

  return { opacity, scale, animatedStyle, trigger };
}

/**
 * Generate a sequence of staggered animation delays
 * Useful for animating multiple elements in sequence
 *
 * @param count Number of items to animate
 * @param baseDelay Starting delay
 * @param stagger Delay between each item
 * @returns Array of delays for each item
 *
 * @example
 * const delays = generateStaggerSequence(4, 0, 60);
 * // Returns [0, 60, 120, 180]
 */
export function generateStaggerSequence(
  count: number,
  baseDelay = 0,
  stagger = STAGGER_DELAYS.STANDARD
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + i * stagger);
}

/**
 * Calculate spring animation for a given damping/stiffness
 * Used when you need explicit control over spring params
 */

export const defaultAnimationDuration = ANIMATION_DURATIONS.STANDARD;
export const defaultStaggerDelay = STAGGER_DELAYS.STANDARD;

export { SPRING_CONFIG as defaultSpringConfig } from '../constants/animations';
