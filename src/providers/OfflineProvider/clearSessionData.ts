import { getOfflineQueueManager } from '../../lib/offline';
import {
  clearLegacyQueueState,
  clearQueueState,
} from '../../lib/offline/persistence';
import { optimisticStore } from '../../lib/optimistic/store';
import {
  clearLegacyOptimisticStore,
  clearOptimisticStoreForScope,
} from '../../lib/optimistic/store/persistence';
import { optimisticHabitCreationStore } from '../../features/habits/hooks/optimisticHabitCreationStore';
import { optimisticHabitUpdateStore } from '../../features/habits/hooks/optimisticHabitUpdateStore';
import { clearQueryCacheForScope, resetQueryCache } from '../../lib/queryCache';

export async function clearSessionData(scope: string): Promise<void> {
  getOfflineQueueManager().clear({ persist: false });
  optimisticStore.reset();
  optimisticHabitCreationStore.reset();
  optimisticHabitUpdateStore.reset();
  resetQueryCache();

  await Promise.allSettled([
    clearQueueState(scope),
    clearLegacyQueueState(),
    clearOptimisticStoreForScope(scope),
    clearLegacyOptimisticStore(),
    clearQueryCacheForScope(scope),
  ]);
}
