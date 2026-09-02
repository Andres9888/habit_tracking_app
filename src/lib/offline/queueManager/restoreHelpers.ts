/**
 * Restore Helpers
 *
 * Pure functions used when loading persisted queue state into a live
 * manager. Two invariants:
 *
 * 1. Operations enqueued in memory before restoration finished must not be
 *    clobbered by the persisted snapshot (in-memory wins by id).
 * 2. Operations persisted mid-flight as `syncing` (app killed during a sync)
 *    must be retried, so they are reset to `pending` on restore.
 */

import type { OfflineOperation, OfflineQueueState } from '../queue';

/** Reset operations that were persisted while in flight. */
export function normalizeRestoredOperations(
  operations: OfflineOperation[]
): OfflineOperation[] {
  return operations.map((op) =>
    op.status === 'syncing' ? { ...op, status: 'pending' } : op
  );
}

/**
 * Merge a persisted snapshot into the live in-memory state.
 *
 * In-memory operations are authoritative (they are newer than anything on
 * disk); persisted operations not present in memory are appended. The
 * result is sorted FIFO by createdAt so processing order is preserved.
 */
export function mergeRestoredState(
  inMemory: OfflineQueueState,
  persisted: OfflineQueueState
): OfflineQueueState {
  const seen = new Set(inMemory.operations.map((op) => op.id));
  const restored = normalizeRestoredOperations(persisted.operations).filter(
    (op) => !seen.has(op.id)
  );
  const operations = [...inMemory.operations, ...restored].sort(
    (a, b) => a.createdAt - b.createdAt
  );
  return {
    ...persisted,
    createdAt: Math.min(inMemory.createdAt, persisted.createdAt),
    lastSyncCompletedAt:
      inMemory.lastSyncCompletedAt ?? persisted.lastSyncCompletedAt,
    operations,
  };
}
