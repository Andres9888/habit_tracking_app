/**
 * Store operations (add, confirm, fail)
 */

import type {
  OptimisticStore,
  ToggleOperationPayload,
  ArchiveOperationPayload,
  ReorderOperationPayload,
  PauseOperationPayload,
  OperationPayload,
  OperationType,
} from '../types';
import { generateId, getToggleKey } from './helpers';
import { clearPendingState } from './clearPendingState';

export function createOperations(state: OptimisticStore, notify: () => void) {
  const clearExisting = (id: string): void => {
    const existing = state.operations.get(id);
    if (!existing) return;
    clearPendingState(state, existing);
  };

  const applyPendingState = (
    type: OperationType,
    payload: OperationPayload
  ): void => {
    switch (type) {
      case 'archive': {
        const archive = payload as ArchiveOperationPayload;
        state.pendingArchives.set(archive.habitId, archive.toArchived);
        break;
      }
      case 'pause': {
        const pause = payload as PauseOperationPayload;
        state.pendingPauses.set(pause.habitId, pause.toPaused);
        break;
      }
      case 'reorder': {
        const reorder = payload as ReorderOperationPayload;
        state.pendingReorder = [...reorder.habitIds];
        break;
      }
      case 'toggle': {
        const toggle = payload as ToggleOperationPayload;
        state.pendingToggles.set(
          getToggleKey(toggle.habitId, toggle.date),
          toggle.toCompleted
        );
        break;
      }
    }
  };

  const addOperation = (
    id: string,
    type: OperationType,
    payload: OperationPayload
  ): string => {
    clearExisting(id);
    state.operations.set(id, {
      id,
      payload,
      startedAt: Date.now(),
      state: 'pending',
      type,
    });
    applyPendingState(type, payload);
    notify();
    return id;
  };

  return {
    addArchiveWithId(id: string, payload: ArchiveOperationPayload): string {
      return addOperation(id, 'archive', payload);
    },

    addPauseWithId(id: string, payload: PauseOperationPayload): string {
      return addOperation(id, 'pause', payload);
    },

    addToggleWithId(id: string, payload: ToggleOperationPayload): string {
      return addOperation(id, 'toggle', payload);
    },

    addArchive(payload: ArchiveOperationPayload): string {
      return addOperation(generateId(), 'archive', payload);
    },

    addPause(payload: PauseOperationPayload): string {
      return addOperation(generateId(), 'pause', payload);
    },

    addReorder(payload: ReorderOperationPayload): string {
      return addOperation(generateId(), 'reorder', payload);
    },

    addToggle(payload: ToggleOperationPayload): string {
      return addOperation(generateId(), 'toggle', payload);
    },
  };
}
