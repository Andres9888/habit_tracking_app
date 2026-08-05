/**
 * Sync Orchestrator Helpers
 *
 * Utility functions for converting offline operations to sync items
 * and managing sync state transitions.
 */

import type { OfflineOperation } from '../queue';
import type { RetryContext } from '../types';
import type { SyncItem } from '../syncManager';

/**
 * Create a retry context with a specific attempt count
 *
 * @param attemptCount - Number of previous attempts
 * @returns RetryContext for sync manager
 */
function createRetryContextWithCount(attemptCount: number): RetryContext {
  return {
    attemptCount,
    exhausted: false,
  };
}

/**
 * Convert an OfflineOperation to a SyncItem for the sync manager
 *
 * @param operation - The offline queue operation to convert
 * @returns SyncItem compatible with OfflineSyncManager
 */
export function operationToSyncItem(
  operation: OfflineOperation
): SyncItem<OfflineOperation> {
  return {
    id: operation.id,
    payload: operation,
    retryContext: createRetryContextWithCount(operation.retryCount),
    type: operation.type,
  };
}

/**
 * Convert multiple operations to sync items
 *
 * @param operations - Array of offline operations
 * @returns Array of sync items
 */
export function operationsToSyncItems(
  operations: OfflineOperation[]
): SyncItem<OfflineOperation>[] {
  return operations.map((op) => operationToSyncItem(op));
}

/**
 * Filter pending operations from the queue state
 *
 * @param operations - All operations in the queue
 * @returns Only operations with 'pending' status
 */
export function filterPendingOperations(
  operations: OfflineOperation[]
): OfflineOperation[] {
  return operations.filter((op) => op.status === 'pending');
}

/**
 * Get operations ready for sync (pending, sorted by createdAt FIFO)
 *
 * @param operations - All operations in the queue
 * @param limit - Maximum number of operations to return
 * @returns Operations ready for sync, oldest first
 */
export function getOperationsForSync(
  operations: OfflineOperation[],
  limit: number
): OfflineOperation[] {
  return filterPendingOperations(operations)
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, limit);
}

/**
 * Check if the orchestrator should skip syncing
 *
 * @param lastSyncAttemptAt - Timestamp of last sync attempt
 * @param minIntervalMs - Minimum interval between syncs
 * @returns true if sync should be skipped
 */
export function shouldSkipSync(
  lastSyncAttemptAt: number | undefined,
  minIntervalMs: number
): boolean {
  if (!lastSyncAttemptAt) return false;
  return Date.now() - lastSyncAttemptAt < minIntervalMs;
}

/**
 * Default configuration values
 */
export const DEFAULT_ORCHESTRATOR_CONFIG = {
  autoSyncOnOnline: true,
  batchSize: 50,
  minSyncIntervalMs: 5000,
  syncDebounceMs: 1000,
} as const;
