/**
 * HabitStrengthHistory Component Barrel Export
 *
 * Exports all public APIs for the Habit Strength History feature.
 */

// Types (export all for external use)
export type {
  HabitStrengthHistoryProps,
  StrengthAlgorithmConfig,
  StrengthColors,
  StrengthLabel,
  StrengthMetrics,
  StrengthSnapshot,
  UseHabitStrengthReturn,
} from './types';

// Utility functions
export {
  calculateDelta,
  calculateStrengthAtDate,
  calculateStrengthExtremes,
  formatDateString,
  generateStrengthTimeline,
  getStrengthColor,
  getStrengthColors,
  getStrengthLabel,
} from './strengthUtils';

// Note: Component exports will be added when UI components are created
// export { HabitStrengthHistory } from './HabitStrengthHistory';
// export { StrengthComparisonCards } from './StrengthComparisonCards';
// export { StrengthTimelineChart } from './StrengthTimelineChart';
// export { StrengthInsightsRow } from './StrengthInsightsRow';
