import type { OfflineQueueState } from '../queue';
import { createOfflineQueueManager } from './createManager';
import { saveQueueState } from '../persistence';

jest.mock('../persistence', () => ({
  loadQueueState: jest.fn(),
  saveQueueState: jest.fn(),
}));

const saveQueueStateMock = saveQueueState as jest.MockedFunction<
  typeof saveQueueState
>;

describe('offline queue persistence scheduling', () => {
  beforeEach(() => {
    saveQueueStateMock.mockReset();
  });

  it('serializes writes and coalesces rapid changes into the latest state', async () => {
    let releaseFirstWrite!: () => void;
    saveQueueStateMock
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            releaseFirstWrite = resolve;
          })
      )
      .mockResolvedValue(undefined);

    const manager = createOfflineQueueManager();
    const payload = {
      habitId: 'habit_123' as never,
      toCompleted: true,
    };

    manager.enqueue('toggleCompletion', { ...payload, date: '2026-07-10' });
    manager.enqueue('toggleCompletion', { ...payload, date: '2026-07-11' });
    manager.enqueue('toggleCompletion', { ...payload, date: '2026-07-12' });

    expect(saveQueueStateMock).toHaveBeenCalledTimes(1);
    releaseFirstWrite();
    await Promise.resolve();
    await Promise.resolve();

    expect(saveQueueStateMock).toHaveBeenCalledTimes(2);
    const latestState = saveQueueStateMock.mock
      .calls[1][0] as OfflineQueueState;
    expect(latestState.operations).toHaveLength(3);
  });
});
