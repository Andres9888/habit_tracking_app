import * as Network from 'expo-network';

import { api } from '../../../../convex/_generated/api';
import { convexClient } from '../../appConfig';
import { prefetchQueryCacheEntry } from '../../queryCache/prefetch';
import { reconcileHabitReminders } from '../../../utils/notifications/reconcileHabitReminders';
import { getBackgroundSyncToken } from './authTokenProvider';
import { runBackgroundQueueFlush } from './runBackgroundQueueFlush';

export type BackgroundMaintenanceResult = {
  prefetched: boolean;
  queueFlushed: boolean;
  remindersChanged: boolean;
};

async function canRunNetworkMaintenance(): Promise<boolean> {
  const networkState = await Network.getNetworkStateAsync();
  if (
    networkState.isConnected === false ||
    networkState.isInternetReachable === false
  ) {
    return false;
  }

  const token = await getBackgroundSyncToken();
  return Boolean(token && convexClient);
}

export async function runBackgroundMaintenance(): Promise<BackgroundMaintenanceResult> {
  const queueFlushed = await runBackgroundQueueFlush();

  if (!(await canRunNetworkMaintenance()) || !convexClient) {
    return { prefetched: false, queueFlushed, remindersChanged: false };
  }

  const client = convexClient;
  const [habits, settings] = await Promise.all([
    client.query(api.habits.list, {}),
    client.query(api.settings.get, {}),
  ]);

  const reminderResult = await reconcileHabitReminders(
    Array.isArray(habits) ? habits : []
  );

  await Promise.all([
    prefetchQueryCacheEntry({
      args: {},
      entryName: 'habits.list',
      value: habits,
    }),
    prefetchQueryCacheEntry({
      args: {},
      entryName: 'settings.get',
      value: settings,
    }),
  ]);

  return {
    prefetched: true,
    queueFlushed,
    remindersChanged: reminderResult.canceled > 0 || reminderResult.scheduled > 0,
  };
}
