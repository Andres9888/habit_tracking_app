/**
 * Status Update Helpers
 *
 * Helper functions for status transitions.
 */

import type { OfflineOperation, OfflineQueueState } from './types';
import { findOperationIndex } from './helpers';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;

export function createUpdateOperation(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn
) {
  return function updateOperation(
    operationId: string,
    updater: (op: OfflineOperation) => OfflineOperation
  ): OfflineOperation | undefined {
    const state = getState();
    const idx = findOperationIndex(state.operations, operationId);
    if (idx === -1) return undefined;

    const updated = updater(state.operations[idx]);
    const newOperations = [...state.operations];
    newOperations[idx] = updated;
    setState({ ...state, operations: newOperations });
    notify();

    return updated;
  };
}
