/**
 * MotivationCheck Component
 *
 * Quick motivation level assessment.
 * Routes user to appropriate support based on response.
 */

export { MotivationCheck, default } from './MotivationCheck';
export { MotivationButton } from './MotivationButton';
export {
  shouldShowFailureViz,
  getAccentColor,
  MOTIVATION_OPTIONS,
} from './constants';
export type {
  MotivationCheckProps,
  MotivationLevel,
  MotivationButtonProps,
} from './types';
