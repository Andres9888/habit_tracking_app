/**
 * Store operations (add, confirm, fail)
 */

import type {
  OptimisticOperation,
  OptimisticStore,
  ToggleOperationPayload,
  ArchiveOperationPayload,
  ReorderOperationPayload,
  PauseOperationPayload,
} from '../types';
import type { StoreListener } from './types';
import { generateId, getToggleKey } from './helpers';

export function createOperations(
  state: OptimisticStore,
  listeners: Set<StoreListener>,
  notify: () => void
) {
  return {
    addArchive(payload: ArchiveOperationPayload): string {
      const id = generateId();

      const operation: OptimisticOperation<ArchiveOperationPayload> = {
        id,
        payload,
        startedAt: Date.now(),
        state: 'pending',
        type: 'archive',
      };

      state.operations.set(id, operation);
      state.pendingArchives.set(payload.habitId, payload.toArchived);
      notify();

      return id;
    },

    addPause(payload: PauseOperationPayload): string {
      const id = generateId();

      const operation: OptimisticOperation<PauseOperationPayload> = {
        id,
        payload,
        startedAt: Date.now(),
        state: 'pending',
        type: 'pause',
      };

      state.operations.set(id, operation);
      state.pendingPauses.set(payload.habitId, payload.toPaused);
      notify();

      return id;
    },

    addReorder(payload: ReorderOperationPayload): string {
      const id = generateId();

      const operation: OptimisticOperation<ReorderOperationPayload> = {
        id,
        payload,
        startedAt: Date.now(),
        state: 'pending',
        type: 'reorder',
      };

      state.operations.set(id, operation);
      state.pendingReorder = [...payload.habitIds];
      notify();

      return id;
    },

    addToggle(payload: ToggleOperationPayload): string {
      const id = generateId();
      const key = getToggleKey(payload.habitId, payload.date);

      const operation: OptimisticOperation<ToggleOperationPayload> = {
        id,
        payload,
        startedAt: Date.now(),
        state: 'pending',
        type: 'toggle',
      };

      state.operations.set(id, operation);
      state.pendingToggles.set(key, payload.toCompleted);
      notify();

      return id;
    },
  };
}
