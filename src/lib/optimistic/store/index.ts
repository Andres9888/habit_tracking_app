/**
 * Optimistic update store singleton
 *
 * Manages pending optimistic updates across the application.
 * Uses a simple event-based architecture for React integration.
 */

import type { OptimisticStore } from '../types';
import type { StoreListener, OptimisticStoreAPI } from './types';
import { createOperations } from './operations';
import { createStateManagement } from './stateManagement';

const togglesEqual = (
  a: ReadonlyMap<string, boolean>,
  b: ReadonlyMap<string, boolean>
): boolean => {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (b.get(key) !== value) return false;
  }
  return true;
};

function createOptimisticStore(): OptimisticStoreAPI {
  const state: OptimisticStore = {
    operations: new Map(),
    pendingArchives: new Map(),
    pendingPauses: new Map(),
    pendingReorder: null,
    pendingToggles: new Map(),
  };
  let snapshot: OptimisticStore = {
    operations: new Map(),
    pendingArchives: new Map(),
    pendingPauses: new Map(),
    pendingReorder: null,
    pendingToggles: new Map(),
  };

  const listeners = new Set<StoreListener>();
  const latestToggleOperationIds = new Map<string, string>();

  const buildSnapshot = (): OptimisticStore => ({
    operations: new Map(state.operations),
    pendingArchives: new Map(state.pendingArchives),
    pendingPauses: new Map(state.pendingPauses),
    pendingReorder: state.pendingReorder ? [...state.pendingReorder] : null,
    pendingToggles: new Map(state.pendingToggles),
  });

  // Stable, isolated snapshot of just `pendingToggles`. Most notifies (operation
  // state changes, the 400ms operation-delete, and unrelated archive/pause/
  // reorder ops) don't touch toggles — keeping this reference identical across
  // those lets `usePendingToggles` skip re-rendering the whole habits list.
  // pendingToggles only ever holds a handful of in-flight entries, so the
  // shallow compare on each notify is negligible.
  let togglesSnapshot: Map<string, boolean> = new Map(state.pendingToggles);

  const notify = () => {
    snapshot = buildSnapshot();
    if (!togglesEqual(togglesSnapshot, state.pendingToggles)) {
      togglesSnapshot = new Map(state.pendingToggles);
    }
    for (const listener of listeners) listener();
  };

  const operations = createOperations(state, latestToggleOperationIds, notify);
  const stateManagement = createStateManagement(
    state,
    latestToggleOperationIds,
    notify
  );
  snapshot = buildSnapshot();
  togglesSnapshot = new Map(state.pendingToggles);

  return {
    getSnapshot(): OptimisticStore {
      return snapshot;
    },

    getPendingTogglesSnapshot(): Map<string, boolean> {
      return togglesSnapshot;
    },

    subscribe(listener: StoreListener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    ...operations,
    ...stateManagement,
  };
}

// Singleton instance
export const optimisticStore = createOptimisticStore();

export type { StoreListener, OptimisticStoreAPI } from './types';
