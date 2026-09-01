/**
 * Pure helpers for merging a persisted queue into a live manager.
 * In-memory operations win because they were created after the disk snapshot.
 */

import type { OfflineOperation, OfflineQueueState } from '../queue';

export function normalizeRestoredOperations(
  operations: OfflineOperation[]
): OfflineOperation[] {
  return operations.map((operation) =>
    operation.status === 'syncing'
      ? { ...operation, status: 'pending' }
      : operation
  );
}

export function mergeRestoredState(
  inMemory: OfflineQueueState,
  persisted: OfflineQueueState
): OfflineQueueState {
  const inMemoryIds = new Set(inMemory.operations.map(({ id }) => id));
  const restored = normalizeRestoredOperations(persisted.operations).filter(
    ({ id }) => !inMemoryIds.has(id)
  );
  const operations = [...inMemory.operations, ...restored].sort(
    (left, right) => left.createdAt - right.createdAt
  );

  return {
    ...persisted,
    createdAt: Math.min(inMemory.createdAt, persisted.createdAt),
    lastSyncCompletedAt:
      inMemory.lastSyncCompletedAt ?? persisted.lastSyncCompletedAt,
    operations,
  };
}
