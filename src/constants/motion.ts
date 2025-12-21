import { Easing } from 'react-native';

export const Motion = {
  duration: {
    fast: 100,
    base: 150,
    reveal: 180,
    emphasized: 220,
    enter: 280,
    exit: 220,
  },
  easing: {
    outEase: Easing.out(Easing.ease),
    inEase: Easing.in(Easing.ease),
    outCubic: Easing.out(Easing.cubic),
    inCubic: Easing.in(Easing.cubic),
  },
} as const;

/**
 * Standardized spring configurations for consistent animations across the app.
 * Based on Apple iOS patterns and refined through animation consistency audit.
 *
 * Usage:
 * - sheet: Full screen modals and sheet presentations (~400-500ms)
 * - gentle: Content reveals and subtle transitions
 * - button: Press feedback and interactive elements
 * - bouncy: Celebrations and success animations
 * - micro: Subtle micro-interactions
 * - pulse: Slow, organic pulses and glows
 */
export const Springs = {
  /** Sheet/Modal presentations (iOS-like) - ~400-500ms organic feel */
  sheet: {
    damping: 32,
    stiffness: 180,
    mass: 1.3,
  },

  /** Gentle content reveals */
  gentle: {
    damping: 28,
    stiffness: 180,
    mass: 1.2,
  },

  /** Button press feedback - snappy response */
  button: {
    damping: 15,
    stiffness: 300,
  },

  /** Bouncy celebrations - playful feel */
  bouncy: {
    damping: 8,
    stiffness: 300,
  },

  /** Subtle micro-interactions */
  micro: {
    damping: 12,
    stiffness: 180,
  },

  /** Slow, organic pulses */
  pulse: {
    damping: 12,
    stiffness: 60,
  },
} as const;

export default Motion;

