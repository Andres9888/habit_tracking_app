/**
 * Orphan Cleanup Helpers
 *
 * Helper functions for identifying and processing orphaned operations.
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type { OfflineOperation, ToggleCompletionPayload } from '../../queue';
import type {
  CleanupOrphansEvent,
  CleanupOrphansEventType,
  CleanupOrphansResult,
  HabitExistsResult,
  OrphanedOperation,
} from './types';

/**
 * Extract unique habit IDs from operations
 */
export function extractUniqueHabitIds(
  operations: OfflineOperation[]
): Id<'habits'>[] {
  const habitIds = new Set<string>();

  for (const op of operations) {
    if (op.type === 'toggleCompletion') {
      habitIds.add((op.payload as ToggleCompletionPayload).habitId);
    }
  }

  return [...habitIds] as Id<'habits'>[];
}

/**
 * Group operations by habit ID
 */
export function groupOperationsByHabit(
  operations: OfflineOperation[]
): Map<string, OfflineOperation[]> {
  const grouped = new Map<string, OfflineOperation[]>();

  for (const op of operations) {
    if (op.type === 'toggleCompletion') {
      const habitId = (op.payload as ToggleCompletionPayload).habitId;
      const existing = grouped.get(habitId) || [];
      existing.push(op);
      grouped.set(habitId, existing);
    }
  }

  return grouped;
}

/**
 * Find deleted habit IDs from existence check results
 */
export function findDeletedHabitIds(
  results: HabitExistsResult[]
): Id<'habits'>[] {
  return results.filter((r) => !r.exists).map((r) => r.habitId);
}

/**
 * Create an orphaned operation record
 */
export function createOrphanedOperation(
  operation: OfflineOperation,
  habitId: Id<'habits'>
): OrphanedOperation {
  return {
    deletedHabitId: habitId,
    detectedAt: Date.now(),
    operation,
  };
}

/**
 * Identify orphaned operations from grouped operations and deleted habit IDs
 */
export function identifyOrphans(
  groupedOps: Map<string, OfflineOperation[]>,
  deletedHabitIds: Id<'habits'>[]
): OrphanedOperation[] {
  const orphans: OrphanedOperation[] = [];

  for (const habitId of deletedHabitIds) {
    const operations = groupedOps.get(habitId) || [];
    for (const op of operations) {
      orphans.push(createOrphanedOperation(op, habitId));
    }
  }

  return orphans;
}

/**
 * Create a cleanup event
 */
export function createCleanupEvent(
  type: CleanupOrphansEventType,
  data?: CleanupOrphansEvent['data']
): CleanupOrphansEvent {
  return {
    data,
    timestamp: Date.now(),
    type,
  };
}

/**
 * Create an empty cleanup result
 */
export function createEmptyCleanupResult(): CleanupOrphansResult {
  return {
    allCleaned: true,
    cleanedOperations: [],
    deletedHabitIds: [],
    durationMs: 0,
    orphansFound: 0,
    orphansRemoved: 0,
    totalChecked: 0,
  };
}

/**
 * Build a cleanup result from processed orphans
 */
export function buildCleanupResult(
  totalChecked: number,
  orphans: OrphanedOperation[],
  removedCount: number,
  deletedHabitIds: Id<'habits'>[],
  startTime: number
): CleanupOrphansResult {
  return {
    allCleaned: removedCount === orphans.length,
    cleanedOperations: orphans,
    deletedHabitIds,
    durationMs: Date.now() - startTime,
    orphansFound: orphans.length,
    orphansRemoved: removedCount,
    totalChecked,
  };
}
