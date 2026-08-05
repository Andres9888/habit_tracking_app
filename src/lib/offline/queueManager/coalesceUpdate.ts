/**
 * Coalescing for update-style operations.
 *
 * - `updateHabit` collapses onto a pending `createHabit` (when it targets that
 *   create's tempId) or onto an earlier `updateHabit` for the same habit, so a
 *   burst of offline edits replays as a single field-level last-write-wins op.
 * - `updateSettings` collapses to a single whole-document entry.
 *
 * Returns a QueueOperationResult when it handled the enqueue, or null to let
 * the caller append a brand-new operation.
 */

import type {
  CreateHabitPayload,
  OfflineOperation,
  OfflineOperationType,
  OfflineQueueState,
  QueueEvent,
  QueueOperationResult,
  UpdateHabitPayload,
  UpdateSettingsPayload,
} from './types';
import { calculateStats } from './helpers';

type StateGetter = () => OfflineQueueState;
type StateSetter = (state: OfflineQueueState) => void;
type NotifyFn = () => void;
type EmitFn = (event: QueueEvent) => void;

interface CoalesceContext {
  getState: StateGetter;
  setState: StateSetter;
  notify: NotifyFn;
  emit: EmitFn;
}

function replaceAt(
  state: OfflineQueueState,
  index: number,
  nextPayload: OfflineOperation['payload'],
  ctx: CoalesceContext
): QueueOperationResult {
  const existing = state.operations[index];
  const updated: OfflineOperation = {
    ...existing,
    payload: nextPayload,
    retryCount: 0,
    status: 'pending',
  };
  const operations = [...state.operations];
  operations[index] = updated;
  ctx.setState({ ...state, operations });
  ctx.notify();
  ctx.emit({
    operation: updated,
    operationId: existing.id,
    stats: calculateStats(ctx.getState()),
    timestamp: Date.now(),
    type: 'operation:updated',
  });
  return { operationId: existing.id, replaced: true, success: true };
}

function coalesceHabitUpdate(
  state: OfflineQueueState,
  payload: UpdateHabitPayload,
  ctx: CoalesceContext
): QueueOperationResult | null {
  const createIdx = state.operations.findIndex(
    (op) =>
      op.type === 'createHabit' &&
      (op.payload as CreateHabitPayload).tempId === payload.habitId
  );
  if (createIdx !== -1) {
    const create = state.operations[createIdx].payload as CreateHabitPayload;
    return replaceAt(
      state,
      createIdx,
      { ...create, ...payload.updates },
      ctx
    );
  }

  const updateIdx = state.operations.findIndex(
    (op) =>
      op.type === 'updateHabit' &&
      (op.payload as UpdateHabitPayload).habitId === payload.habitId
  );
  if (updateIdx !== -1) {
    const existing = state.operations[updateIdx].payload as UpdateHabitPayload;
    return replaceAt(
      state,
      updateIdx,
      { habitId: payload.habitId, updates: { ...existing.updates, ...payload.updates } },
      ctx
    );
  }

  return null;
}

export function coalesceUpdate<T extends OfflineOperationType>(
  type: T,
  payload: OfflineOperation<T>['payload'],
  ctx: CoalesceContext
): QueueOperationResult | null {
  const state = ctx.getState();
  if (type === 'updateHabit') {
    return coalesceHabitUpdate(state, payload as UpdateHabitPayload, ctx);
  }
  if (type === 'updateSettings') {
    const idx = state.operations.findIndex((op) => op.type === 'updateSettings');
    if (idx !== -1) {
      return replaceAt(state, idx, payload as UpdateSettingsPayload, ctx);
    }
  }
  return null;
}
