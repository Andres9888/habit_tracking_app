/**
 * Failed-operation helpers for the SyncStatusContext.
 *
 * Bridges the queue manager's failed operations to the "Sync Failed" banner
 * Retry / Discard actions.
 */

import { getOfflineQueueManager } from '../../lib/offline/queueManager';
import { optimisticHabitCreationStore } from '../../features/habits/hooks/optimisticHabitCreationStore';

function getFailedOperations() {
  return getOfflineQueueManager()
    .getState()
    .operations.filter((op) => op.status === 'failed');
}

/**
 * Reset every failed operation back to pending for a fresh retry.
 * Uses resetForRetry so retryCount/lastError are cleared (a plain markPending
 * would re-exhaust after a single attempt). Returns the number reset.
 */
export function resetFailedOperations(): number {
  const manager = getOfflineQueueManager();
  const failed = getFailedOperations();
  for (const op of failed) manager.resetForRetry(op.id);
  return failed.length;
}

/**
 * Discard every failed operation. Failed createHabit ops leave a ghost in the
 * optimistic creation store (the rehydrate listener only rolls back the main
 * optimistic store on failed-final), so roll those back explicitly before
 * removing the operations from the queue. Returns the number discarded.
 */
export function discardFailedOperations(): number {
  const manager = getOfflineQueueManager();
  const failed = getFailedOperations();
  for (const op of failed) {
    if (op.type === 'createHabit') optimisticHabitCreationStore.fail(op.id);
  }
  manager.removeBatch(failed.map((op) => op.id));
  return failed.length;
}
