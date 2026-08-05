import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { runBackgroundQueueFlush } from './runBackgroundQueueFlush';

export const OFFLINE_QUEUE_BACKGROUND_TASK =
  'chainday.offlineQueue.backgroundFlush';

const MINIMUM_INTERVAL_MINUTES = 15;

TaskManager.defineTask(OFFLINE_QUEUE_BACKGROUND_TASK, async () => {
  try {
    await runBackgroundQueueFlush();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundSync] queue flush failed', error);
    }
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerOfflineQueueBackgroundSync(): Promise<void> {
  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    OFFLINE_QUEUE_BACKGROUND_TASK
  );
  if (isRegistered) return;

  await BackgroundTask.registerTaskAsync(OFFLINE_QUEUE_BACKGROUND_TASK, {
    minimumInterval: MINIMUM_INTERVAL_MINUTES,
  });
}
