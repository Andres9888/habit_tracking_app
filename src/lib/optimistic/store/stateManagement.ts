/**
 * Store state management (confirm, fail, clear, getters)
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { OptimisticOperation, OptimisticStore } from '../types';
import { getToggleKey } from './helpers';
import { clearPendingState as clearOperationPendingState } from './clearPendingState';
import { createOperationTimers } from './operationTimers';

export function createStateManagement(
  state: OptimisticStore,
  latestToggleOperationIds: Map<string, string>,
  notify: () => void
) {
  const timers = createOperationTimers();

  const clearPendingState = (operation: OptimisticOperation): void => {
    clearOperationPendingState(state, operation, latestToggleOperationIds);
  };

  return {
    clearPendingState,

    confirm(operationId: string): void {
      const operation = state.operations.get(operationId);
      if (!operation) return;

      operation.state = 'confirmed';
      operation.completedAt = Date.now();
      timers.clear(operationId);

      // Delay clearing pending state to allow Convex subscription to sync
      // This prevents a race condition where:
      // 1. Server confirms the mutation
      // 2. We clear optimistic state immediately
      // 3. Convex subscription hasn't updated yet
      // 4. UI briefly shows stale (pre-toggle) state
      // 300ms is enough for most Convex subscription updates to propagate
      timers.schedule(
        operationId,
        () => {
          clearPendingState(operation);
          notify();
        },
        300
      );

      timers.schedule(
        operationId,
        () => {
          state.operations.delete(operationId);
          notify();
        },
        400
      );

      // Notify immediately that operation state changed to 'confirmed'
      notify();
    },

    fail(operationId: string, error: Error): void {
      const operation = state.operations.get(operationId);
      if (!operation) return;

      operation.state = 'failed';
      operation.completedAt = Date.now();
      operation.error = error;
      timers.clear(operationId);

      clearPendingState(operation);
      timers.schedule(
        operationId,
        () => {
          state.operations.delete(operationId);
          notify();
        },
        5000
      );

      notify();
    },

    replaceOperationId(oldId: string, newId: string): void {
      if (oldId === newId) return;
      const operation = state.operations.get(oldId);
      if (!operation) return;
      state.operations.delete(oldId);
      state.operations.set(newId, { ...operation, id: newId });
      if (operation.type === 'toggle') {
        const payload = operation.payload as {
          habitId: Id<'habits'>;
          date: string;
        };
        const key = getToggleKey(payload.habitId, payload.date);
        if (latestToggleOperationIds.get(key) === oldId) {
          latestToggleOperationIds.set(key, newId);
        }
      }
      notify();
    },

    reset(): void {
      timers.clear();
      state.operations.clear();
      state.pendingArchives.clear();
      state.pendingPauses.clear();
      state.pendingReorder = null;
      state.pendingToggles.clear();
      latestToggleOperationIds.clear();
      notify();
    },

    getPendingArchive(habitId: Id<'habits'>): boolean | undefined {
      return state.pendingArchives.get(habitId);
    },

    getPendingCount(): number {
      let count = 0;
      for (const op of state.operations.values()) {
        if (op.state === 'pending') count++;
      }
      return count;
    },

    getPendingPause(habitId: Id<'habits'>): boolean | undefined {
      return state.pendingPauses.get(habitId);
    },

    getPendingReorder(): Id<'habits'>[] | null {
      return state.pendingReorder;
    },

    getPendingToggle(habitId: Id<'habits'>, date: string): boolean | undefined {
      return state.pendingToggles.get(getToggleKey(habitId, date));
    },

    hasPendingOperations(): boolean {
      for (const op of state.operations.values()) {
        if (op.state === 'pending') return true;
      }
      return false;
    },
  };
}
