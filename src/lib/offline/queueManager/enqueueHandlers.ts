import type {
  OfflineOperation,
  OfflineOperationPayloadByType,
  OfflineOperationType,
  OfflineQueueState,
  QueueEvent,
  QueueOperationResult,
  ToggleCompletionOperation,
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
  const existing = state.operations[existingIdx] as ToggleCompletionOperation;
  const updated: ToggleCompletionOperation = {
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

export function handleNewOperation<T extends OfflineOperationType>(
  state: OfflineQueueState,
  type: T,
  payload: OfflineOperationPayloadByType<T>,
  setState: StateSetter,
  notify: NotifyFn,
  emit: EmitFn,
  getState: StateGetter
): QueueOperationResult {
  const id = generateOperationId();
  const operation: OfflineOperation<T> = {
    createdAt: Date.now(),
    id,
    payload,
    retryCount: 0,
    status: 'pending',
    type,
  } as OfflineOperation<T>;
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
