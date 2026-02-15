/**
 * Reduce Motion Utilities
 *
 * Provides animation wrappers that respect the iOS "Reduce Motion" accessibility setting.
 * When reduce motion is enabled:
 * - Spring animations become instant (duration: 0)
 * - Timing animations use minimal duration
 * - Complex sequences are simplified to simple fades
 *
 * Uses reanimated's built-in `useReducedMotion()` hook which reads from
 * `UIAccessibility.isReduceMotionEnabled` on iOS.
 *
 * For layout animations (entering/exiting), reanimated v3 already defaults to
 * `ReduceMotion.System`, so those are handled automatically.
 * This module handles imperative animations (withSpring, withTiming, etc.).
 */

import {
  withSpring,
  withTiming,
  useReducedMotion,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';

/**
 * Hook that returns reduce-motion-aware animation helpers.
 *
 * When reduce motion is ON:
 * - `spring()` returns `withTiming()` with 0ms duration (instant)
 * - `timing()` returns `withTiming()` with 0ms duration (instant)
 * - `shouldAnimate` is false — use to skip decorative animations entirely
 *
 * @example
 * const { spring, timing, shouldAnimate } = useA11yAnimations();
 *
 * // Instead of: scale.value = withSpring(1, config);
 * scale.value = spring(1, config);
 *
 * // Skip decorative animations
 * if (shouldAnimate) {
 *   startConfetti();
 * }
 */
export function useA11yAnimations() {
  const reduceMotion = useReducedMotion();

  const spring = (
    toValue: number,
    config?: WithSpringConfig
  ) => {
    if (reduceMotion) {
      return withTiming(toValue, { duration: 0 });
    }
    return withSpring(toValue, config);
  };

  const timing = (
    toValue: number,
    config?: WithTimingConfig
  ) => {
    if (reduceMotion) {
      return withTiming(toValue, { duration: 0 });
    }
    return withTiming(toValue, config);
  };

  return {
    /** Whether animations should play (false when reduce motion is on) */
    shouldAnimate: !reduceMotion,
    /** Whether reduce motion is enabled */
    reduceMotion,
    /** Reduce-motion-aware spring animation */
    spring,
    /** Reduce-motion-aware timing animation */
    timing,
  };
}

/**
 * Non-hook version for use in worklets/callbacks that already have
 * a `reduceMotion` boolean from `useReducedMotion()`.
 */
export function a11ySpring(
  toValue: number,
  reduceMotion: boolean,
  config?: WithSpringConfig
) {
  'worklet';
  if (reduceMotion) {
    return withTiming(toValue, { duration: 0 });
  }
  return withSpring(toValue, config);
}

export function a11yTiming(
  toValue: number,
  reduceMotion: boolean,
  config?: WithTimingConfig
) {
  'worklet';
  if (reduceMotion) {
    return withTiming(toValue, { duration: 0 });
  }
  return withTiming(toValue, config);
}

export { useReducedMotion } from 'react-native-reanimated';
