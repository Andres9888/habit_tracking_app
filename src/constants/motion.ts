/**
 * Motion Constants
 *
 * Standardized animation timing and easing values.
 * Based on iOS design patterns for natural, responsive feel.
 *
 * Springs are re-exported from @/theme/animations (canonical source).
 * Motion (duration + easing) stays here because it depends on react-native Easing.
 */

import { Easing } from 'react-native';

export const Motion = {
  duration: {
    base: 150,
    emphasized: 220,
    enter: 280,
    exit: 220,
    fast: 100,
    reveal: 180,
  },
  easing: {
    inCubic: Easing.in(Easing.cubic),
    inEase: Easing.in(Easing.ease),
    outCubic: Easing.out(Easing.cubic),
    outEase: Easing.out(Easing.ease),
  },
} as const;

/**
 * Re-export springs from the canonical theme source.
 * Existing consumers can continue importing { Springs } from 'constants/motion'.
 */
export default Motion;

export { springs as Springs } from '@/theme/animations';
