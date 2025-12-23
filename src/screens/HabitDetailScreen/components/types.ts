/**
 * Shared TypeScript types for HabitDetailScreen components
 */

import type { Id, Doc } from '../../../../convex/_generated/dataModel';
import type { Habit as HabitDoc, HabitTrackingEntry } from '../../../features/habits/types';

/**
 * Extended Habit type with calculated statistics
 */
export type Habit = HabitDoc & {
  successRate?: number;
  totalCompletions?: number;
  totalMisses?: number;
};

/**
 * Re-export HabitTrackingEntry for convenience
 */
export type { HabitTrackingEntry };

/**
 * Re-export Doc type for Convex documents
 */
export type { Doc, Id };
