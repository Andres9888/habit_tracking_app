/**
 * Queue Enqueue Operation
 */

import type {
  OfflineOperation,
  OfflineOperationType,
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
  return function enqueue<T extends OfflineOperationType>(
    type: T,
    payload: OfflineOperation<T>['payload'],
    options: QueueOperationOptions = {}
  ): QueueOperationResult {
    const state = getState();
    const { allowDuplicate = false, operationId } = options;

    // Toggle-completion operations dedupe on (habitId, date) so a rapid
    // toggle/untoggle collapses to the latest intent. Other operation types
    // are always appended as new operations.
    if (type === 'toggleCompletion') {
      const togglePayload = payload as ToggleCompletionPayload;
      const dedupeKey = getToggleDedupeKey(
        togglePayload.habitId,
        togglePayload.date
      );
      const existingIdx = state.operations.findIndex(
        (op) =>
          op.type === 'toggleCompletion' &&
          getToggleDedupeKey(
            (op.payload as ToggleCompletionPayload).habitId,
            (op.payload as ToggleCompletionPayload).date
          ) === dedupeKey
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
      getState,
      operationId
    );
  };
}
