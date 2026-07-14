import * as Network from 'expo-network';

import { setBackgroundSyncTokenProvider } from '../authTokenProvider';
import { runBackgroundMaintenance } from '../runBackgroundMaintenance';
import { runBackgroundQueueFlush } from '../runBackgroundQueueFlush';
import { prefetchQueryCacheEntry } from '../../../queryCache/prefetch';
import { reconcileHabitReminders } from '../../../../utils/notifications/reconcileHabitReminders';

const mockQuery = jest.fn();

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(),
}));

jest.mock('../../../appConfig', () => ({
  convexClient: {
    query: (...args: unknown[]) => mockQuery(...args),
  },
}));

jest.mock('../runBackgroundQueueFlush', () => ({
  runBackgroundQueueFlush: jest.fn(),
}));

jest.mock('../../../queryCache/prefetch', () => ({
  prefetchQueryCacheEntry: jest.fn(),
}));

jest.mock('../../../../utils/notifications/reconcileHabitReminders', () => ({
  reconcileHabitReminders: jest.fn(),
}));

describe('runBackgroundMaintenance', () => {
  const habits = [
    {
      _id: 'habit1',
      name: 'Read',
      reminderTime: '06:45',
      remindersEnabled: true,
    },
  ];
  const settings = { compactView: true };

  beforeEach(() => {
    jest.clearAllMocks();
    setBackgroundSyncTokenProvider(null);
    (runBackgroundQueueFlush as jest.Mock).mockResolvedValue(false);
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });
    mockQuery
      .mockResolvedValueOnce(habits)
      .mockResolvedValueOnce(settings);
    (reconcileHabitReminders as jest.Mock).mockResolvedValue({
      canceled: 0,
      scheduled: 1,
    });
    (prefetchQueryCacheEntry as jest.Mock).mockResolvedValue(undefined);
  });

  it('always runs the queue flush before reminder reconciliation and prefetch', async () => {
    setBackgroundSyncTokenProvider(async () => 'token');
    (runBackgroundQueueFlush as jest.Mock).mockResolvedValue(true);

    await expect(runBackgroundMaintenance()).resolves.toEqual({
      prefetched: true,
      queueFlushed: true,
      remindersChanged: true,
    });

    expect(runBackgroundQueueFlush).toHaveBeenCalledTimes(1);
    expect(reconcileHabitReminders).toHaveBeenCalledWith(habits);
    expect(prefetchQueryCacheEntry).toHaveBeenCalledWith({
      args: {},
      entryName: 'habits.list',
      value: habits,
    });
    expect(prefetchQueryCacheEntry).toHaveBeenCalledWith({
      args: {},
      entryName: 'settings.get',
      value: settings,
    });
  });

  it('skips reminder reconciliation and prefetch when offline', async () => {
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });

    await expect(runBackgroundMaintenance()).resolves.toEqual({
      prefetched: false,
      queueFlushed: false,
      remindersChanged: false,
    });

    expect(mockQuery).not.toHaveBeenCalled();
    expect(reconcileHabitReminders).not.toHaveBeenCalled();
    expect(prefetchQueryCacheEntry).not.toHaveBeenCalled();
  });

  it('skips reminder reconciliation and prefetch without a background auth token', async () => {
    setBackgroundSyncTokenProvider(async () => null);

    await expect(runBackgroundMaintenance()).resolves.toEqual({
      prefetched: false,
      queueFlushed: false,
      remindersChanged: false,
    });

    expect(mockQuery).not.toHaveBeenCalled();
    expect(reconcileHabitReminders).not.toHaveBeenCalled();
    expect(prefetchQueryCacheEntry).not.toHaveBeenCalled();
  });
});
