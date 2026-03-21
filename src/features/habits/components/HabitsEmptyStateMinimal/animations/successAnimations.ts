/**
 * Success State Animation Configurations
 *
 * Animations for confetti, particle burst, progress ring, and exit transitions.
 */

import { durations } from '@/theme/animations';
import { colors } from '@/theme/colors';

/**
 * Confetti animation config for success state
 */
export const CONFETTI_CONFIG = {
  colors: [
    colors.primary[500],
    colors.primary[400],
    colors.primary[300],
    colors.primary[100],
    colors.streak[300],
    colors.streak[500],
  ],
  duration: durations.breathing,
  particleCount: 20,
} as const;

/**
 * Progress ring animation config for success state
 * SVG circular progress indicator around the success icon
 */
export const PROGRESS_RING = {
  circumference: 339.292,
  duration: 1800,
  // matches auto-transition delay
  size: 120,
  strokeWidth: 4, // 2 * PI * 54 (radius)
} as const;

/**
 * Particle burst animation config for success state
 * 8 circular particles in radial pattern that burst outward
 */
export const PARTICLE_BURST = {
  colors: [
    colors.primary[500],
    '#FBBF24',
    '#8B5CF6',
    '#EC4899',
    colors.secondary[500],
  ],
  count: 8,
  distance: 60,
  duration: durations.progress,
  staggerDelay: 25,
} as const;

/**
 * Tap hint pulse animation config
 * Draws attention to the "Tap anywhere to continue" text
 */
export const TAP_HINT_PULSE = {
  duration: durations.drift,
  maxOpacity: 1,
  maxScale: 1.02,
  minOpacity: 0.6,
  minScale: 1,
} as const;

/**
 * Exit transition animation config for success → list transition
 * Shared element style: icon morphs up while content fades
 */
export const EXIT_TRANSITION = {
  // Content fade out (faster than icon)
  content: {
    delay: 0,
    duration: durations.enter,
  },

  // Total duration of exit animation
  duration: 500,

  // Icon morph animation
  icon: {
    // Shrink
    duration: durations.emphasis,

    // Move upward
    scale: 0.4,
    translateY: -150,
  },

  // Delay before triggering list transition
  onCompleteDelay: durations.enter,
} as const;
