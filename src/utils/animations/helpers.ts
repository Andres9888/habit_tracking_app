/* eslint-disable max-lines */
/**
 * Animation Helpers
 *
 * Reusable utilities for common Reanimated animation patterns.
 * Eliminates duplication and provides consistent timing/easing across the app.
 *
 * Note: max-lines disabled - this is a utility library with many small functions
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

/**
 * Common spring configurations for consistent feel
 */
export const SPRING_CONFIGS = {
  /** Bouncy playful animation */
  bouncy: {
    damping: 10,
    stiffness: 120,
  } as WithSpringConfig,

  /** Gentle entrance animation */
  entrance: {
    damping: 15,
    stiffness: 100,
  } as WithSpringConfig,

  /** Smooth gentle spring */
  smooth: {
    damping: 20,
    stiffness: 90,
  } as WithSpringConfig,

  /** Snappy interaction feedback */
  snappy: {
    damping: 12,
    stiffness: 150,
  } as WithSpringConfig,
} as const;

/**
 * Common timing configurations
 */
export const TIMING_CONFIGS = {
  /** Quick fade in/out */
  fast: {
    duration: 200,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,
  /** Standard animation duration */
  normal: {
    duration: 300,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,
  /** Slow, deliberate animation */
  slow: {
    duration: 500,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,
} as const;

/**
 * Standard animation delays for staggered entrance
 */
export const STAGGER_DELAYS = {
  /** First element in sequence */
  first: 0,

  /** Fourth element */
  fourth: 300,

  /** Second element */
  second: 100,

  /** Third element */
  third: 200,
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
 * translateY.value = delayedSpring(0, 200, SPRING_CONFIGS.snappy);
 */
export function delayedSpring(
  toValue: number,
  delay: number = 0,
  config: WithSpringConfig = SPRING_CONFIGS.entrance
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
  config: WithSpringConfig = SPRING_CONFIGS.entrance
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
  config: WithSpringConfig = SPRING_CONFIGS.entrance
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
