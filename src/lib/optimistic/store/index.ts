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

function createOptimisticStore(): OptimisticStoreAPI {
  const state: OptimisticStore = {
    operations: new Map(),
    pendingArchives: new Map(),
    pendingDeletes: new Map(),
    pendingPauses: new Map(),
    pendingReorder: null,
    pendingToggles: new Map(),
  };
  let snapshot: OptimisticStore = {
    operations: new Map(),
    pendingArchives: new Map(),
    pendingDeletes: new Map(),
    pendingPauses: new Map(),
    pendingReorder: null,
    pendingToggles: new Map(),
  };

  const listeners = new Set<StoreListener>();

  const buildSnapshot = (): OptimisticStore => ({
    operations: new Map(state.operations),
    pendingArchives: new Map(state.pendingArchives),
    pendingDeletes: new Map(state.pendingDeletes),
    pendingPauses: new Map(state.pendingPauses),
    pendingReorder: state.pendingReorder ? [...state.pendingReorder] : null,
    pendingToggles: new Map(state.pendingToggles),
  });

  const notify = () => {
    snapshot = buildSnapshot();
    for (const listener of listeners) listener();
  };

  const operations = createOperations(state, notify);
  const stateManagement = createStateManagement(state, notify);
  snapshot = buildSnapshot();

  return {
    getSnapshot(): OptimisticStore {
      return snapshot;
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
