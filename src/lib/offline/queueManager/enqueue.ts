/**
 * Queue Enqueue Operation
 */

import type {
  OfflineQueueState,
  QueueEvent,
  QueueOperationOptions,
  ToggleCompletionPayload,
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
  return function enqueue(
    type: 'toggleCompletion',
    payload: ToggleCompletionPayload,
    options: QueueOperationOptions = {}
  ): QueueOperationResult {
    const state = getState();
    const { allowDuplicate = false } = options;
    const dedupeKey = getToggleDedupeKey(payload.habitId, payload.date);
    const existingIdx = state.operations.findIndex(
      (op) =>
        op.type === 'toggleCompletion' &&
        getToggleDedupeKey(op.payload.habitId, op.payload.date) === dedupeKey
    );

    if (existingIdx !== -1 && !allowDuplicate) {
      return handleReplace(
        state,
        existingIdx,
        payload,
        setState,
        notify,
        emit,
        getState
      );
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
