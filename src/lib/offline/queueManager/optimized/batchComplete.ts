/* eslint-disable max-lines */
/**
 * Batch Completion Operations
 * @see docs/offline-habit-sync.md FR-011
 */

import type {
  OfflineOperation,
  OfflineQueueState,
  QueueEvent,
} from '../../queue';
import { calculateStats } from '../helpers';
import type { BatchStatusResult } from './types';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

export { createRemoveBatch } from './removeBatch';

export function createMarkCompletedBatch(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return function markCompletedBatch(
    operationIds: string[]
  ): BatchStatusResult {
    if (operationIds.length === 0)
      return { failed: [], notFound: [], succeeded: [] };
    const state = getState();
    const idsToRemove = new Set(operationIds);
    const result: BatchStatusResult = {
      failed: [],
      notFound: [],
      succeeded: [],
    };
    const removed: OfflineOperation[] = [];
    const remaining: OfflineOperation[] = [];

    for (const op of state.operations) {
      if (idsToRemove.has(op.id)) {
        removed.push(op);
        result.succeeded.push(op.id);
        idsToRemove.delete(op.id);
      } else remaining.push(op);
    }
    result.notFound = [...idsToRemove];

    if (removed.length > 0) {
      setState({
        ...state,
        lastSyncCompletedAt: Date.now(),
        operations: remaining,
      });
      notify();
      emit({
        count: removed.length,
        operations: removed.map((op) => ({
          ...op,
          status: 'completed' as const,
        })),
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'queue:batch_completed',
      });
    }
    return result;
  };
}
