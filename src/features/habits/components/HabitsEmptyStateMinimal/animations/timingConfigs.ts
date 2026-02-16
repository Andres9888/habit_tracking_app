/**
 * Timing Animation Configurations
 *
 * Non-spring timing configs for fade transitions and focus effects.
 * Standard duration: 280ms per design system
 */

import { WithTimingConfig, Easing } from 'react-native-reanimated';

/**
 * Timing configs for non-spring animations
 */
export const TIMING_CONFIGS = {
  // Fade transitions
  fade: {
    duration: 280,
    easing: Easing.ease,
  } satisfies WithTimingConfig,

  // Input focus border transition
  inputFocus: {
    duration: 280,
    easing: Easing.out(Easing.ease),
  } satisfies WithTimingConfig,
} as const;
