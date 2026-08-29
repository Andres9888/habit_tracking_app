import type { OfflineQueueState } from '../../queue';
import { createPersistScheduler } from '../persistScheduler';

function state(sequence: number): OfflineQueueState {
  return {
    createdAt: sequence,
    operations: [],
    updatedAt: sequence,
    version: 1,
  };
}

describe('createPersistScheduler', () => {
  it('serializes writes and coalesces to the latest state', async () => {
    const resolvers: Array<() => void> = [];
    const saved: number[] = [];
    const save = jest.fn((queueState: OfflineQueueState) => {
      saved.push(queueState.createdAt);
      return new Promise<void>((resolve) => resolvers.push(resolve));
    });
    const scheduler = createPersistScheduler(save);

    scheduler.schedule(state(1));
    scheduler.schedule(state(2));
    scheduler.schedule(state(3));
    expect(save).toHaveBeenCalledTimes(1);

    const flushed = scheduler.flush();
    resolvers[0]();
    await Promise.resolve();
    await Promise.resolve();
    expect(saved).toEqual([1, 3]);
    expect(resolvers).toHaveLength(2);

    let didFlush = false;
    void flushed.then(() => {
      didFlush = true;
    });
    await Promise.resolve();
    expect(didFlush).toBe(false);

    resolvers[1]();
    await flushed;
    expect(didFlush).toBe(true);
  });

  it('accepts later writes after a failed save', async () => {
    const save = jest
      .fn<Promise<void>, [OfflineQueueState]>()
      .mockRejectedValueOnce(new Error('storage unavailable'))
      .mockResolvedValue(undefined);
    const scheduler = createPersistScheduler(save);

    scheduler.schedule(state(1));
    await scheduler.flush();
    scheduler.schedule(state(2));
    await scheduler.flush();

    expect(save).toHaveBeenCalledTimes(2);
  });
});
