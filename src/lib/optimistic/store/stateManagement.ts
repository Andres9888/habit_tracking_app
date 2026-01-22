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
    }
  };

  return {
    clearPendingState,

    confirm(operationId: string): void {
      const operation = state.operations.get(operationId);
      if (!operation) return;

      operation.state = 'confirmed';
      operation.completedAt = Date.now();

      clearPendingState(operation);
      setTimeout(() => {
        state.operations.delete(operationId);
        notify();
      }, 100);

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
