/**
 * Animation Constants
 * Centralized animation values for consistency across the app
 *
 * Design System (locked per TOOLS.md):
 * - Animation: springify().damping(18), 280ms, 60ms stagger
 * - Border radius: 16px cards, 12px buttons
 */

/** Spring animation configuration - default smooth spring */
export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 150,
} as const;

/** Default animation durations (in milliseconds) */
export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: 100,
  ENTRANCE: 200,
  STANDARD: 280,
  SLOW: 400,
  VERY_SLOW: 2000,
} as const;

/** Stagger delays for sequential animations (in milliseconds) */
export const STAGGER_DELAYS = {
  NONE: 0,
  TIGHT: 40,
  STANDARD: 60,
  GENEROUS: 100,
} as const;

/**
 * Common animation delay sequences
 * Use with FadeInDown, FadeInUp, etc. components
 * Example: FadeInDown.delay(ANIMATION_SEQUENCES.FIRST).springify().damping(18)
 */
export const ANIMATION_SEQUENCES = {
  // Two-step sequence (header → content)
  HEADER: 0,
  CONTENT: 60,

  // Three-step sequence (logo → header → content)
  LOGO: 0,
  HEADER_STEP2: 60,
  CONTENT_STEP2: 120,

  // Four-step sequence (detailed animations)
  STEP_1: 0,
  STEP_2: 60,
  STEP_3: 120,
  STEP_4: 180,

  // Five-step sequence
  STEP_5: 240,

  // Six-step sequence
  STEP_6: 300,

  // Analytics screen sections
  ANALYTICS_HEADER: 280,
  ANALYTICS_OVERVIEW: 340,
  ANALYTICS_CHARTS: 400,
  ANALYTICS_INSIGHTS: 460,
  ANALYTICS_EXPORT: 520,
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

/**
 * @deprecated Use ANIMATION_DURATIONS and STAGGER_DELAYS instead
 * Kept for backward compatibility during migration
 */
export const MAGIC_NUMBERS = {
  // Delays from auth screens
  DELAY_50: 50,
  DELAY_110: 110,
  DELAY_170: 170,
  DELAY_200: 200,
  DELAY_220: 220,
  DELAY_240: 240,
  DELAY_280: 280,

  // Durations
  DURATION_200: 200,
  DURATION_280: 280,
  DURATION_2000: 2000,

  // Opacity/Scale
  OPACITY_0_5: 0.5,
  OPACITY_0_8: 0.8,
  SCALE_1_2: 1.2,
} as const;
