import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import {
  OFFLINE_QUEUE_BACKGROUND_TASK,
  registerOfflineQueueBackgroundSync,
} from '../registerBackgroundSync';
import { runBackgroundQueueFlush } from '../runBackgroundQueueFlush';

jest.mock('expo-background-task', () => ({
  BackgroundTaskResult: {
    Failed: 2,
    Success: 1,
  },
  BackgroundTaskStatus: {
    Available: 2,
    Restricted: 1,
  },
  getStatusAsync: jest.fn(),
  registerTaskAsync: jest.fn(),
}));

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn(),
}));

jest.mock('../runBackgroundQueueFlush', () => ({
  runBackgroundQueueFlush: jest.fn(),
}));

describe('registerOfflineQueueBackgroundSync', () => {
  beforeEach(() => {
    (BackgroundTask.getStatusAsync as jest.Mock).mockReset();
    (BackgroundTask.registerTaskAsync as jest.Mock).mockReset();
    (TaskManager.isTaskRegisteredAsync as jest.Mock).mockReset();
    (runBackgroundQueueFlush as jest.Mock).mockReset();
    (BackgroundTask.getStatusAsync as jest.Mock).mockResolvedValue(
      BackgroundTask.BackgroundTaskStatus.Available
    );
    (BackgroundTask.registerTaskAsync as jest.Mock).mockResolvedValue(undefined);
    (TaskManager.isTaskRegisteredAsync as jest.Mock).mockResolvedValue(false);
    (runBackgroundQueueFlush as jest.Mock).mockResolvedValue(true);
  });

  it('defines the queue flush task at module scope', () => {
    expect(TaskManager.defineTask).toHaveBeenCalledWith(
      OFFLINE_QUEUE_BACKGROUND_TASK,
      expect.any(Function)
    );
  });

  it('skips registration when background tasks are restricted', async () => {
    (BackgroundTask.getStatusAsync as jest.Mock).mockResolvedValue(
      BackgroundTask.BackgroundTaskStatus.Restricted
    );

    await expect(registerOfflineQueueBackgroundSync()).resolves.toBeUndefined();

    expect(TaskManager.isTaskRegisteredAsync).not.toHaveBeenCalled();
    expect(BackgroundTask.registerTaskAsync).not.toHaveBeenCalled();
  });

  it('skips registration when the queue task is already registered', async () => {
    (TaskManager.isTaskRegisteredAsync as jest.Mock).mockResolvedValue(true);

    await expect(registerOfflineQueueBackgroundSync()).resolves.toBeUndefined();

    expect(TaskManager.isTaskRegisteredAsync).toHaveBeenCalledWith(
      OFFLINE_QUEUE_BACKGROUND_TASK
    );
    expect(BackgroundTask.registerTaskAsync).not.toHaveBeenCalled();
  });

  it('registers the queue task at the platform minimum interval when available', async () => {
    await expect(registerOfflineQueueBackgroundSync()).resolves.toBeUndefined();

    expect(BackgroundTask.registerTaskAsync).toHaveBeenCalledWith(
      OFFLINE_QUEUE_BACKGROUND_TASK,
      { minimumInterval: 15 }
    );
  });

  it('propagates registration status errors to the startup caller', async () => {
    (BackgroundTask.getStatusAsync as jest.Mock).mockRejectedValue(
      new Error('status unavailable')
    );

    await expect(registerOfflineQueueBackgroundSync()).rejects.toThrow(
      'status unavailable'
    );

    expect(TaskManager.isTaskRegisteredAsync).not.toHaveBeenCalled();
    expect(BackgroundTask.registerTaskAsync).not.toHaveBeenCalled();
  });

  it('propagates registerTaskAsync failures to the startup caller', async () => {
    (BackgroundTask.registerTaskAsync as jest.Mock).mockRejectedValue(
      new Error('native registration failed')
    );

    await expect(registerOfflineQueueBackgroundSync()).rejects.toThrow(
      'native registration failed'
    );
  });
});

describe('offline queue background task callback', () => {
  function getTaskCallback() {
    const definition = (TaskManager.defineTask as jest.Mock).mock.calls.find(
      ([taskName]) => taskName === OFFLINE_QUEUE_BACKGROUND_TASK
    );
    return definition?.[1] as (() => Promise<number>) | undefined;
  }

  beforeEach(() => {
    (runBackgroundQueueFlush as jest.Mock).mockReset();
    (runBackgroundQueueFlush as jest.Mock).mockResolvedValue(true);
  });

  it('returns success after a completed queue flush', async () => {
    await expect(getTaskCallback()?.()).resolves.toBe(
      BackgroundTask.BackgroundTaskResult.Success
    );
  });

  it('returns failed when queue flushing throws', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    (runBackgroundQueueFlush as jest.Mock).mockRejectedValue(
      new Error('flush failed')
    );

    await expect(getTaskCallback()?.()).resolves.toBe(
      BackgroundTask.BackgroundTaskResult.Failed
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[backgroundSync] queue flush failed',
      expect.any(Error)
    );
    warnSpy.mockRestore();
  });
});
