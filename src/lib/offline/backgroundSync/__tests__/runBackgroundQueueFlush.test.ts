import * as Network from 'expo-network';

import { setBackgroundSyncTokenProvider } from '../authTokenProvider';
import { runBackgroundQueueFlush } from '../runBackgroundQueueFlush';
import { getOfflineQueueManager } from '../../queueManager';
import { processQueueUntilEmpty } from '../../sync/processQueue';

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(),
}));

jest.mock('../../../appConfig', () => ({
  convexClient: {
    mutation: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../queueManager', () => ({
  getOfflineQueueManager: jest.fn(),
}));

jest.mock('../../syncManager', () => ({
  getOfflineSyncManager: jest.fn(() => ({ canSync: jest.fn(() => true) })),
}));

jest.mock('../../sync/processQueue', () => ({
  processQueueUntilEmpty: jest.fn(),
}));

const queueManager = {
  getStats: jest.fn(),
  restore: jest.fn(),
};

describe('runBackgroundQueueFlush', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setBackgroundSyncTokenProvider(null);
    (getOfflineQueueManager as jest.Mock).mockReturnValue(queueManager);
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });
    queueManager.restore.mockResolvedValue(undefined);
    queueManager.getStats.mockReturnValue({ pendingCount: 1 });
    (processQueueUntilEmpty as jest.Mock).mockResolvedValue({ succeeded: 1 });
  });

  it('does not restore or mutate the queue when offline', async () => {
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });

    await expect(runBackgroundQueueFlush()).resolves.toBe(false);

    expect(queueManager.restore).not.toHaveBeenCalled();
    expect(processQueueUntilEmpty).not.toHaveBeenCalled();
  });

  it('does not restore or mutate the queue when internet reachability is blocked', async () => {
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: false,
    });

    await expect(runBackgroundQueueFlush()).resolves.toBe(false);

    expect(queueManager.restore).not.toHaveBeenCalled();
    expect(processQueueUntilEmpty).not.toHaveBeenCalled();
  });

  it('does not restore or mutate the queue without an auth token', async () => {
    setBackgroundSyncTokenProvider(async () => null);

    await expect(runBackgroundQueueFlush()).resolves.toBe(false);

    expect(queueManager.restore).not.toHaveBeenCalled();
    expect(processQueueUntilEmpty).not.toHaveBeenCalled();
  });

  it('restores but skips processing when no queued operations are pending', async () => {
    setBackgroundSyncTokenProvider(async () => 'token');
    queueManager.getStats.mockReturnValue({ pendingCount: 0 });

    await expect(runBackgroundQueueFlush()).resolves.toBe(false);

    expect(queueManager.restore).toHaveBeenCalledTimes(1);
    expect(processQueueUntilEmpty).not.toHaveBeenCalled();
  });

  it('returns false when a queue pass has no successful operations', async () => {
    setBackgroundSyncTokenProvider(async () => 'token');
    (processQueueUntilEmpty as jest.Mock).mockResolvedValue({ succeeded: 0 });

    await expect(runBackgroundQueueFlush()).resolves.toBe(false);

    expect(queueManager.restore).toHaveBeenCalledTimes(1);
    expect(processQueueUntilEmpty).toHaveBeenCalledWith(
      expect.objectContaining({ queueManager }),
      { batchSize: 10 },
      1
    );
  });

  it('propagates queue processing errors to the task result boundary', async () => {
    setBackgroundSyncTokenProvider(async () => 'token');
    const error = new Error('flush failed');
    (processQueueUntilEmpty as jest.Mock).mockRejectedValue(error);

    await expect(runBackgroundQueueFlush()).rejects.toThrow('flush failed');

    expect(queueManager.restore).toHaveBeenCalledTimes(1);
  });

  it('runs one queue pass when network, auth, and pending operations exist', async () => {
    setBackgroundSyncTokenProvider(async () => 'token');

    await expect(runBackgroundQueueFlush()).resolves.toBe(true);

    expect(queueManager.restore).toHaveBeenCalledTimes(1);
    expect(processQueueUntilEmpty).toHaveBeenCalledWith(
      expect.objectContaining({ queueManager }),
      { batchSize: 10 },
      1
    );
  });
});
