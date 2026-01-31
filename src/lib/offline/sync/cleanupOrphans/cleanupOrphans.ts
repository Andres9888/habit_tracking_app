/**
 * Orphan Cleanup
 *
 * Main function for cleaning up offline operations that reference deleted habits.
 * Implements Edge Case: "Deleted habit on server: Orphaned completions discarded gracefully"
 */

import { checkHabitsExistence } from './checkExistence';
import {
  buildCleanupResult,
  createCleanupEvent,
  createEmptyCleanupResult,
  extractUniqueHabitIds,
  findDeletedHabitIds,
  groupOperationsByHabit,
  identifyOrphans,
} from './helpers';
import { notifyOrphansFound, removeOrphans } from './removeOrphans';
import type {
  CleanupOrphansConfig,
  CleanupOrphansDeps,
  CleanupOrphansEvent,
  CleanupOrphansEventListener,
  CleanupOrphansResult,
} from './types';

/** Default batch size for cleanup */
export const DEFAULT_CLEANUP_BATCH_SIZE = 100;

/**
 * Clean up orphaned operations that reference deleted habits
 */
export async function cleanupOrphans(
  deps: CleanupOrphansDeps,
  config?: CleanupOrphansConfig,
  eventListener?: CleanupOrphansEventListener
): Promise<CleanupOrphansResult> {
  const startTime = Date.now();
  const emitEvent = (event: CleanupOrphansEvent): void =>
    eventListener?.(event);

  emitEvent(createCleanupEvent('cleanup:started'));

  try {
    const operations = deps.getOperations();
    const batchSize = config?.batchSize ?? DEFAULT_CLEANUP_BATCH_SIZE;
    const operationsToCheck = operations.slice(0, batchSize);

    if (operationsToCheck.length === 0) {
      const result = createEmptyCleanupResult();
      emitEvent(createCleanupEvent('cleanup:completed', { result }));
      return result;
    }

    const habitIds = extractUniqueHabitIds(operationsToCheck);
    const existenceResults = await checkHabitsExistence(
      habitIds,
      deps.checkHabitExists
    );
    const deletedHabitIds = findDeletedHabitIds(existenceResults);

    if (deletedHabitIds.length === 0) {
      const result = buildCleanupResult(
        operationsToCheck.length,
        [],
        0,
        [],
        startTime
      );
      emitEvent(createCleanupEvent('cleanup:completed', { result }));
      return result;
    }

    const groupedOps = groupOperationsByHabit(operationsToCheck);
    const orphans = identifyOrphans(groupedOps, deletedHabitIds);

    notifyOrphansFound(orphans, emitEvent, config);
    const removedCount = removeOrphans(
      orphans,
      deps.removeOperation,
      emitEvent,
      config
    );

    const result = buildCleanupResult(
      operationsToCheck.length,
      orphans,
      removedCount,
      deletedHabitIds,
      startTime
    );

    emitEvent(createCleanupEvent('cleanup:completed', { result }));
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    emitEvent(createCleanupEvent('cleanup:error', { error: err }));
    throw err;
  }
}

/**
 * Create a cleanup function with pre-configured dependencies
 */
export function createOrphanCleaner(deps: CleanupOrphansDeps) {
  return (
    config?: CleanupOrphansConfig,
    eventListener?: CleanupOrphansEventListener
  ): Promise<CleanupOrphansResult> =>
    cleanupOrphans(deps, config, eventListener);
}
