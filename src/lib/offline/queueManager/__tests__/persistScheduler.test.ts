import type { OfflineQueueState } from '../../queue';
import { createPersistScheduler } from '../persistScheduler';

function state(n: number): OfflineQueueState {
  return { createdAt: n, operations: [], updatedAt: n, version: 1 };
}

describe('createPersistScheduler', () => {
  it('serializes writes and coalesces to the latest state', async () => {
    const resolvers: Array<() => void> = [];
    const saved: number[] = [];
    const save = jest.fn((s: OfflineQueueState) => {
      saved.push(s.createdAt);
      return new Promise<void>((resolve) => resolvers.push(resolve));
    });
    const scheduler = createPersistScheduler(save);

    scheduler.schedule(state(1));
    scheduler.schedule(state(2));
    scheduler.schedule(state(3));
    expect(save).toHaveBeenCalledTimes(1);

    resolvers[0]();
    await scheduler.flush();
    expect(saved).toEqual([1, 3]);
  });

  it('keeps going after a failed save', async () => {
    const save = jest
      .fn<Promise<void>, [OfflineQueueState]>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(undefined);
    const scheduler = createPersistScheduler(save);
    scheduler.schedule(state(1));
    await scheduler.flush();
    scheduler.schedule(state(2));
    await scheduler.flush();
    expect(save).toHaveBeenCalledTimes(2);
  });
});
