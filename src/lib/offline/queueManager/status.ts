/**
 * Queue Status Tracking
 *
 * Status transitions: pending → syncing → completed/failed.
 * @see docs/offline-habit-sync.md
 */

import type { OfflineQueueState, QueueEvent } from './types';
import type { ErrorCategory } from '../types';
import { calculateStats, findOperationIndex } from './helpers';
import { createUpdateOperation } from './statusHelpers';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

export function createStatusUpdaters(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  const updateOperation = createUpdateOperation(getState, setState, notify);

  return {
    markCompleted(operationId: string): boolean {
      const state = getState();
      const idx = findOperationIndex(state.operations, operationId);
      if (idx === -1) return false;

      const operation = state.operations[idx];
      const newOperations = state.operations.filter((_, i) => i !== idx);
      setState({
        ...state,
        lastSyncCompletedAt: Date.now(),
        operations: newOperations,
      });
      notify();

      emit({
        operation: { ...operation, status: 'completed' },
        operationId,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'operation:synced',
      });
      return true;
    },

    markFailed(
      operationId: string,
      error: string,
      category?: string,
      options?: { final?: boolean }
    ): boolean {
      const updated = updateOperation(operationId, (op) => ({
        ...op,
        lastAttemptAt: Date.now(),
        lastError: error,
        lastErrorCategory: category as ErrorCategory | undefined,
        retryCount: op.retryCount + 1,
        status: 'failed',
      }));
      if (!updated) return false;

      emit({
        operation: updated,
        operationId,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: options?.final ? 'operation:failed-final' : 'operation:failed',
      });
      return true;
    },

    markPending(operationId: string): boolean {
      const updated = updateOperation(operationId, (op) => ({
        ...op,
        status: 'pending',
      }));
      if (!updated) return false;

      emit({
        operation: updated,
        operationId,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'operation:updated',
      });
      return true;
    },

    markSyncing(operationId: string): boolean {
      const updated = updateOperation(operationId, (op) => ({
        ...op,
        lastAttemptAt: Date.now(),
        status: 'syncing',
      }));
      if (!updated) return false;

      emit({
        operation: updated,
        operationId,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'operation:updated',
      });
      return true;
    },
  };
}
