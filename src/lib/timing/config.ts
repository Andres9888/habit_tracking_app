/**
 * Timing Constants Configuration
 * Centralized location for all application timeouts, delays, and durations
 */

import { springs } from '@/theme/animations';
export { ANIMATION_DURATIONS } from './animationDurations';
export { DELAYS, STAGGER_DELAYS } from './delayConfig';

/**
 * UI Animation Durations (in milliseconds)
 */
/**
 * Timeout Constants (in milliseconds)
 */
export const TIMEOUTS = {
  API_REQUEST: 30_000,
  API_TIMEOUT_LONG: 30_000,
  DEBOUNCE_STANDARD: 300,
  CIRCUIT_BREAKER_RESET: 30_000,
  REQUEST_IDLE_CALLBACK: 2000,
  PURCHASES_INIT: 500,
  FLOATING_XP_DURATION: 1000,
  CONFETTI_CLEAR: 700,
  CONFETTI_CLEAR_EXTENDED: 1000,
  QUICK_COMPLETE_TOGGLE: 300,
  QUICK_COMPLETE_CONFETTI: 700,
  OFFLINE_QUEUE_PROCESS: 1000,
  E2E_WAIT: 500,
  E2E_WAIT_EXTENDED: 10_000,
} as const;

/**
 * Spring Timing (react-native-reanimated)
 */
export const SPRING_CONFIGS = {
  STANDARD: Object.assign({}, springs.bouncy, {
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
    stiffness: 100,
  }),
} as const;

/**
 * Voice Note Durations (in milliseconds)
 */
export const VOICE_NOTE_DURATIONS = {
  MAX_DURATION: 120_000,
} as const;

/**
 * Confetti Configuration Durations
 */
export const CONFETTI_DURATIONS = {
  HERO: 3000,
  STANDARD: 2000,
  EXTENDED: 2200,
  BURST: 2500,
  PARTICLES: 2000,
  SCIENCE_MODAL: 1500,
  SCIENCE_MODAL_EXTENDED: 2000,
} as const;

/**
 * Random Delay Ranges (in milliseconds)
 */
export const RANDOM_DELAYS = {
  CONFETTI_PARTICLE: 300,
  PARTICLE_BURST: 400,
  CONFETTI_SUCCESS: 400,
} as const;
