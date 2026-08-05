import * as Network from 'expo-network';

import { api } from '../../../../convex/_generated/api';
import { convexClient } from '../../appConfig';
import { getOfflineQueueManager } from '../queueManager';
import { getOfflineSyncManager } from '../syncManager';
import { createSyncExecutor } from '../sync/createSyncExecutor';
import { processQueueUntilEmpty } from '../sync/processQueue';
import { getBackgroundSyncToken } from './authTokenProvider';

const BACKGROUND_BATCH_SIZE = 10;

export async function runBackgroundQueueFlush(): Promise<boolean> {
  const networkState = await Network.getNetworkStateAsync();
  if (
    networkState.isConnected === false ||
    networkState.isInternetReachable === false
  ) {
    return false;
  }

  const token = await getBackgroundSyncToken();
  if (!token || !convexClient) return false;
  const client = convexClient;

  const queueManager = getOfflineQueueManager();
  await queueManager.restore();

  if (queueManager.getStats().pendingCount === 0) return false;

  const syncManager = getOfflineSyncManager({
    getPendingCount: () => queueManager.getStats().pendingCount,
  });
  const executor = createSyncExecutor({
    archiveHabit: (args) => client.mutation(api.habits.archive, args),
    createHabit: (args) => client.mutation(api.habits.create, args),
    pauseHabit: (args) => client.mutation(api.habits.pause, args),
    removeHabit: (args) => client.mutation(api.habits.remove, args),
    toggleHabit: (args) => client.mutation(api.habits.toggleHabit, args),
    updateHabit: (args) => client.mutation(api.habits.update, args),
  });

  const result = await processQueueUntilEmpty(
    { executor, queueManager, syncManager },
    { batchSize: BACKGROUND_BATCH_SIZE },
    1
  );

  return result.succeeded > 0;
}
