/**
 * Animation Helpers
 *
 * Reusable utilities for common Reanimated animation patterns.
 * Eliminates duplication and provides consistent timing/easing across the app.
 */

import {
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  type WithSpringConfig,
  type WithTimingConfig,
  Easing,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

/**
 * Common timing configurations
 *
 * @deprecated Prefer `durations` + `enterEasing`/`exitEasing` from
 * `@/theme/animations` directly. Retained for existing call sites; `fast`/
 * `normal` are token-backed, `slow` keeps its 500ms value pending a token.
 */
export const TIMING_CONFIGS = {
  /** Quick fade in/out */
  fast: {
    duration: durations.standard,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,
  /** Standard animation duration */
  normal: {
    duration: durations.moderate,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,
  /** Slow, deliberate animation */
  slow: {
    duration: durations.complex,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,
} as const;

/**
 * Standard animation delays for staggered entrance, derived from
 * `durations.stagger` (60ms per step, max 5 items).
 *
 * @deprecated Prefer `durations.stagger` from `@/theme/animations` directly.
 */
export const STAGGER_DELAYS = {
  /** First element in sequence */
  first: 0,

  /** Second element (stagger × 1) */
  second: durations.stagger,

  /** Third element (stagger × 2) */
  third: durations.stagger * 2,

  /** Fourth element (stagger × 3) */
  fourth: durations.stagger * 3,
} as const;

/**
 * Delayed spring animation
 *
 * @param toValue - Target value
 * @param delay - Delay before animation starts (ms)
 * @param config - Spring configuration (defaults to 'entrance')
 * @returns Animated value
 *
 * @example
 * opacity.value = delayedSpring(1, 200);
 * translateY.value = delayedSpring(0, 200, springs.gentle);
 */
export function delayedSpring(
  toValue: number,
  delay: number = 0,
  config: WithSpringConfig = springs.standard as WithSpringConfig
) {
  return withDelay(delay, withSpring(toValue, config));
}

/**
 * Delayed timing animation
 *
 * @param toValue - Target value
 * @param delay - Delay before animation starts (ms)
 * @param config - Timing configuration (defaults to 'normal')
 * @returns Animated value
 *
 * @example
 * opacity.value = delayedTiming(1, 200);
 * scale.value = delayedTiming(1.2, 100, TIMING_CONFIGS.fast);
 */
export function delayedTiming(
  toValue: number,
  delay: number = 0,
  config: WithTimingConfig = TIMING_CONFIGS.normal
) {
  return withDelay(delay, withTiming(toValue, config));
}

/**
 * Fade in animation (0 → 1)
 *
 * @param delay - Delay before animation starts (ms)
 * @param duration - Animation duration (defaults to 300ms)
 * @returns Animated value
 *
 * @example
 * opacity.value = fadeIn(200);
 */
export function fadeIn(delay: number = 0, duration: number = 300) {
  return withDelay(
    delay,
    withTiming(1, {
      duration,
      easing: Easing.out(Easing.ease),
    })
  );
}

/**
 * Fade out animation (1 → 0)
 *
 * @param delay - Delay before animation starts (ms)
 * @param duration - Animation duration (defaults to 300ms)
 * @returns Animated value
 *
 * @example
 * opacity.value = fadeOut(0, 200);
 */
export function fadeOut(delay: number = 0, duration: number = 300) {
  return withDelay(
    delay,
    withTiming(0, {
      duration,
      easing: Easing.in(Easing.ease),
    })
  );
}

/**
 * Slide up entrance animation (translate from bottom)
 *
 * @param delay - Delay before animation starts (ms)
 * @param config - Spring configuration
 * @returns Animated value
 *
 * @example
 * translateY.value = slideUp(200);
 */
export function slideUp(
  delay: number = 0,
  config: WithSpringConfig = springs.standard as WithSpringConfig
) {
  return withDelay(delay, withSpring(0, config));
}

/**
 * Scale entrance animation (from small to normal)
 *
 * @param delay - Delay before animation starts (ms)
 * @param config - Spring configuration
 * @returns Animated value
 *
 * @example
 * scale.value = scaleIn(200);
 */
export function scaleIn(
  delay: number = 0,
  config: WithSpringConfig = springs.standard as WithSpringConfig
) {
  return withDelay(delay, withSpring(1, config));
}

/**
 * Pulse animation (scale up and down)
 *
 * @param toValue - Peak scale value (e.g., 1.2)
 * @param duration - Duration of one pulse cycle (ms)
 * @returns Animated value
 *
 * @example
 * scale.value = pulse(1.2, 600);
 */
export function pulse(toValue: number, duration: number = 600) {
  return withSequence(
    withTiming(toValue, {
      duration: duration / 2,
      easing: Easing.out(Easing.ease),
    }),
    withTiming(1, {
      duration: duration / 2,
      easing: Easing.in(Easing.ease),
    })
  );
}

/**
 * Standard entrance animation (fade + slide up)
 * Returns initial values and animated values for common patterns
 *
 * @param delay - Delay before animation starts (ms)
 * @returns Object with initial and animated values
 *
 * @example
 * const { initialOpacity, initialTranslateY, animatedOpacity, animatedTranslateY } = standardEntrance(200);
 * opacity.value = animatedOpacity;
 * translateY.value = animatedTranslateY;
 */
export function standardEntrance(delay: number = 0) {
  return {
    animatedOpacity: fadeIn(delay),
    animatedTranslateY: slideUp(delay),
    initialOpacity: 0,
    initialTranslateY: 30,
  };
}
