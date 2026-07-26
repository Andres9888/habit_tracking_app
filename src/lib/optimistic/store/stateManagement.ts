/**
 * Store state management (confirm, fail, clear, getters)
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { OptimisticOperation, OptimisticStore } from '../types';
import { getToggleKey } from './helpers';
import { clearPendingState as clearOperationPendingState } from './clearPendingState';
import { createOperationTimers } from './operationTimers';
import {
  countPendingOperations,
  hasPendingOperations,
} from './pendingStateQueries';

export function createStateManagement(
  state: OptimisticStore,
  notify: () => void
) {
  const timers = createOperationTimers();

  const clearPendingState = (operation: OptimisticOperation): void => {
    clearOperationPendingState(state, operation);
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
      notify();
    },

    reset(): void {
      timers.clear();
      state.operations.clear();
      state.pendingArchives.clear();
      state.pendingPauses.clear();
      state.pendingReorder = null;
      state.pendingToggles.clear();
      notify();
    },

    getPendingArchive(habitId: Id<'habits'>): boolean | undefined {
      return state.pendingArchives.get(habitId);
    },

    getPendingCount(): number {
      return countPendingOperations(state);
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
      return hasPendingOperations(state);
    },
  };
}
