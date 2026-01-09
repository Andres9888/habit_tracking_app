/**
 * Timing Animation Configurations
 *
 * Non-spring timing configs for fade transitions and focus effects.
 */

import { WithTimingConfig, Easing } from 'react-native-reanimated';

/**
 * Timing configs for non-spring animations
 */
export const TIMING_CONFIGS = {
  // Fade transitions
  fade: {
    duration: 150,
    easing: Easing.ease,
  } satisfies WithTimingConfig,

  // Input focus border transition
  inputFocus: {
    duration: 200,
    easing: Easing.out(Easing.ease),
  } satisfies WithTimingConfig,
} as const;
