/**
 * Animation Constants
 * Centralized compatibility facade over `@/theme/animations`
 */
import { durations, springs } from '@/theme/animations';

/**
 * Migration status:
 * legacy exports below are intentionally preserved and now source canonical tokens
 * from `src/theme/animations` to prevent drift.
 */

/** Spring animation configuration - default smooth spring */
export const SPRING_CONFIG = springs.standard;

/** Default animation durations (in milliseconds) */
export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: durations.instant,
  ENTRANCE: durations.standard,
  STANDARD: durations.enter,
  SLOW: durations.emphasis,
  VERY_SLOW: durations.drift,
} as const;

/** Stagger delays for sequential animations (in milliseconds) */
export const STAGGER_DELAYS = {
  NONE: 0,
  TIGHT: 40,
  STANDARD: durations.stagger,
  GENEROUS: 100,
} as const;

/** Common animation delay sequences */
export const ANIMATION_SEQUENCES = {
  // Two-step sequence (header → content)
  HEADER: 0,
  CONTENT: STAGGER_DELAYS.STANDARD,

  // Three-step sequence (logo → header → content)
  LOGO: 0,
  HEADER_STEP2: STAGGER_DELAYS.STANDARD,
  CONTENT_STEP2: STAGGER_DELAYS.STANDARD * 2,

  // Four-step sequence (detailed animations)
  STEP_1: 0,
  STEP_2: STAGGER_DELAYS.STANDARD,
  STEP_3: STAGGER_DELAYS.STANDARD * 2,
  STEP_4: STAGGER_DELAYS.STANDARD * 3,

  // Five-step sequence
  STEP_5: STAGGER_DELAYS.STANDARD * 4,

  // Six-step sequence
  STEP_6: STAGGER_DELAYS.STANDARD * 5,

  // Analytics screen sections
  ANALYTICS_HEADER: ANIMATION_DURATIONS.STANDARD,
  ANALYTICS_OVERVIEW: ANIMATION_DURATIONS.STANDARD + STAGGER_DELAYS.STANDARD,
  ANALYTICS_CHARTS: ANIMATION_DURATIONS.STANDARD + STAGGER_DELAYS.STANDARD * 2,
  ANALYTICS_INSIGHTS:
    ANIMATION_DURATIONS.STANDARD + STAGGER_DELAYS.STANDARD * 3,
  ANALYTICS_EXPORT: ANIMATION_DURATIONS.STANDARD + STAGGER_DELAYS.STANDARD * 4,
} as const;

/** Opacity values for common animation states */
export const OPACITY_VALUES = {
  HIDDEN: 0,
  SEMI_TRANSPARENT: 0.5,
  SUBTLE: 0.7,
  VISIBLE: 1,
} as const;

/** Scale values for common animation states */
export const SCALE_VALUES = {
  TINY: 0.5,
  SMALL: 0.8,
  NORMAL: 1,
  LARGE: 1.2,
} as const;

/** Interpolation ranges for complex animations */
export const INTERPOLATION_RANGES = {
  // For 0-1 progress animations
  FULL_RANGE: [0, 1] as const,
  // For 0-1 progress with midpoint
  WITH_MIDPOINT: [0, 0.5, 1] as const,
  // For extended animations with multiple phases
  FOUR_PHASE: [0, 0.5, 1, 1.5, 2] as const,
  // For entrance→peak→exit animations
  ENTRANCE_PEAK_EXIT: [0, 0.5, 1, 1.5, 2] as const,
} as const;
