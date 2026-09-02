/**
 * Persist Scheduler
 *
 * Serializes queue persistence so concurrent state changes never interleave
 * their two-phase writes (which could leave a stale snapshot on disk).
 * Writes are coalesced: while one save is in flight, only the latest
 * requested state is kept; intermediate states are skipped.
 */

import type { OfflineQueueState } from '../queue';

type Saver = (state: OfflineQueueState) => Promise<void>;

export function createPersistScheduler(save: Saver) {
  let inFlight: Promise<void> | null = null;
  let next: OfflineQueueState | null = null;

  const run = async (state: OfflineQueueState): Promise<void> => {
    try {
      await save(state);
    } catch (error) {
      if (__DEV__)
        console.error('[OfflineQueueManager] Persist failed:', error);
    }
    if (next) {
      const pending = next;
      next = null;
      inFlight = run(pending);
    } else {
      inFlight = null;
    }
  };

  return {
    /** Wait for any in-flight and queued writes to finish. */
    flush(): Promise<void> {
      return inFlight ?? Promise.resolve();
    },
    schedule(state: OfflineQueueState): void {
      if (inFlight) {
        next = state;
        return;
      }
      inFlight = run(state);
    },
  };
}
