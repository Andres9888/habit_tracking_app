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
    pendingPauses: new Map(),
    pendingReorder: null,
    pendingToggles: new Map(),
  };

  const listeners = new Set<StoreListener>();

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const operations = createOperations(state, notify);
  const stateManagement = createStateManagement(state, notify);

  return {
    getSnapshot(): OptimisticStore {
      return state;
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
