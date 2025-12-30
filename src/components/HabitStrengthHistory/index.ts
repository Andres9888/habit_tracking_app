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

// UI Components
export { StrengthComparisonCards } from './StrengthComparisonCards';
export type { StrengthComparisonCardsProps } from './StrengthComparisonCards';

// Note: Additional component exports will be added when implemented
// export { HabitStrengthHistory } from './HabitStrengthHistory';
// export { StrengthTimelineChart } from './StrengthTimelineChart';
// export { StrengthInsightsRow } from './StrengthInsightsRow';
