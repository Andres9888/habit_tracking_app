/**
 * Modal Animation Helpers
 * Common animation utilities
 */

import { enterEasing, exitEasing } from '@/theme/animations';

export const fadeIn = (duration: number) => ({
  duration,
  easing: enterEasing,
});

export const fadeOut = (duration: number) => ({
  duration,
  easing: exitEasing,
});
