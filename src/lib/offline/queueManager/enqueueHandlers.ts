import type {
  OfflineOperation,
  OfflineOperationType,
  OfflineQueueState,
  QueueEvent,
  QueueOperationResult,
  ReorderHabitsPayload,
  ToggleCompletionPayload,
} from './types';
import { calculateStats, generateOperationId } from './helpers';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

export function handleReplace(
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

export function handleReorderReplace(
  state: OfflineQueueState,
  existingIdx: number,
  payload: ReorderHabitsPayload,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn,
  getState: StateGetter
): QueueOperationResult {
  const existing = state.operations[existingIdx];
  const existingPayload = existing.payload as ReorderHabitsPayload;
  const updated: OfflineOperation = {
    ...existing,
    // Replace target order but keep the ORIGINAL previousOrder so a rollback
    // after coalescing still restores the pre-reorder state.
    payload: {
      habitIds: payload.habitIds,
      previousOrder: existingPayload.previousOrder,
    },
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

export function handleNewOperation<T extends OfflineOperationType>(
  state: OfflineQueueState,
  type: T,
  payload: OfflineOperation<T>['payload'],
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
