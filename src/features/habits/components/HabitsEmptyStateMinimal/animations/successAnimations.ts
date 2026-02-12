/**
 * Success State Animation Configurations
 *
 * Animations for confetti, particle burst, progress ring, and exit transitions.
 */

/**
 * Confetti animation config for success state
 */
export const CONFETTI_CONFIG = {
  colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#FCD34D', '#F59E0B'],
  duration: 900,
  particleCount: 20,
} as const;

/**
 * Progress ring animation config for success state
 * SVG circular progress indicator around the success icon
 */
export const PROGRESS_RING = {
  circumference: 339.292,
  duration: 600,
  // matches auto-transition delay
  size: 120,
  strokeWidth: 4, // 2 * PI * 54 (radius)
} as const;

/**
 * Particle burst animation config for success state
 * 8 circular particles in radial pattern that burst outward
 */
export const PARTICLE_BURST = {
  colors: ['#10B981', '#FBBF24', '#8B5CF6', '#EC4899', '#3B82F6'],
  count: 8,
  distance: 60,
  duration: 500,
  staggerDelay: 25,
} as const;

/**
 * Tap hint pulse animation config
 * Draws attention to the "Tap anywhere to continue" text
 */
export const TAP_HINT_PULSE = {
  duration: 2000,
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
    duration: 180,
  },

  // Total duration of exit animation
  duration: 350,

  // Icon morph animation
  icon: {
    // Shrink
    duration: 280,

    // Move upward
    scale: 0.4,
    translateY: -150,
  },

  // Delay before triggering list transition
  onCompleteDelay: 150,
} as const;
