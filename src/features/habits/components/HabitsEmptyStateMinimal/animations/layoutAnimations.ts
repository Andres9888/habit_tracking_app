/**
 * Layout Animation Configurations
 *
 * Entrance delays, keyboard layout, and error animations.
 */

/**
 * Entrance animation delays (staggered fade-in-up)
 * Each element delayed by 100ms
 */
export const ENTRANCE_DELAYS = {
  chips: 300,
  cta: 400,
  headline: 100,
  heroIcon: 0,
  input: 200,
  secondaryLinks: 500,
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
  transitionDuration: 300,
} as const;

/**
 * Error message animation configuration
 * Includes entrance animation with shake effect for emphasis
 */
export const ERROR_ANIMATION = {
  autoDismissDelay: 5000,
  entranceDuration: 300,
  shakeDistance: 8,
  shakeDuration: 500,
  shakeOscillations: 3,
} as const;
