/**
 * Store state management (confirm, fail, clear, getters)
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  OptimisticOperation,
  OptimisticStore,
  ToggleOperationPayload,
  ArchiveOperationPayload,
  PauseOperationPayload,
  DeleteOperationPayload,
} from '../types';
import { getToggleKey } from './helpers';

export function createStateManagement(
  state: OptimisticStore,
  notify: () => void
) {
  const clearPendingState = (operation: OptimisticOperation): void => {
    switch (operation.type) {
      case 'toggle': {
        const payload = operation.payload as ToggleOperationPayload;
        const key = getToggleKey(payload.habitId, payload.date);
        state.pendingToggles.delete(key);
        break;
      }
      case 'archive': {
        const payload = operation.payload as ArchiveOperationPayload;
        state.pendingArchives.delete(payload.habitId);
        break;
      }
      case 'reorder': {
        state.pendingReorder = null;
        break;
      }
      case 'pause': {
        const payload = operation.payload as PauseOperationPayload;
        state.pendingPauses.delete(payload.habitId);
        break;
      }
      case 'delete': {
        const payload = operation.payload as DeleteOperationPayload;
        state.pendingDeletes.delete(payload.habitId);
        break;
      }
    }
  };

  return {
    clearPendingState,

    confirm(operationId: string): void {
      const operation = state.operations.get(operationId);
      if (!operation) return;

      operation.state = 'confirmed';
      operation.completedAt = Date.now();

      // Delay clearing pending state to allow Convex subscription to sync
      // This prevents a race condition where:
      // 1. Server confirms the mutation
      // 2. We clear optimistic state immediately
      // 3. Convex subscription hasn't updated yet
      // 4. UI briefly shows stale (pre-toggle) state
      // 300ms is enough for most Convex subscription updates to propagate
      setTimeout(() => {
        clearPendingState(operation);
        notify();
      }, 300);

      setTimeout(() => {
        state.operations.delete(operationId);
        notify();
      }, 400);

      // Notify immediately that operation state changed to 'confirmed'
      notify();
    },

    fail(operationId: string, error: Error): void {
      const operation = state.operations.get(operationId);
      if (!operation) return;

      operation.state = 'failed';
      operation.completedAt = Date.now();
      operation.error = error;

      clearPendingState(operation);
      setTimeout(() => {
        state.operations.delete(operationId);
        notify();
      }, 5000);

      notify();
    },

    reset(): void {
      state.operations.clear();
      state.pendingArchives.clear();
      state.pendingDeletes.clear();
      state.pendingPauses.clear();
      state.pendingReorder = null;
      state.pendingToggles.clear();
      notify();
    },

    getPendingArchive(habitId: Id<'habits'>): boolean | undefined {
      return state.pendingArchives.get(habitId);
    },

    getPendingDelete(habitId: Id<'habits'>): boolean | undefined {
      return state.pendingDeletes.get(habitId);
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
