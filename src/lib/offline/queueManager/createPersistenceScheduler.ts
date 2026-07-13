import type { OfflineQueueState } from '../queue';
import { saveQueueState } from '../persistence';

type StateGetter = () => OfflineQueueState;

/** Serialize queue writes and collapse bursts into the latest state snapshot. */
export function createPersistenceScheduler(getState: StateGetter) {
  let persistRequested = false;
  let persistenceInFlight: Promise<void> | null = null;

  return function persistLatestState(): Promise<void> {
    persistRequested = true;
    if (persistenceInFlight) return persistenceInFlight;

    persistenceInFlight = (async () => {
      while (persistRequested) {
        persistRequested = false;
        await saveQueueState(getState());
      }
    })().finally(() => {
      persistenceInFlight = null;
    });

    return persistenceInFlight;
  };
}
