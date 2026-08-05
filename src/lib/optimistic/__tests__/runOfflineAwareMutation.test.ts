/**
 * Tests for runOfflineAwareMutation — offline/online/network-error branching.
 */

import { runOfflineAwareMutation } from '../runOfflineAwareMutation';
import { optimisticStore } from '../store';
import {
  getOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../offline';
import type { Id } from '../../../../convex/_generated/dataModel';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const habitId = 'habit_1' as Id<'habits'>;

function archivePayload() {
  return { habitId, habitName: 'H', toArchived: true as const };
}

function baseOptions(overrides: Record<string, unknown> = {}) {
  return {
    addOptimistic: () => optimisticStore.addArchive(archivePayload()),
    addOptimisticWithId: (id: string) =>
      optimisticStore.addArchiveWithId(id, archivePayload()),
    isOnline: true,
    queuePayload: { habitId, habitName: 'H' },
    queueType: 'archiveHabit' as const,
    serverMutation: () => Promise.resolve(),
    ...overrides,
  };
}

describe('runOfflineAwareMutation', () => {
  beforeEach(() => {
    resetOfflineQueueManager();
    optimisticStore.reset();
  });

  it('offline: enqueues and mirrors optimistically without calling server', async () => {
    const serverMutation = jest.fn(() => Promise.resolve());
    const result = await runOfflineAwareMutation(
      baseOptions({ isOnline: false, serverMutation })
    );

    expect(serverMutation).not.toHaveBeenCalled();
    expect(result.queued).toBe(true);
    expect(getOfflineQueueManager().getState().operations).toHaveLength(1);
    expect(optimisticStore.getSnapshot().pendingArchives.get(habitId)).toBe(
      true
    );
  });

  it('online success: confirms optimistic op, does not queue', async () => {
    const result = await runOfflineAwareMutation(baseOptions());

    expect(result.queued).toBe(false);
    expect(getOfflineQueueManager().getState().operations).toHaveLength(0);
    const ops = [...optimisticStore.getSnapshot().operations.values()];
    expect(ops.every((op) => op.state !== 'pending')).toBe(true);
  });

  it('network error: queues and keeps the habit hidden', async () => {
    const result = await runOfflineAwareMutation(
      baseOptions({
        serverMutation: () =>
          Promise.reject(new Error('Network request failed')),
      })
    );

    expect(result.queued).toBe(true);
    expect(getOfflineQueueManager().getState().operations).toHaveLength(1);
    expect(optimisticStore.getSnapshot().pendingArchives.get(habitId)).toBe(
      true
    );
  });

  it('non-network error: rolls back and runs onError', async () => {
    const onError = jest.fn();
    const result = await runOfflineAwareMutation(
      baseOptions({
        onError,
        serverMutation: () => Promise.reject(new Error('validation failed')),
      })
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(result.queued).toBe(false);
    expect(getOfflineQueueManager().getState().operations).toHaveLength(0);
    expect(
      optimisticStore.getSnapshot().pendingArchives.get(habitId)
    ).toBeUndefined();
  });
});
