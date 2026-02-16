/* eslint-disable max-lines */
/**
 * Batch Completion Operations
 *
 * @see docs/offline-habit-sync.md FR-011 (handle 500+ operations)
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

/**
 * Mark multiple operations as completed in a single state update.
 * O(n) where n is batch size, not total queue size.
 */
export function createMarkCompletedBatch(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return function markCompletedBatch(
    operationIds: string[]
  ): BatchStatusResult {
    if (operationIds.length === 0) {
      return { failed: [], notFound: [], succeeded: [] };
    }

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
      } else {
        remaining.push(op);
      }
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

/**
 * Remove multiple operations by ID in a single state update.
 */
export function createRemoveBatch(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return function removeBatch(operationIds: string[]): BatchStatusResult {
    if (operationIds.length === 0) {
      return { failed: [], notFound: [], succeeded: [] };
    }

    const state = getState();
    const idsToRemove = new Set(operationIds);
    const result: BatchStatusResult = {
      failed: [],
      notFound: [],
      succeeded: [],
    };

    const remaining: OfflineOperation[] = [];

    for (const op of state.operations) {
      if (idsToRemove.has(op.id)) {
        result.succeeded.push(op.id);
        idsToRemove.delete(op.id);
      } else {
        remaining.push(op);
      }
    }

    result.notFound = [...idsToRemove];

    if (result.succeeded.length > 0) {
      setState({ ...state, operations: remaining });
      notify();

      emit({
        count: result.succeeded.length,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'queue:batch_removed',
      });
    }

    return result;
  };
}
