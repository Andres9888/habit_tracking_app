/**
 * HabitsEmptyStateMinimal - Animation Configurations
 *
 * Shared spring configs and animation parameters for the minimal empty state.
 * Uses react-native-reanimated patterns consistent with app design system.
 *
 * Spring values per app patterns: damping 15-32, stiffness 180-300
 */

import {
  WithSpringConfig,
  WithTimingConfig,
  Easing,
} from 'react-native-reanimated';

/**
 * Hero icon breathing animation
 * Gentle scale: 1.0 → 1.08 → 1.0 (3s ease-in-out, infinite)
 */
export const BREATHING_ANIMATION = {
  duration: 3000,
  maxScale: 1.08,
  minScale: 1,
} as const;

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
 * Spring configs for interactive elements
 */
export const SPRING_CONFIGS = {
  // Chip hover lift
  chipHover: {
    damping: 18,
    stiffness: 240,
  } satisfies WithSpringConfig,

  // Chip press feedback - snappy
  chipPress: {
    damping: 15,
    stiffness: 300,
  } satisfies WithSpringConfig,

  // CTA button press
  ctaPress: {
    damping: 20,
    stiffness: 280,
  } satisfies WithSpringConfig,

  // Entrance animation spring
  entrance: {
    damping: 18,
    stiffness: 200,
  } satisfies WithSpringConfig,

  // Default smooth spring
  smooth: {
    damping: 25,
    stiffness: 180,
  } satisfies WithSpringConfig,

  // Success pop animation
  successPop: {
    damping: 10,
    stiffness: 200,
  } satisfies WithSpringConfig,
} as const;

/**
 * Timing configs for non-spring animations
 */
export const TIMING_CONFIGS = {
  // Fade transitions
  fade: {
    duration: 150,
    easing: Easing.ease,
  } satisfies WithTimingConfig,

  // Input focus border transition
  inputFocus: {
    duration: 200,
    easing: Easing.out(Easing.ease),
  } satisfies WithTimingConfig,
} as const;

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
 * Confetti animation config for success state
 */
export const CONFETTI_CONFIG = {
  colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#FCD34D', '#F59E0B'],
  duration: 1500,
  particleCount: 20,
} as const;

/**
 * Exit transition animation config for success → list transition
 * Shared element style: icon morphs up while content fades
 */
export const EXIT_TRANSITION = {
  // Content fade out (faster than icon)
  content: {
    delay: 0,
    duration: 250,
  },

  // Total duration of exit animation
  duration: 500,

  // Icon morph animation
  icon: {
    // Shrink
    duration: 400,

    // Move upward
    scale: 0.4,
    translateY: -150,
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
  colors: ['#10B981', '#FBBF24', '#8B5CF6', '#EC4899', '#3B82F6'],
  count: 8,
  distance: 60,
  duration: 800,
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
 * Chip stagger entrance animation
 * Each chip fades in and slides up with a 50ms delay between each
 */
export const CHIP_STAGGER = {
  delay: 50, // ms between each chip
  duration: 400,
  translateY: 10,
} as const;

/**
 * Hero glow pulse animation (synced with breathing)
 * Shadow opacity and radius pulse with the 3s breathing cycle
 */
export const HERO_GLOW = {
  maxShadowOpacity: 0.35,
  maxShadowRadius: 32,
  minShadowOpacity: 0.15,
  minShadowRadius: 24,
  outerGlowOpacity: 0.15,
  outerGlowRadius: 60,
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

/**
 * Breathing animation configuration for idle state
 * Creates gentle "alive" feeling when user is thinking/reading
 */
export const BREATHING_CONFIG = {
  /** Duration of one complete breath cycle (in → out) */
  duration: 3000, // 3s (breathing rhythm, calming)

  /** Maximum scale during breath (1.02 = 2% growth) */
  maxScale: 1.02,

  /** Delay before breathing starts after becoming idle */
  idleDelay: 5000, // 5s (user has time to read/think)

  /** Stagger delay between chips for wave effect */
  staggerDelay: 250, // 250ms between chips

  /** Easing for breathing motion */
  easing: Easing.inOut(Easing.ease), // Natural breathing curve
} as const;
