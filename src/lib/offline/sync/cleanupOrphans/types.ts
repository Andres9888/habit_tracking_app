/**
 * Orphan Cleanup Types
 *
 * Types for identifying and cleaning up offline operations
 * that reference deleted habits (Edge Case: "Deleted habit on server").
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type { OfflineOperation } from '../../queue';

/**
 * Result of checking whether a habit exists
 */
export interface HabitExistsResult {
  /** Habit ID that was checked */
  habitId: Id<'habits'>;
  /** Whether the habit exists on the server */
  exists: boolean;
}

/**
 * Function to check if a habit exists on the server
 * This allows for mocking in tests and Convex integration in production
 */
export type HabitExistsChecker = (
  habitId: Id<'habits'>
) => Promise<HabitExistsResult>;

/**
 * Batch habit existence checker for efficiency
 */
export type BatchHabitExistsChecker = (
  habitIds: Id<'habits'>[]
) => Promise<HabitExistsResult[]>;

/**
 * An orphaned operation that references a deleted habit
 */
export interface OrphanedOperation {
  /** The orphaned operation */
  operation: OfflineOperation;
  /** Habit ID that no longer exists */
  deletedHabitId: Id<'habits'>;
  /** When the orphan was detected */
  detectedAt: number;
}

/**
 * Result of an orphan cleanup cycle
 */
export interface CleanupOrphansResult {
  /** Number of operations checked */
  totalChecked: number;
  /** Number of orphaned operations found */
  orphansFound: number;
  /** Number of orphans successfully removed */
  orphansRemoved: number;
  /** Orphaned operations that were cleaned up */
  cleanedOperations: OrphanedOperation[];
  /** Unique habit IDs that were deleted */
  deletedHabitIds: Id<'habits'>[];
  /** Duration of cleanup in milliseconds */
  durationMs: number;
  /** Whether all orphans were successfully removed */
  allCleaned: boolean;
}

/**
 * Configuration for orphan cleanup
 */
export interface CleanupOrphansConfig {
  /** Maximum operations to check per cleanup cycle (default: 100) */
  batchSize?: number;
  /** Whether to continue checking after finding first orphan (default: true) */
  checkAll?: boolean;
  /** Callback when an orphan is found */
  onOrphanFound?: (orphan: OrphanedOperation) => void;
  /** Callback when an orphan is removed */
  onOrphanRemoved?: (orphan: OrphanedOperation) => void;
}

/**
 * Event types for orphan cleanup
 */
export type CleanupOrphansEventType =
  | 'cleanup:started'
  | 'cleanup:orphan_found'
  | 'cleanup:orphan_removed'
  | 'cleanup:completed'
  | 'cleanup:error';

/**
 * Event payload for orphan cleanup
 */
export interface CleanupOrphansEvent {
  type: CleanupOrphansEventType;
  timestamp: number;
  data?: {
    result?: CleanupOrphansResult;
    orphan?: OrphanedOperation;
    error?: Error;
    habitId?: Id<'habits'>;
  };
}

/**
 * Listener for cleanup events
 */
export type CleanupOrphansEventListener = (event: CleanupOrphansEvent) => void;

/**
 * Dependencies for the cleanup process
 */
export interface CleanupOrphansDeps {
  /** Function to get pending operations from the queue */
  getOperations: () => OfflineOperation[];
  /** Function to remove an operation from the queue */
  removeOperation: (operationId: string) => boolean;
  /** Function to check if a habit exists */
  checkHabitExists: HabitExistsChecker;
}
