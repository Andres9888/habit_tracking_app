/**
 * Streak Calculator Types
 *
 * Types for local streak calculation during offline mode.
 * Mirrors the server-side types from convex/streakUtils/types.ts
 */

import type { Id } from '../../../../convex/_generated/dataModel';

/**
 * Calculated streak data for a habit
 * Mirrors convex/streakUtils/types.ts StreakData
 */
export interface StreakData {
  /** Current consecutive day streak (0 if streak broken) */
  currentStreak: number;
  /** Best streak ever achieved for this habit */
  bestStreak: number;
  /** Last completed date in YYYY-MM-DD format */
  lastCompletedDate: string;
}

/**
 * A single tracking record for streak calculation
 * Mirrors convex/streakUtils/types.ts TrackingRecord
 */
export interface TrackingRecord {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Whether the habit was completed on this date */
  completed: boolean;
}

/**
 * Input data for calculating a habit's streak
 */
export interface StreakCalculationInput {
  /** Habit ID for which to calculate streak */
  habitId: Id<'habits'>;
  /** Server tracking records for the habit */
  serverTracking: TrackingRecord[];
  /** Pending offline operations that modify completion state */
  pendingOperations: PendingToggleOperation[];
  /** Today's date in YYYY-MM-DD format */
  todayDate: string;
}

/**
 * A pending toggle operation from the offline queue
 */
export interface PendingToggleOperation {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Whether toggling to completed (true) or incomplete (false) */
  toCompleted: boolean;
}

/**
 * Options for streak calculation
 */
export interface StreakCalculatorOptions {
  /** Maximum days to look back for streak calculation (safety limit) */
  maxLookbackDays?: number;
}

/**
 * Default options for streak calculator
 */
export const DEFAULT_STREAK_OPTIONS: Required<StreakCalculatorOptions> = {
  maxLookbackDays: 400, // > 1 year, matches existing client-side logic
};
