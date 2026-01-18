/**
 * Entrance Animation Constants
 * Timing and configuration constants for entrance animations
 */

import { Springs } from '../../../constants/motion';

/**
 * Spring configuration for accent bar slide animation.
 */
export const ACCENT_SPRING_CONFIG = {
  ...Springs.gentle,
  damping: 24,
};

/**
 * Animation timing constants (in milliseconds).
 */
export const TIMING = {
  accentSlide: 250,
  cardFadeIn: 150,
  contentFadeIn: 300,
  fadeUp: 280,
  widthExpansion: 320,
  widthExpansionDelay: 80,
} as const;

/**
 * Target width for the accent bar (in pixels).
 */
export const ACCENT_TARGET_WIDTH = 4;
