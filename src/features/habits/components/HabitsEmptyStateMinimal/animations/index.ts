/**
 * HabitsEmptyStateMinimal - Animation Configurations
 *
 * Shared spring configs and animation parameters for the minimal empty state.
 * Uses react-native-reanimated patterns consistent with app design system.
 *
 * Spring values per app patterns: damping 15-32, stiffness 180-300
 */

// Spring configs
export { SPRING_CONFIGS, EXIT_SPRING_CONFIG } from './springConfigs';

// Timing configs
export { TIMING_CONFIGS } from './timingConfigs';

// Hero animations
export { BREATHING_ANIMATION, HERO_GLOW } from './heroAnimations';

// Interaction animations
export {
  POP_ANIMATION,
  CHIP_TRANSFORMS,
  CTA_TRANSFORMS,
  CTA_SHIMMER,
  CHIP_STAGGER,
} from './interactionAnimations';

// Success state animations
export {
  CONFETTI_CONFIG,
  PROGRESS_RING,
  PARTICLE_BURST,
  TAP_HINT_PULSE,
  EXIT_TRANSITION,
} from './successAnimations';

// Layout animations
export {
  ENTRANCE_DELAYS,
  INLINE_HINT_STAGGER_MS,
  KEYBOARD_LAYOUT,
  ERROR_ANIMATION,
} from './layoutAnimations';
