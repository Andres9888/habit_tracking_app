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
  // Track timeout IDs per operation so they can be cancelled
  const pendingTimeouts = new Map<string, ReturnType<typeof setTimeout>[]>();

  const trackTimeout = (operationId: string, id: ReturnType<typeof setTimeout>) => {
    const existing = pendingTimeouts.get(operationId) ?? [];
    existing.push(id);
    pendingTimeouts.set(operationId, existing);
  };

  const clearTimeouts = (operationId: string) => {
    const timeouts = pendingTimeouts.get(operationId);
    if (timeouts) {
      for (const id of timeouts) clearTimeout(id);
      pendingTimeouts.delete(operationId);
    }
  };

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

      // Cancel any existing timeouts for this operation (e.g. from duplicate confirms)
      clearTimeouts(operationId);

      operation.state = 'confirmed';
      operation.completedAt = Date.now();

      // Delay clearing pending state to allow Convex subscription to sync.
      // 1000ms handles slow networks where 300ms was insufficient.
      trackTimeout(
        operationId,
        setTimeout(() => {
          clearPendingState(operation);
          notify();
        }, 1000)
      );

      trackTimeout(
        operationId,
        setTimeout(() => {
          state.operations.delete(operationId);
          pendingTimeouts.delete(operationId);
          notify();
        }, 1100)
      );

      // Notify immediately that operation state changed to 'confirmed'
      notify();
    },

    fail(operationId: string, error: Error): void {
      const operation = state.operations.get(operationId);
      if (!operation) return;

      // Cancel any pending confirm timeouts for this operation
      clearTimeouts(operationId);

      operation.state = 'failed';
      operation.completedAt = Date.now();
      operation.error = error;

      clearPendingState(operation);

      trackTimeout(
        operationId,
        setTimeout(() => {
          state.operations.delete(operationId);
          pendingTimeouts.delete(operationId);
          notify();
        }, 5000)
      );

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
