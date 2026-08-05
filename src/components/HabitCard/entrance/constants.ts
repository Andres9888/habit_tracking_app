/**
 * Entrance Animation Constants
 * Timing and configuration constants for entrance animations
 */

import { springs } from '@/theme/animations';

/**
 * Spring configuration for accent bar slide animation.
 * Uses canonical gentle preset for a stable, calm slide-in.
 */
export const ACCENT_SPRING_CONFIG = {
  ...springs.gentle,
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
