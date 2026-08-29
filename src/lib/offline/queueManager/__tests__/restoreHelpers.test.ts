import type { Id } from '../../../../../convex/_generated/dataModel';
import type { OfflineOperation, OfflineQueueState } from '../../queue';
import {
  mergeRestoredState,
  normalizeRestoredOperations,
} from '../restoreHelpers';

function operation(
  id: string,
  createdAt: number,
  status: OfflineOperation['status'] = 'pending'
): OfflineOperation {
  return {
    createdAt,
    id,
    payload: {
      date: '2026-01-01',
      habitId: 'habit_1' as Id<'habits'>,
      toCompleted: true,
    },
    retryCount: 0,
    status,
    type: 'toggleCompletion',
  };
}

function state(
  operations: OfflineOperation[],
  createdAt = 100
): OfflineQueueState {
  return { createdAt, operations, updatedAt: createdAt, version: 1 };
}

describe('normalizeRestoredOperations', () => {
  it('resets in-flight operations so a later sync retries them', () => {
    const result = normalizeRestoredOperations([
      operation('a', 1, 'syncing'),
      operation('b', 2, 'failed'),
    ]);

    expect(result.map(({ status }) => status)).toEqual(['pending', 'failed']);
  });
});

describe('mergeRestoredState', () => {
  it('keeps operations enqueued while restore was loading', () => {
    const merged = mergeRestoredState(
      state([operation('memory', 50)]),
      state([operation('disk', 10)])
    );

    expect(merged.operations.map(({ id }) => id)).toEqual(['disk', 'memory']);
  });

  it('prefers the in-memory copy when operation IDs collide', () => {
    const inMemory = { ...operation('same', 10), retryCount: 3 };
    const merged = mergeRestoredState(
      state([inMemory]),
      state([operation('same', 10, 'syncing')])
    );

    expect(merged.operations).toHaveLength(1);
    expect(merged.operations[0]).toMatchObject({
      retryCount: 3,
      status: 'pending',
    });
  });

  it('normalizes a restored queue when memory is empty', () => {
    const merged = mergeRestoredState(
      state([], 500),
      state([operation('a', 1, 'syncing')], 100)
    );

    expect(merged.operations[0].status).toBe('pending');
    expect(merged.createdAt).toBe(100);
  });
});
