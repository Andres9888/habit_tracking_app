/* eslint-disable max-lines */
/**
 * Queue Enqueue Operation
 */

import type {
  OfflineOperationPayloadByType,
  OfflineOperationType,
  OfflineQueueState,
  QueueEvent,
  QueueOperationOptions,
  QueueOperationResult,
} from './types';
import { getToggleDedupeKey } from './helpers';
import { handleReplace, handleNewOperation } from './enqueueHandlers';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

export function createEnqueue(
  getState: StateGetter,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn
) {
  return function enqueue<T extends OfflineOperationType>(
    type: T,
    payload: OfflineOperationPayloadByType<T>,
    options: QueueOperationOptions = {}
  ): QueueOperationResult {
    const state = getState();
    const { allowDuplicate = false } = options;
    if (type === 'toggleCompletion') {
      const togglePayload = payload as OfflineOperationPayloadByType<'toggleCompletion'>;
      const dedupeKey = getToggleDedupeKey(
        togglePayload.habitId,
        togglePayload.date
      );
      const existingIdx = state.operations.findIndex(
        (op) =>
          op.type === 'toggleCompletion' &&
          getToggleDedupeKey(op.payload.habitId, op.payload.date) === dedupeKey
      );

      if (existingIdx !== -1 && !allowDuplicate) {
        return handleReplace(
          state,
          existingIdx,
          togglePayload,
          setState,
          notify,
          emit,
          getState
        );
      }
    }

    return handleNewOperation(
      state,
      type,
      payload,
      setState,
      notify,
      emit,
      getState
    );
  };
}
