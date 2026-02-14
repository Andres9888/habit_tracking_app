/**
 * Animation Timing System - Habit Tracking App
 * Standardized animation durations for consistent feel
 *
 * Based on Material Design motion principles:
 * - Quick feedback (< 150ms) for immediate responses
 * - Standard transitions (200-300ms) for UI changes
 * - Complex animations (400-600ms) for emphasis
 */

/**
 * Duration Scale
 * All values in milliseconds
 */
export const durations = {
  /**
   * Celebration duration - particles, confetti
   * Used for: milestone celebrations, achievements
   */
  celebration: 3000,

  /**
   * Complex duration - multi-step animations
   * Used for: onboarding, milestone celebrations
   */
  complex: 600,

  /**
   * Emphasis duration - draw attention
   * Used for: celebrations, complex sequences
   */
  emphasis: 400,

  /**
   * Instant feedback - button presses, checkmarks
   * Used for: toggles, immediate visual feedback
   */
  instant: 100,

  /**
   * Moderate duration - medium emphasis
   * Used for: page transitions, larger element animations
   */
  moderate: 300,

  /**
   * Progress animations - filling bars, rings
   * Used for: strength meters, progress indicators
   */
  progress: 800,

  /**
   * Quick transitions - small UI changes
   * Used for: fade in/out, scale changes, color transitions
   */
  quick: 150,

  /**
   * Standard duration - most animations
   * Used for: modal transitions, card animations, list items
   */
  standard: 200,

  /**
   * Toast/notification auto-dismiss
   * Used for: undo toasts, success messages
   */
  toast: 5000,
} as const;

/**
 * Easing Presets
 * Common easing configurations for Reanimated
 */
export const easings = {
  /**
   * Button press feedback
   */
  buttonPress: { duration: durations.instant },

  /**
   * Emphasis with longer duration
   */
  emphasis: { duration: durations.emphasis },

  /**
   * Quick response
   */
  quick: { duration: durations.quick },

  /**
   * Standard easing - smooth deceleration
   */
  standard: { duration: durations.standard },
} as const;

/**
 * Spring Presets
 * Canonical spring configurations for Reanimated.
 * Consolidated from constants/motion.ts — all consumers should
 * import springs from here (or via @/theme).
 */
export const springs = {
  /** Bottom sheet enter/exit - higher damping for stable slide */
  bottomSheet: { damping: 26, stiffness: 300 },

  /** Bouncy - playful feel for celebrations */
  bouncy: { damping: 10, stiffness: 180 },

  /** Button press feedback - snappy response with spring physics */
  button: { damping: 18, stiffness: 240 },

  /** Modal exit - fast dismissal with minimal bounce */
  exit: { damping: 26, mass: 1, stiffness: 420 },

  /** Gentle - smooth with minimal bounce */
  gentle: { damping: 20, stiffness: 100 },

  /** Gesture snap-back - instant response for direct manipulation */
  gesture: { damping: 20, mass: 1, stiffness: 450 },

  /** Subtle micro-interactions */
  micro: { damping: 15, stiffness: 400 },

  /** Organic pulse / glow */
  pulse: { damping: 12, stiffness: 250 },

  /** Sheet / Modal presentations */
  sheet: { damping: 20, stiffness: 200 },

  /** Snappy - quick response with slight bounce */
  snappy: { damping: 15, stiffness: 150 },
} as const;

export type Duration = keyof typeof durations;
export type Spring = keyof typeof springs;
