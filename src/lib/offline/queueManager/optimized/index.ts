/**
 * Optimized Queue Operations
 *
 * High-performance operations for 500+ item queues.
 * Uses Map-based indexing for O(1) lookups instead of O(n) array scans.
 *
 * @see docs/offline-habit-sync.md FR-011 (handle 500+ operations)
 */

import type { OfflineQueueState, QueueEvent } from '../../queue';
import { createMarkCompletedBatch, createRemoveBatch } from './batchComplete';
import { createMarkFailedBatch, createMarkSyncingBatch } from './batchStatus';
import { createPeekBatch } from './peekBatch';

export type { BatchStatusResult, OperationIndex } from './types';
export {
  buildOperationIndex,
  findOperationIndexOptimized,
  hasDuplicateOptimized,
} from './indexHelpers';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

/** Create optimized batch operations */
export function createBatchOperations(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return {
    markCompletedBatch: createMarkCompletedBatch(
      getState,
      setState,
      notify,
      emit
    ),
    markFailedBatch: createMarkFailedBatch(getState, setState, notify, emit),
    markSyncingBatch: createMarkSyncingBatch(getState, setState, notify, emit),
    peekBatch: createPeekBatch(getState),
    removeBatch: createRemoveBatch(getState, setState, notify, emit),
  };
}
