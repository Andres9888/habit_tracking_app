/**
 * Queue Operations (FIFO)
 *
 * Implements peek, dequeue, remove, and clear operations.
 * Enqueue is in a separate file for code organization.
 *
 * @see docs/offline-habit-sync.md FR-005 (FIFO processing)
 */

import type { OfflineOperation, OfflineQueueState, QueueEvent } from './types';
import { calculateStats } from './helpers';
import { createEnqueue } from './enqueue';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = (options?: { persist?: boolean }) => void;
type EmitFn = (event: QueueEvent) => void;

export function createOperations(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return {
    clear(options?: { persist?: boolean }): void {
      setState({ ...getState(), operations: [] });
      notify(options);
      emit({
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'queue:cleared',
      });
    },

    dequeue(): OfflineOperation | undefined {
      const state = getState();
      const idx = state.operations.findIndex((op) => op.status === 'pending');
      if (idx === -1) return undefined;

      const operation = state.operations[idx];
      const newOperations = state.operations.filter((_, i) => i !== idx);
      setState({ ...state, operations: newOperations });
      notify();

      emit({
        operation,
        operationId: operation.id,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'operation:removed',
      });

      return operation;
    },

    enqueue: createEnqueue(getState, setState, notify, emit),

    peek(): OfflineOperation | undefined {
      const { operations } = getState();
      return operations.find((op) => op.status === 'pending');
    },

    remove(operationId: string): boolean {
      const state = getState();
      const idx = state.operations.findIndex((op) => op.id === operationId);
      if (idx === -1) return false;

      const operation = state.operations[idx];
      const newOperations = state.operations.filter((_, i) => i !== idx);
      setState({ ...state, operations: newOperations });
      notify();

      emit({
        operation,
        operationId,
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'operation:removed',
      });

      return true;
    },
  };
}
