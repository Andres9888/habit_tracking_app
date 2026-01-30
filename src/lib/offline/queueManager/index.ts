/**
 * Offline Queue Manager
 *
 * Manages the offline operation queue for habit completions.
 * Implements FR-001 (store completions locally), FR-003 (persist across restarts),
 * FR-005 (FIFO processing), and FR-011 (handle 500+ operations).
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
import type {
  OfflineQueueState,
  OfflineQueueStats,
  QueueEvent,
} from '../queue';
import { loadQueueState, saveQueueState } from '../persistence';
import { calculateStats } from './helpers';
import { createOperations } from './operations';
import { createStatusUpdaters } from './status';

export function createOfflineQueueManager(
  config: OfflineQueueManagerConfig = {}
): OfflineQueueManagerAPI {
  const { autoPersist = true } = config;

  // Internal state
  let state: OfflineQueueState = {
    ...DEFAULT_QUEUE_STATE,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: OFFLINE_QUEUE_VERSION,
  };

  const listeners = new Set<QueueStateListener>();
  const eventListeners = new Set<QueueEventCallback>();

  // Notify state listeners (for React integration)
  const notifyStateChange = () => {
    state = { ...state, updatedAt: Date.now() };
    for (const listener of listeners) listener();

    // Auto-persist if enabled
    if (autoPersist) {
      saveQueueState(state).catch((error) => {
        console.error('[OfflineQueueManager] Failed to persist queue:', error);
      });
    }
  };

  // Emit queue events
  const emit = (event: QueueEvent) => {
    for (const callback of eventListeners) {
      try {
        callback(event);
      } catch {
        /* ignore callback errors */
      }
    }
  };

  // Create operation and status handlers
  const operations = createOperations(
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

  return {
    // State accessors
    getState(): OfflineQueueState {
      return state;
    },

    getStats(): OfflineQueueStats {
      return calculateStats(state);
    },

    // Operations (delegated to operations.ts)
    ...operations,

    // Status updaters (delegated to status.ts)
    ...statusUpdaters,

    // Persistence
    async persist(): Promise<void> {
      await saveQueueState(state);
    },

    async restore(): Promise<void> {
      const restored = await loadQueueState();
      state = restored;
      notifyStateChange();
      emit({
        stats: calculateStats(state),
        timestamp: Date.now(),
        type: 'queue:restored',
      });
    },

    // Event subscription
    subscribe(callback: QueueEventCallback): () => void {
      eventListeners.add(callback);
      return () => eventListeners.delete(callback);
    },
  };
}

// Default singleton instance
let defaultInstance: OfflineQueueManagerAPI | null = null;

export function getOfflineQueueManager(): OfflineQueueManagerAPI {
  if (!defaultInstance) {
    defaultInstance = createOfflineQueueManager();
  }
  return defaultInstance;
}

export function resetOfflineQueueManager(): void {
  defaultInstance = null;
}

// Type exports
export type {
  OfflineQueueManagerAPI,
  OfflineQueueManagerConfig,
} from './types';
