import type {
  OfflineQueueManagerAPI,
  OfflineQueueManagerConfig,
  QueueEventCallback,
  QueueStateListener,
} from './types';
import type { OfflineQueueState, QueueEvent } from '../queue';
import { saveQueueState } from '../persistence';
import { calculateStats } from './helpers';
import { createOperations } from './operations';
import { createBatchOperations } from './optimized';
import { createStatusUpdaters } from './status';
import { createPersistScheduler } from './persistScheduler';
import { createManagerPersistence } from './persistence';
import { createInitialQueueState } from './initialState';

export function createOfflineQueueManager(
  config: OfflineQueueManagerConfig = {}
): OfflineQueueManagerAPI {
  const { autoPersist = true } = config;

  let state: OfflineQueueState = createInitialQueueState();

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
  const persistence = createManagerPersistence({
    emit,
    getState: () => state,
    notify: notifyStateChange,
    scheduler: persistScheduler,
    setState: (nextState) => {
      state = nextState;
    },
  });

  return {
    getState: () => state,
    getStats: () => calculateStats(state),
    ...ops,
    ...statusUpdaters,
    ...batchOps,
    ...persistence,
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
