/**
 * HabitCard Hooks Types
 *
 * Types for hooks used by the HabitCard component.
 * @see docs/offline-habit-sync.md T013
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  StreakData,
  TrackingRecord,
} from '../../../lib/offline/calculations';

/**
 * Options for useOfflineHabitState hook
 */
export interface UseOfflineHabitStateOptions {
  /** Habit ID to get offline state for */
  habitId: Id<'habits'>;
  /** Today's date in YYYY-MM-DD format */
  todayDate: string;
  /** Server-side tracking records (if available) */
  serverTracking?: TrackingRecord[];
  /** Server-provided streak data (fallback when online) */
  serverStreak?: StreakData;
  /** Server-provided completion status for today */
  serverCompleted?: boolean;
}

/**
 * Return value from useOfflineHabitState hook
 */
export interface UseOfflineHabitStateReturn {
  /** Whether the habit is completed for today (merged view) */
  completed: boolean;
  /** Current streak count (merged with pending operations) */
  currentStreak: number;
  /** Best streak count (merged with pending operations) */
  bestStreak: number;
  /** Whether there are pending offline operations for this habit */
  hasPendingOperations: boolean;
  /** Number of pending operations for this habit */
  pendingCount: number;
}
