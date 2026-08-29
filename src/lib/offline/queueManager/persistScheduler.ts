/** Serializes queue snapshots and coalesces pending writes to the newest state. */

import type { OfflineQueueState } from '../queue';

type SaveQueueState = (state: OfflineQueueState) => Promise<void>;

export function createPersistScheduler(save: SaveQueueState) {
  let inFlight: Promise<void> | null = null;
  let next: OfflineQueueState | null = null;

  const drain = async (initial: OfflineQueueState): Promise<void> => {
    let current: OfflineQueueState | null = initial;
    while (current) {
      try {
        await save(current);
      } catch (error) {
        if (__DEV__)
          console.error('[OfflineQueueManager] Persist failed:', error);
      }
      current = next;
      next = null;
    }
    inFlight = null;
  };

  return {
    flush(): Promise<void> {
      return inFlight ?? Promise.resolve();
    },
    schedule(state: OfflineQueueState): void {
      if (inFlight) {
        next = state;
        return;
      }
      inFlight = drain(state);
    },
  };
}
