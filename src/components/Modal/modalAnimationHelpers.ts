/**
 * Modal Animation Helpers
 * Common animation utilities
 */

import { Easing } from 'react-native-reanimated';

export const fadeIn = (duration: number) => ({
  duration,
  easing: Easing.out(Easing.cubic),
});

export const fadeOut = (duration: number) => ({
  duration,
  easing: Easing.in(Easing.cubic),
});
