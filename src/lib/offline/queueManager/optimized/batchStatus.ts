/* eslint-disable max-lines */
/**
 * Batch Status Operations
 *
 * @see docs/offline-habit-sync.md FR-011 (handle 500+ operations)
 */

import type {
  OfflineOperation,
  OfflineQueueState,
  QueueEvent,
} from '../../queue';
import type { ErrorCategory } from '../../types';
import { calculateStats } from '../helpers';
import type { BatchStatusResult } from './types';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

/**
 * Mark multiple operations as failed in a single state update.
 */
export function createMarkFailedBatch(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return function markFailedBatch(
    operationIds: string[],
    error: string,
    category?: ErrorCategory
  ): BatchStatusResult {
    if (operationIds.length === 0) {
      return { failed: [], notFound: [], succeeded: [] };
    }

    const state = getState();
    const idsToUpdate = new Set(operationIds);
    const result: BatchStatusResult = {
      failed: [],
      notFound: [],
      succeeded: [],
    };

    const now = Date.now();
    const newOperations: OfflineOperation[] = state.operations.map((op) => {
      if (idsToUpdate.has(op.id)) {
        result.succeeded.push(op.id);
        idsToUpdate.delete(op.id);
        return {
          ...op,
          lastAttemptAt: now,
          lastError: error,
          lastErrorCategory: category,
          retryCount: op.retryCount + 1,
          status: 'failed' as const,
        };
      }
      return op;
    });

    result.notFound = [...idsToUpdate];

    if (result.succeeded.length > 0) {
      setState({ ...state, operations: newOperations });
      notify();

      emit({
        count: result.succeeded.length,
        error,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'queue:batch_failed',
      });
    }

    return result;
  };
}

/**
 * Mark multiple operations as syncing in a single state update.
 */
export function createMarkSyncingBatch(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return function markSyncingBatch(operationIds: string[]): BatchStatusResult {
    if (operationIds.length === 0) {
      return { failed: [], notFound: [], succeeded: [] };
    }

    const state = getState();
    const idsToUpdate = new Set(operationIds);
    const result: BatchStatusResult = {
      failed: [],
      notFound: [],
      succeeded: [],
    };

    const now = Date.now();
    const newOperations = state.operations.map((op) => {
      if (idsToUpdate.has(op.id)) {
        result.succeeded.push(op.id);
        idsToUpdate.delete(op.id);
        return { ...op, lastAttemptAt: now, status: 'syncing' as const };
      }
      return op;
    });

    result.notFound = [...idsToUpdate];

    if (result.succeeded.length > 0) {
      setState({ ...state, operations: newOperations });
      notify();

      emit({
        count: result.succeeded.length,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'queue:batch_syncing',
      });
    }

    return result;
  };
}
