/**
 * Orphan Removal
 *
 * Functions for removing orphaned operations from the queue.
 */

import { createCleanupEvent } from './helpers';
import type {
  CleanupOrphansConfig,
  CleanupOrphansDeps,
  CleanupOrphansEvent,
  OrphanedOperation,
} from './types';

/**
 * Remove orphaned operations from the queue
 *
 * @param orphans - Array of orphaned operations to remove
 * @param removeOperation - Function to remove an operation by ID
 * @param emitEvent - Function to emit cleanup events
 * @param config - Optional configuration with callbacks
 * @returns Number of orphans successfully removed
 */
export function removeOrphans(
  orphans: OrphanedOperation[],
  removeOperation: CleanupOrphansDeps['removeOperation'],
  emitEvent: (event: CleanupOrphansEvent) => void,
  config?: CleanupOrphansConfig
): number {
  let removedCount = 0;

  for (const orphan of orphans) {
    const removed = removeOperation(orphan.operation.id);
    if (removed) {
      removedCount++;
      config?.onOrphanRemoved?.(orphan);
      emitEvent(createCleanupEvent('cleanup:orphan_removed', { orphan }));
    }
  }

  return removedCount;
}

/**
 * Notify about found orphans via config callbacks and events
 */
export function notifyOrphansFound(
  orphans: OrphanedOperation[],
  emitEvent: (event: CleanupOrphansEvent) => void,
  config?: CleanupOrphansConfig
): void {
  for (const orphan of orphans) {
    config?.onOrphanFound?.(orphan);
    emitEvent(
      createCleanupEvent('cleanup:orphan_found', {
        habitId: orphan.deletedHabitId,
        orphan,
      })
    );
  }
}
