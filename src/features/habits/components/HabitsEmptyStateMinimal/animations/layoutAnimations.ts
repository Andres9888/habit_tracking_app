/**
 * Layout Animation Configurations
 *
 * Entrance delays, keyboard layout, and error animations.
 */

/**
 * Entrance animation delays (staggered fade-in-up)
 * Each element delayed by 60ms per design system
 */
export const ENTRANCE_DELAYS = {
  chips: 180,
  cta: 240,
  headline: 60,
  heroIcon: 0,
  input: 120,
  secondaryLinks: 300,
} as const;

/**
 * Keyboard-aware layout configuration
 * Compact mode activates when keyboard is visible to optimize screen real estate
 */
export const KEYBOARD_LAYOUT = {
  compactHeadlineFontSize: 20,
  compactHeroFontSize: 28,
  compactHeroSize: 60,
  topPadding: 100,
  transitionDuration: 280,
} as const;

/**
 * Error message animation configuration
 * Includes entrance animation with shake effect for emphasis
 */
export const ERROR_ANIMATION = {
  autoDismissDelay: 5000,
  entranceDuration: 280,
  shakeDistance: 8,
  shakeDuration: 500,
  shakeOscillations: 3,
} as const;
