/**
 * HabitsEmptyStateMinimal - Main Export
 *
 * Ultra-minimal empty state design focused on a single question flow.
 * Reference: docs/specs/empty-habit-screen/minimal-redesign.md
 */

// Component exports
// Main component will be exported once implemented in Phase 3
// export { HabitsEmptyStateMinimal } from './HabitsEmptyStateMinimal';

// Sub-component exports (Phase 2)
export { HeroIcon } from './HeroIcon';
export { HabitInput } from './HabitInput';
export { SuggestionChips } from './SuggestionChips';
export { CtaButton } from './CtaButton';
export { SecondaryLinks } from './SecondaryLinks';

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
} from './animations';
