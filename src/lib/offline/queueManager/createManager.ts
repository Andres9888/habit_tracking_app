/**
 * Create Offline Queue Manager
 *
 * Factory function for creating queue manager instances.
 *
 * @see docs/offline-habit-sync.md
 */

import type {
  OfflineQueueManagerAPI,
  OfflineQueueManagerConfig,
  QueueEventCallback,
  QueueStateListener,
} from './types';
import { DEFAULT_QUEUE_STATE, OFFLINE_QUEUE_VERSION } from '../queue';
import type { OfflineQueueState, QueueEvent } from '../queue';
import { loadQueueState, saveQueueState } from '../persistence';
import { calculateStats } from './helpers';
import { createOperations } from './operations';
import { createBatchOperations } from './optimized';
import { createStatusUpdaters } from './status';
import { createPersistScheduler } from './persistScheduler';
import { mergeRestoredState } from './restoreHelpers';

export function createOfflineQueueManager(
  config: OfflineQueueManagerConfig = {}
): OfflineQueueManagerAPI {
  const { autoPersist = true } = config;

  let state: OfflineQueueState = {
    ...DEFAULT_QUEUE_STATE,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: OFFLINE_QUEUE_VERSION,
  };

  const listeners = new Set<QueueStateListener>();
  const eventListeners = new Set<QueueEventCallback>();
  const persistScheduler = createPersistScheduler(saveQueueState);

  const notifyStateChange = (options?: { persist?: boolean }) => {
    state = { ...state, updatedAt: Date.now() };
    for (const listener of listeners) listener();
    if (autoPersist && options?.persist !== false) {
      persistScheduler.schedule(state);
    }
  };

  const emit = (event: QueueEvent) => {
    for (const cb of eventListeners) {
      try {
        cb(event);
      } catch {
        /* ignore */
      }
    }
  };

  const ops = createOperations(
    () => state,
    (s) => {
      state = s;
    },
    notifyStateChange,
    emit
  );
  const statusUpdaters = createStatusUpdaters(
    () => state,
    (s) => {
      state = s;
    },
    notifyStateChange,
    emit
  );
  const batchOps = createBatchOperations(
    () => state,
    (s) => {
      state = s;
    },
    notifyStateChange,
    emit
  );

  return {
    getState: () => state,
    getStats: () => calculateStats(state),
    ...ops,
    ...statusUpdaters,
    ...batchOps,
    persist: async () => {
      persistScheduler.schedule(state);
      await persistScheduler.flush();
    },
    async restore() {
      const restored = await loadQueueState();
      state = mergeRestoredState(state, restored);
      notifyStateChange();
      emit({
        stats: calculateStats(state),
        timestamp: Date.now(),
        type: 'queue:restored',
      });
    },
    subscribe: (cb: QueueEventCallback) => {
      eventListeners.add(cb);
      return () => eventListeners.delete(cb);
    },
    subscribeToState: (cb: QueueStateListener) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}
