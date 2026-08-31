/**
 * Sync Orchestrator Helpers
 *
 * Utility functions for selecting operations and managing sync scheduling.
 */

import type { OfflineOperation } from '../queue';

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
