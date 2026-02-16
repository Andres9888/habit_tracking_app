/**
 * Shared Animation Components and Constants
 *
 * This module exports reusable animation components and spring configurations
 * used across the app. These abstractions ensure consistency in motion design
 * and reduce code duplication.
 */

export { PulsingIcon, type PulsingIconProps } from './PulsingIcon';
export {
  CompletionCheckmark,
  type CompletionCheckmarkProps,
} from './CompletionCheckmark';
export {
  SPRING_BUTTON,
  SPRING_GENTLE,
  SPRING_BOUNCY,
  STAGGER_DELAY,
  BASE_CHECKMARK_DELAY,
} from './constants';
export { useAnimatedCounter } from './useAnimatedCounter';
export { SuccessShimmer } from './SuccessShimmer';
