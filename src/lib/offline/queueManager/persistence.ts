import type { OfflineQueueState, QueueEvent } from '../queue';
import { loadQueueState } from '../persistence';
import { calculateStats } from './helpers';
import type { createPersistScheduler } from './persistScheduler';
import { mergeRestoredState } from './restoreHelpers';

interface ManagerPersistenceArgs {
  emit: (event: QueueEvent) => void;
  getState: () => OfflineQueueState;
  notify: () => void;
  scheduler: ReturnType<typeof createPersistScheduler>;
  setState: (state: OfflineQueueState) => void;
}

export function createManagerPersistence({
  emit,
  getState,
  notify,
  scheduler,
  setState,
}: ManagerPersistenceArgs) {
  return {
    async persist(): Promise<void> {
      scheduler.schedule(getState());
      await scheduler.flush();
    },
    async restore(): Promise<void> {
      const restored = await loadQueueState();
      setState(mergeRestoredState(getState(), restored));
      notify();
      emit({
        stats: calculateStats(getState()),
        timestamp: Date.now(),
        type: 'queue:restored',
      });
    },
  };
}
