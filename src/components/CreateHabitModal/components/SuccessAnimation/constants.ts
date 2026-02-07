/**
 * SuccessAnimation Constants
 *
 * Configuration values for confetti and animations
 */

import { colors } from '@/theme/colors';

export const CONFETTI_COLORS = [
  '#f59e0b',
  colors.secondary[500],
  colors.primary[500],
  '#ec4899',
  '#8b5cf6',
  '#f97316',
];

export const CONFETTI_PARTICLE_COUNT = 30;

/** Animation durations in ms */
export const ANIMATION_DURATIONS = {
  backdropFadeIn: 200,
  buttonSlideUp: 200,
  cardBounce: 200,
  exitAnimation: 200,
  textFadeIn: 200,
};
