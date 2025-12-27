/**
 * HabitsEmptyStateMinimal - Main Export
 *
 * Ultra-minimal empty state design focused on a single question flow.
 * Reference: docs/specs/empty-habit-screen/minimal-redesign.md
 */

// Main component export
export { HabitsEmptyStateMinimal } from './HabitsEmptyStateMinimal';

// Sub-component exports
export { HeroIcon } from './HeroIcon';
export { HabitInput } from './HabitInput';
export { SuggestionChips } from './SuggestionChips';
export { CtaButton } from './CtaButton';
export { SecondaryLinks } from './SecondaryLinks';
export { SuccessState } from './SuccessState';
export { AnimatedEntrance } from './AnimatedEntrance';
export { ProgressRing } from './ProgressRing';
export { ParticleBurst } from './ParticleBurst';

// Type exports
export type {
  HabitsEmptyStateMinimalProps,
  SuggestionChip,
  HeroIconProps,
  HabitInputProps,
  SuggestionChipsProps,
  CtaButtonProps,
  SecondaryLinksProps,
  SuccessStateProps,
  EmptyStateState,
} from './types';

// Constant exports
export { SUGGESTION_CHIPS, COPY, COLORS, TOUCH_TARGETS, BORDER_RADIUS } from './constants';

// Animation exports
export {
  BREATHING_ANIMATION,
  POP_ANIMATION,
  SPRING_CONFIGS,
  TIMING_CONFIGS,
  ENTRANCE_DELAYS,
  CHIP_TRANSFORMS,
  CTA_TRANSFORMS,
  CONFETTI_CONFIG,
  PROGRESS_RING,
} from './animations';
