/**
 * Motion Constants
 *
 * Standardized animation timing and easing values.
 * Based on iOS design patterns for natural, responsive feel.
 *
 * @see Springs for spring-based animations
 */

import { Easing } from 'react-native';

export const Motion = {
  duration: {
    base: 150,
    emphasized: 220,
    enter: 280,
    exit: 220,
    fast: 100,
    reveal: 180,
  },
  easing: {
    inCubic: Easing.in(Easing.cubic),
    inEase: Easing.in(Easing.ease),
    outCubic: Easing.out(Easing.cubic),
    outEase: Easing.out(Easing.ease),
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
  /** Bouncy celebrations - playful feel */
  bouncy: {
    damping: 8,
    stiffness: 300,
  },

  /** Button press feedback - snappy response */
  button: {
    damping: 15,
    stiffness: 300,
  },

  /** Gentle content reveals */
  gentle: {
    damping: 28,
    mass: 1,
    stiffness: 180,
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

  /** Sheet/Modal presentations (iOS-like) - ~400-500ms organic feel */
  sheet: {
    damping: 32,
    mass: 1,
    stiffness: 180,
  },
} as const;

export default Motion;
