/**
 * Interaction Animation Configurations
 *
 * Transform values for chip and CTA button interactions.
 */

/**
 * Success state pop animation
 * Scale: 0.8 → 1.1 → 1.0 with bounce (0.4s)
 */
export const POP_ANIMATION = {
  duration: 400,
  finalScale: 1,
  initialScale: 0.8,
  overshootScale: 1.1,
} as const;

/**
 * Chip interaction transforms
 */
export const CHIP_TRANSFORMS = {
  hoverScale: 1.05,
  // Hover: translateY -2px, scale 1.05
  hoverTranslateY: -2,

  // Press: scale 0.95
  pressScale: 0.95,

  // Selected state
  selectedScale: 1,
} as const;

/**
 * CTA button transforms
 */
export const CTA_TRANSFORMS = {
  // Hover: translateY -1px
  hoverTranslateY: -1,

  // Press: scale 0.98
  pressScale: 0.98,
} as const;

/**
 * CTA shimmer animation on enable transition
 * Gradient sweeps left-to-right when button becomes enabled
 */
export const CTA_SHIMMER = {
  duration: 600,
  gradientOpacity: 0.3,
} as const;

/**
 * Chip stagger entrance animation
 * Each chip fades in and slides up with a 50ms delay between each
 */
export const CHIP_STAGGER = {
  delay: 50, // ms between each chip
  duration: 400,
  translateY: 10,
} as const;
