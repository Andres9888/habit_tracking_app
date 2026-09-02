import type { OfflineOperation, OfflineQueueState } from '../../queue';
import {
  mergeRestoredState,
  normalizeRestoredOperations,
} from '../restoreHelpers';

function op(
  id: string,
  createdAt: number,
  status: OfflineOperation['status'] = 'pending'
): OfflineOperation {
  return {
    createdAt,
    id,
    payload: { date: '2026-01-01', habitId: 'h1' as never, toCompleted: true },
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
  it('resets in-flight syncing ops to pending so they are retried', () => {
    const result = normalizeRestoredOperations([
      op('a', 1, 'syncing'),
      op('b', 2, 'failed'),
    ]);
    expect(result.map((o) => o.status)).toEqual(['pending', 'failed']);
  });
});

describe('mergeRestoredState', () => {
  it('keeps ops enqueued in memory before restore finished', () => {
    const merged = mergeRestoredState(
      state([op('mem', 50)]),
      state([op('disk', 10)])
    );
    expect(merged.operations.map((o) => o.id)).toEqual(['disk', 'mem']);
  });

  it('prefers the in-memory copy when ids collide', () => {
    const memory = { ...op('x', 10), retryCount: 3 };
    const merged = mergeRestoredState(
      state([memory]),
      state([op('x', 10, 'syncing')])
    );
    expect(merged.operations).toHaveLength(1);
    expect(merged.operations[0].retryCount).toBe(3);
    expect(merged.operations[0].status).toBe('pending');
  });

  it('replaces state wholesale when memory is empty', () => {
    const merged = mergeRestoredState(
      state([], 500),
      state([op('a', 1, 'syncing')], 100)
    );
    expect(merged.operations[0].status).toBe('pending');
    expect(merged.createdAt).toBe(100);
  });
});
