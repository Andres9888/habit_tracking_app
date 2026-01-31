/**
 * Batch Peek Operation
 *
 * @see docs/offline-habit-sync.md FR-011 (handle 500+ operations)
 */

import type { OfflineOperation, OfflineQueueState } from '../../queue';

type StateGetter = () => OfflineQueueState;

/**
 * Get multiple pending operations efficiently.
 * Returns operations in FIFO order.
 */
export function createPeekBatch(getState: StateGetter) {
  return function peekBatch(count: number): OfflineOperation[] {
    const { operations } = getState();
    const result: OfflineOperation[] = [];

    for (const op of operations) {
      if (op.status === 'pending') {
        result.push(op);
        if (result.length >= count) break;
      }
    }

    return result;
  };
}
