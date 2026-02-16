/* eslint-disable max-lines */
/**
 * Queue Enqueue Operation
 *
 * Handles adding operations to the queue with deduplication.
 */

import type {
  OfflineOperation,
  OfflineQueueState,
  QueueEvent,
  QueueOperationOptions,
  QueueOperationResult,
  ToggleCompletionPayload,
} from './types';
import {
  calculateStats,
  generateOperationId,
  getToggleDedupeKey,
} from './helpers';

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

    // Check for duplicates (same habit + date)
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

function handleReplace(
  state: OfflineQueueState,
  existingIdx: number,
  payload: ToggleCompletionPayload,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn,
  getState: StateGetter
): QueueOperationResult {
  const existing = state.operations[existingIdx];
  const updated: OfflineOperation = {
    ...existing,
    payload,
    retryCount: 0,
    status: 'pending',
  };
  const newOperations = [...state.operations];
  newOperations[existingIdx] = updated;
  setState({ ...state, operations: newOperations });
  notify();

  emit({
    operation: updated,
    operationId: existing.id,
    stats: calculateStats(getState()),
    timestamp: Date.now(),
    type: 'operation:updated',
  });

  return { operationId: existing.id, replaced: true, success: true };
}

function handleNewOperation(
  state: OfflineQueueState,
  type: 'toggleCompletion',
  payload: ToggleCompletionPayload,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn,
  getState: StateGetter
): QueueOperationResult {
  const id = generateOperationId();
  const operation: OfflineOperation = {
    createdAt: Date.now(),
    id,
    payload,
    retryCount: 0,
    status: 'pending',
    type,
  };

  setState({ ...state, operations: [...state.operations, operation] });
  notify();

  emit({
    operation,
    operationId: id,
    stats: calculateStats(getState()),
    timestamp: Date.now(),
    type: 'operation:added',
  });

  return { operationId: id, success: true };
}
