/**
 * HabitsEmptyStateMinimal - Animation Configurations
 *
 * Shared spring configs and animation parameters for the minimal empty state.
 * Uses react-native-reanimated patterns consistent with app design system.
 *
 * Spring values per app patterns: damping 15-32, stiffness 180-300
 */

import { WithSpringConfig, WithTimingConfig, Easing } from 'react-native-reanimated';

/**
 * Hero icon breathing animation
 * Gentle scale: 1.0 → 1.08 → 1.0 (3s ease-in-out, infinite)
 */
export const BREATHING_ANIMATION = {
  duration: 3000,
  minScale: 1.0,
  maxScale: 1.08,
} as const;

/**
 * Success state pop animation
 * Scale: 0.8 → 1.1 → 1.0 with bounce (0.4s)
 */
export const POP_ANIMATION = {
  initialScale: 0.8,
  overshootScale: 1.1,
  finalScale: 1.0,
  duration: 400,
} as const;

/**
 * Spring configs for interactive elements
 */
export const SPRING_CONFIGS = {
  // Chip press feedback - snappy
  chipPress: {
    damping: 15,
    stiffness: 300,
  } satisfies WithSpringConfig,

  // Chip hover lift
  chipHover: {
    damping: 18,
    stiffness: 240,
  } satisfies WithSpringConfig,

  // CTA button press
  ctaPress: {
    damping: 20,
    stiffness: 280,
  } satisfies WithSpringConfig,

  // Success pop animation
  successPop: {
    damping: 10,
    stiffness: 200,
  } satisfies WithSpringConfig,

  // Default smooth spring
  smooth: {
    damping: 25,
    stiffness: 180,
  } satisfies WithSpringConfig,

  // Entrance animation spring
  entrance: {
    damping: 18,
    stiffness: 200,
  } satisfies WithSpringConfig,
} as const;

/**
 * Timing configs for non-spring animations
 */
export const TIMING_CONFIGS = {
  // Input focus border transition
  inputFocus: {
    duration: 200,
    easing: Easing.out(Easing.ease),
  } satisfies WithTimingConfig,

  // Fade transitions
  fade: {
    duration: 150,
    easing: Easing.ease,
  } satisfies WithTimingConfig,
} as const;

/**
 * Entrance animation delays (staggered fade-in-up)
 * Each element delayed by 100ms
 */
export const ENTRANCE_DELAYS = {
  heroIcon: 0,
  headline: 100,
  input: 200,
  chips: 300,
  cta: 400,
  secondaryLinks: 500,
} as const;

/**
 * Chip interaction transforms
 */
export const CHIP_TRANSFORMS = {
  // Hover: translateY -2px, scale 1.05
  hoverTranslateY: -2,
  hoverScale: 1.05,

  // Press: scale 0.95
  pressScale: 0.95,

  // Selected state
  selectedScale: 1.0,
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
 * Confetti animation config for success state
 */
export const CONFETTI_CONFIG = {
  particleCount: 20,
  duration: 1500,
  colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#FCD34D', '#F59E0B'],
} as const;

/**
 * Exit transition animation config for success → list transition
 * Shared element style: icon morphs up while content fades
 */
export const EXIT_TRANSITION = {
  // Total duration of exit animation
  duration: 500,

  // Icon morph animation
  icon: {
    translateY: -150, // Move upward
    scale: 0.4, // Shrink
    duration: 400,
  },

  // Content fade out (faster than icon)
  content: {
    duration: 250,
    delay: 0,
  },

  // Delay before triggering list transition
  onCompleteDelay: 300,
} as const;

/**
 * Spring config for exit transition
 */
export const EXIT_SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
} satisfies WithSpringConfig;

/**
 * Progress ring animation config for success state
 * SVG circular progress indicator around the success icon
 */
export const PROGRESS_RING = {
  duration: 1800, // matches auto-transition delay
  size: 120,
  strokeWidth: 4,
  circumference: 339.292, // 2 * PI * 54 (radius)
} as const;

/**
 * Particle burst animation config for success state
 * 8 circular particles in radial pattern that burst outward
 */
export const PARTICLE_BURST = {
  count: 8,
  duration: 800,
  distance: 60,
  colors: ['#10B981', '#FBBF24', '#8B5CF6', '#EC4899', '#3B82F6'],
  staggerDelay: 25,
} as const;

/**
 * Tap hint pulse animation config
 * Draws attention to the "Tap anywhere to continue" text
 */
export const TAP_HINT_PULSE = {
  duration: 2000,
  minOpacity: 0.6,
  maxOpacity: 1,
  minScale: 1,
  maxScale: 1.02,
} as const;
