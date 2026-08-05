/**
 * Calculations Module
 *
 * Client-side calculation utilities for offline mode.
 * Provides local streak calculation that mirrors server-side logic.
 */

// Types
export type {
  PendingToggleOperation,
  StreakCalculationInput,
  StreakCalculatorOptions,
  StreakData,
  TrackingRecord,
} from './types';

export { DEFAULT_STREAK_OPTIONS } from './types';

// Date Helpers
export {
  differenceInDays,
  formatDate,
  getTodayDateKey,
  isValidDateFormat,
  parseDate,
} from './dateHelpers';

// Streak Calculator
export {
  calculateBestStreakFromDates,
  calculateOfflineStreak,
  calculateStreakFromHistory,
  computeCurrentStreakFromDates,
  mergeTrackingWithPending,
} from './streakCalculator';
