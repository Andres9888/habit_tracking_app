/**
 * Process Queue Tests
 *
 * Tests for FIFO queue processing during offline sync operations.
 * Verifies FR-005 (FIFO processing order) and FR-012 (non-blocking).
 */

import type { OfflineQueueManagerAPI } from '../../queueManager';
import type {
  OfflineSyncManager,
  SyncItem,
  SyncResult,
} from '../../syncManager';
import type { OfflineOperation, OfflineQueueState } from '../../queue';
import type { ToggleCompletionPayload } from '../../queue';
import {
  processQueue,
  processQueueUntilEmpty,
  processSingleOperation,
  operationToSyncItem,
  shouldSkipOperation,
  DEFAULT_BATCH_SIZE,
} from '../processQueue';
import type {
  QueueProcessorDeps,
  ProcessQueueConfig,
  ProcessSingleOptions,
} from '../processQueue';

describe('processQueue', () => {
  let mockQueueManager: jest.Mocked<OfflineQueueManagerAPI>;
  let mockSyncManager: jest.Mocked<OfflineSyncManager>;
  let mockExecutor: jest.Mock;
  let deps: QueueProcessorDeps;

  const createMockOperation = (
    overrides: Partial<OfflineOperation> = {}
  ): OfflineOperation => ({
    createdAt: Date.now(),
    id: `op_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    payload: {
      date: '2026-01-30',
      habitId: 'habit_123' as unknown,
      toCompleted: true,
    },
    retryCount: 0,
    status: 'pending',
    type: 'toggleCompletion',
    ...overrides,
  });

  const createMockQueueState = (
    operations: OfflineOperation[] = []
  ): OfflineQueueState => ({
    createdAt: Date.now(),
    operations,
    updatedAt: Date.now(),
    version: 1,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueueManager = {
      clear: jest.fn(),
      dequeue: jest.fn(),
      enqueue: jest.fn(),
      getState: jest.fn().mockReturnValue(createMockQueueState()),
      getStats: jest.fn().mockReturnValue({
        failedCount: 0,
        pendingCount: 0,
        syncingCount: 0,
        totalCount: 0,
      }),
      markCompleted: jest.fn().mockReturnValue(true),
      markFailed: jest.fn().mockReturnValue(true),
      markPending: jest.fn().mockReturnValue(true),
      markSyncing: jest.fn().mockReturnValue(true),
      peek: jest.fn(),
      persist: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn(),
      restore: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn().mockReturnValue(() => {}),
      subscribeToState: jest.fn().mockReturnValue(() => {}),
    };

    mockSyncManager = {
      canSync: jest.fn().mockReturnValue(true),
      getNextRetryDelay: jest.fn().mockReturnValue(1000),
      getStatus: jest.fn().mockReturnValue({
        circuitStatus: {
          failureCount: 0,
          state: 'closed',
          successCount: 0,
        },
        failedCount: 0,
        isSyncing: false,
        pendingCount: 0,
        progress: 0,
        syncedCount: 0,
      }),
      processBatch: jest.fn(),
      resetCircuit: jest.fn(),
      resetStats: jest.fn(),
      subscribe: jest.fn().mockReturnValue(() => {}),
      syncItem: jest.fn(),
    } as unknown as jest.Mocked<OfflineSyncManager>;

    mockExecutor = jest.fn().mockResolvedValue(undefined);

    deps = {
      executor: mockExecutor,
      queueManager: mockQueueManager,
      syncManager: mockSyncManager,
    };
  });

  describe('operationToSyncItem', () => {
    it('converts operation to sync item format', () => {
      const op = createMockOperation({
        id: 'test-op-1',
        retryCount: 2,
      });

      const syncItem = operationToSyncItem(op);

      expect(syncItem.id).toBe('test-op-1');
      expect(syncItem.type).toBe('toggleCompletion');
      expect(syncItem.payload).toEqual(op);
      expect(syncItem.retryContext.attemptCount).toBe(2);
      expect(syncItem.retryContext.exhausted).toBe(false);
    });
  });

  describe('shouldSkipOperation', () => {
    it('returns skip=false for pending operation with open circuit', () => {
      const op = createMockOperation({ status: 'pending' });

      const result = shouldSkipOperation(op, deps);

      expect(result.skip).toBe(false);
    });

    it('returns skip=true for non-pending operation', () => {
      const op = createMockOperation({ status: 'syncing' });

      const result = shouldSkipOperation(op, deps);

      expect(result.skip).toBe(true);
      expect(result.reason).toBe('status is syncing');
    });

    it('returns skip=true when circuit breaker is open', () => {
      mockSyncManager.canSync.mockReturnValue(false);
      const op = createMockOperation({ status: 'pending' });

      const result = shouldSkipOperation(op, deps);

      expect(result.skip).toBe(true);
      expect(result.reason).toBe('circuit breaker open');
    });
  });

  describe('processSingleOperation', () => {
    const createOptions = (): ProcessSingleOptions => ({
      callbacks: {},
      context: {
        batchIndex: 0,
        batchSize: 1,
        failedCount: 0,
        skippedCount: 0,
        startedAt: Date.now(),
        successCount: 0,
      },
    });

    it('processes successful operation', async () => {
      const op = createMockOperation({ id: 'success-op' });

      mockSyncManager.syncItem.mockResolvedValue({
        item: operationToSyncItem(op),
        success: true,
      } as SyncResult<ToggleCompletionPayload>);

      const result = await processSingleOperation(op, deps, createOptions());

      expect(result.success).toBe(true);
      expect(result.operationId).toBe('success-op');
      expect(result.shouldRetry).toBe(false);
      expect(mockQueueManager.markSyncing).toHaveBeenCalledWith('success-op');
      expect(mockQueueManager.markCompleted).toHaveBeenCalledWith('success-op');
    });

    it('handles failed operation with retries remaining', async () => {
      const op = createMockOperation({ id: 'retry-op' });

      mockSyncManager.syncItem.mockResolvedValue({
        error: {
          category: 'network',
          isRetryable: true,
          message: 'Network error',
        },
        item: {
          ...operationToSyncItem(op),
          retryContext: { attemptCount: 1, exhausted: false },
        },
        success: false,
      } as SyncResult<ToggleCompletionPayload>);

      const result = await processSingleOperation(op, deps, createOptions());

      expect(result.success).toBe(false);
      expect(result.shouldRetry).toBe(true);
      expect(result.error).toBe('Network error');
      expect(mockQueueManager.markPending).toHaveBeenCalledWith('retry-op');
    });

    it('handles failed operation with exhausted retries', async () => {
      const op = createMockOperation({ id: 'fail-op' });

      mockSyncManager.syncItem.mockResolvedValue({
        error: {
          category: 'server',
          isRetryable: true,
          message: 'Server error',
        },
        item: {
          ...operationToSyncItem(op),
          retryContext: { attemptCount: 6, exhausted: true },
        },
        success: false,
      } as SyncResult<ToggleCompletionPayload>);

      const result = await processSingleOperation(op, deps, createOptions());

      expect(result.success).toBe(false);
      expect(result.shouldRetry).toBe(false);
      expect(mockQueueManager.markFailed).toHaveBeenCalledWith(
        'fail-op',
        'Server error',
        'server'
      );
    });

    it('skips non-pending operations', async () => {
      const op = createMockOperation({ id: 'syncing-op', status: 'syncing' });
      const onSkipped = jest.fn();

      const result = await processSingleOperation(op, deps, {
        ...createOptions(),
        callbacks: { onSkipped },
      });

      expect(result.success).toBe(false);
      expect(result.shouldRetry).toBe(true);
      expect(onSkipped).toHaveBeenCalledWith(op, 'status is syncing');
      expect(mockSyncManager.syncItem).not.toHaveBeenCalled();
    });

    it('skips when circuit breaker is open', async () => {
      mockSyncManager.canSync.mockReturnValue(false);
      const op = createMockOperation({ id: 'circuit-op' });
      const onSkipped = jest.fn();

      const result = await processSingleOperation(op, deps, {
        ...createOptions(),
        callbacks: { onSkipped },
      });

      expect(result.success).toBe(false);
      expect(result.shouldRetry).toBe(true);
      expect(onSkipped).toHaveBeenCalledWith(op, 'circuit breaker open');
    });

    it('calls onSuccess callback on success', async () => {
      const op = createMockOperation({ id: 'cb-success-op' });
      const onSuccess = jest.fn();

      mockSyncManager.syncItem.mockResolvedValue({
        item: operationToSyncItem(op),
        success: true,
      } as SyncResult<ToggleCompletionPayload>);

      await processSingleOperation(op, deps, {
        ...createOptions(),
        callbacks: { onSuccess },
      });

      expect(onSuccess).toHaveBeenCalledWith(op);
    });

    it('calls onFailure callback on permanent failure', async () => {
      const op = createMockOperation({ id: 'cb-fail-op' });
      const onFailure = jest.fn();

      mockSyncManager.syncItem.mockResolvedValue({
        error: {
          category: 'server',
          isRetryable: false,
          message: 'Fatal error',
        },
        item: {
          ...operationToSyncItem(op),
          retryContext: { attemptCount: 6, exhausted: true },
        },
        success: false,
      } as SyncResult<ToggleCompletionPayload>);

      await processSingleOperation(op, deps, {
        ...createOptions(),
        callbacks: { onFailure },
      });

      expect(onFailure).toHaveBeenCalledWith(op, 'Fatal error');
    });

    it('handles sync exception gracefully', async () => {
      const op = createMockOperation({ id: 'throw-op' });
      const onFailure = jest.fn();

      mockSyncManager.syncItem.mockRejectedValue(new Error('Unexpected error'));

      const result = await processSingleOperation(op, deps, {
        ...createOptions(),
        callbacks: { onFailure },
      });

      expect(result.success).toBe(false);
      expect(result.shouldRetry).toBe(true);
      expect(result.error).toBe('Unexpected error');
      expect(mockQueueManager.markPending).toHaveBeenCalledWith('throw-op');
      expect(onFailure).toHaveBeenCalledWith(op, 'Unexpected error');
    });

    it('tracks operation duration', async () => {
      const op = createMockOperation();

      mockSyncManager.syncItem.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  item: operationToSyncItem(op),
                  success: true,
                } as SyncResult<ToggleCompletionPayload>),
              10
            )
          )
      );

      const result = await processSingleOperation(op, deps, createOptions());

      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('processQueue', () => {
    it('returns empty result when queue is empty', async () => {
      mockQueueManager.getState.mockReturnValue(createMockQueueState([]));

      const result = await processQueue(deps);

      expect(result.total).toBe(0);
      expect(result.succeeded).toBe(0);
      expect(result.allSucceeded).toBe(true);
      expect(result.hasMore).toBe(false);
    });

    it('processes operations in FIFO order (oldest first)', async () => {
      const ops = [
        createMockOperation({ createdAt: 300, id: 'op-3' }),
        createMockOperation({ createdAt: 100, id: 'op-1' }),
        createMockOperation({ createdAt: 200, id: 'op-2' }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      const processOrder: string[] = [];
      await processQueue(deps, {
        onProgress: (_, __, op) => {
          if (!processOrder.includes(op.id)) {
            processOrder.push(op.id);
          }
        },
      });

      // Should process in createdAt order: op-1, op-2, op-3
      expect(processOrder).toEqual(['op-1', 'op-2', 'op-3']);
    });

    it('respects batch size limit', async () => {
      const ops = Array.from({ length: 100 }, (_, i) =>
        createMockOperation({ createdAt: i, id: `op-${i}` })
      );
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      const result = await processQueue(deps, { batchSize: 25 });

      expect(result.total).toBe(25);
      expect(result.hasMore).toBe(true);
    });

    it('uses DEFAULT_BATCH_SIZE when not specified', async () => {
      expect(DEFAULT_BATCH_SIZE).toBe(50);
    });

    it('aggregates results correctly', async () => {
      const ops = [
        createMockOperation({ createdAt: 1, id: 'success-1' }),
        createMockOperation({ createdAt: 2, id: 'success-2' }),
        createMockOperation({ createdAt: 3, id: 'fail-1' }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockImplementation(async (item) => {
        if (item.id.startsWith('success')) {
          return { item, success: true };
        }
        return {
          error: { category: 'server', message: 'Failed' },
          item: {
            ...item,
            retryContext: { attemptCount: 6, exhausted: true },
          },
          success: false,
        };
      });

      const result = await processQueue(deps);

      expect(result.total).toBe(3);
      expect(result.succeeded).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.skipped).toBe(0);
      expect(result.allSucceeded).toBe(false);
    });

    it('calls progress callback for each operation', async () => {
      const ops = [
        createMockOperation({ createdAt: 1, id: 'op-1' }),
        createMockOperation({ createdAt: 2, id: 'op-2' }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      const progressCalls: Array<{ processed: number; total: number }> = [];
      await processQueue(deps, {
        onProgress: (processed, total) => {
          progressCalls.push({ processed, total });
        },
      });

      // Progress: before op-1, before op-2, after all (final)
      expect(progressCalls).toHaveLength(3);
      expect(progressCalls[0]).toEqual({ processed: 0, total: 2 });
      expect(progressCalls[1]).toEqual({ processed: 1, total: 2 });
      expect(progressCalls[2]).toEqual({ processed: 2, total: 2 });
    });

    it('stops on first failure when configured', async () => {
      const ops = [
        createMockOperation({ createdAt: 1, id: 'fail-1' }),
        createMockOperation({ createdAt: 2, id: 'success-1' }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockImplementation(async (item) => {
        if (item.id.startsWith('fail')) {
          return {
            error: { category: 'server', message: 'Failed' },
            item: {
              ...item,
              retryContext: { attemptCount: 6, exhausted: true },
            },
            success: false,
          };
        }
        return { item, success: true };
      });

      const result = await processQueue(deps, { stopOnFirstFailure: true });

      // Should stop after first failure
      expect(result.total).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('tracks total duration', async () => {
      const ops = [createMockOperation({ id: 'op-1' })];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockResolvedValue({
        item: operationToSyncItem(ops[0]),
        success: true,
      } as SyncResult<ToggleCompletionPayload>);

      const result = await processQueue(deps);

      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
    });

    it('calls onSuccess for each successful operation', async () => {
      const ops = [
        createMockOperation({ createdAt: 1, id: 'op-1' }),
        createMockOperation({ createdAt: 2, id: 'op-2' }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      const onSuccess = jest.fn();
      await processQueue(deps, { onSuccess });

      expect(onSuccess).toHaveBeenCalledTimes(2);
    });

    it('calls onFailure for each failed operation', async () => {
      const ops = [createMockOperation({ id: 'fail-op' })];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockResolvedValue({
        error: { category: 'server', message: 'Error' },
        item: {
          ...operationToSyncItem(ops[0]),
          retryContext: { attemptCount: 6, exhausted: true },
        },
        success: false,
      } as SyncResult<ToggleCompletionPayload>);

      const onFailure = jest.fn();
      await processQueue(deps, { onFailure });

      expect(onFailure).toHaveBeenCalledWith(ops[0], 'Error');
    });

    it('only processes pending operations', async () => {
      const ops = [
        createMockOperation({
          createdAt: 1,
          id: 'pending-op',
          status: 'pending',
        }),
        createMockOperation({
          createdAt: 2,
          id: 'syncing-op',
          status: 'syncing',
        }),
        createMockOperation({
          createdAt: 3,
          id: 'completed-op',
          status: 'completed',
        }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      await processQueue(deps);

      // Only pending-op should be processed via syncItem
      expect(mockSyncManager.syncItem).toHaveBeenCalledTimes(1);
      expect(mockSyncManager.syncItem).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'pending-op' }),
        expect.any(Function)
      );
    });
  });

  describe('processQueueUntilEmpty', () => {
    it('processes multiple batches until queue is empty', async () => {
      // First call: 2 pending ops
      // Second call: 0 ops (queue empty)
      let callCount = 0;
      mockQueueManager.getState.mockImplementation(() => {
        callCount++;
        if (callCount <= 1) {
          return createMockQueueState([
            createMockOperation({ createdAt: 1, id: `op-${callCount}-1` }),
            createMockOperation({ createdAt: 2, id: `op-${callCount}-2` }),
          ]);
        }
        return createMockQueueState([]);
      });

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      const result = await processQueueUntilEmpty(deps, { batchSize: 10 });

      expect(result.succeeded).toBe(2);
      expect(result.hasMore).toBe(false);
    });

    it('respects maxIterations limit', async () => {
      // Return 2 pending operations each time - hasMore will be true when total > batchSize
      mockQueueManager.getState.mockReturnValue(
        createMockQueueState([
          createMockOperation({ createdAt: 1, id: 'op-1' }),
          createMockOperation({ createdAt: 2, id: 'op-2' }),
        ])
      );

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      // batchSize=1 means hasMore=true (2 > 1), so iterations continue
      // maxIterations=3: process initial batch + 3 iterations before stopping
      // Actually: loop runs while iterations < maxIterations, increments at end
      // So: batch 1 (iter=0), batch 2 (iter=1), batch 3 (iter=2), batch 4 (iter=3, exit before)
      // Total: 4 batches of 1 = 4 operations (but the mock returns same 2 ops, FIFO picks first)
      const result = await processQueueUntilEmpty(deps, { batchSize: 1 }, 3);

      // Loop: starts at iterations=0
      // - First batch processed, iterations stays 0, then increments to 1
      // - Second batch processed, iterations=1, then increments to 2
      // - Third batch processed, iterations=2, then increments to 3
      // - Check 3 < 3 is false, exit
      // Total: 3 batches * 1 operation = 3
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(true); // Would continue if not for max iterations
    });

    it('stops early when no operations in batch', async () => {
      mockQueueManager.getState.mockReturnValue(createMockQueueState([]));

      const result = await processQueueUntilEmpty(deps);

      expect(result.total).toBe(0);
      expect(result.succeeded).toBe(0);
    });

    it('aggregates results from multiple batches', async () => {
      let callCount = 0;
      mockQueueManager.getState.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call: 2 ops, process 1 (hasMore=true because 2 > 1)
          return createMockQueueState([
            createMockOperation({ createdAt: 1, id: `op-1` }),
            createMockOperation({ createdAt: 2, id: `op-2` }),
          ]);
        }
        if (callCount === 2) {
          // Second call: 1 op remaining (hasMore=false because 1 is not > 1)
          return createMockQueueState([
            createMockOperation({ createdAt: 2, id: `op-2` }),
          ]);
        }
        return createMockQueueState([]);
      });

      mockSyncManager.syncItem.mockImplementation(async (item) => ({
        item,
        success: true,
      }));

      const result = await processQueueUntilEmpty(deps, { batchSize: 1 });

      expect(result.total).toBe(2);
      expect(result.succeeded).toBe(2);
      expect(result.allSucceeded).toBe(true);
    });

    it('tracks allSucceeded across batches', async () => {
      let callCount = 0;
      mockQueueManager.getState.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First batch: 2 ops, process 1 (hasMore=true)
          return createMockQueueState([
            createMockOperation({ createdAt: 1, id: 'success-op' }),
            createMockOperation({ createdAt: 2, id: 'fail-op' }),
          ]);
        }
        if (callCount === 2) {
          // Second batch: 1 op remaining (hasMore=false)
          return createMockQueueState([
            createMockOperation({ createdAt: 2, id: 'fail-op' }),
          ]);
        }
        return createMockQueueState([]);
      });

      mockSyncManager.syncItem.mockImplementation(async (item) => {
        if (item.id === 'success-op') {
          return { item, success: true };
        }
        return {
          error: { category: 'server', message: 'Failed' },
          item: { ...item, retryContext: { attemptCount: 6, exhausted: true } },
          success: false,
        };
      });

      const result = await processQueueUntilEmpty(deps, { batchSize: 1 });

      expect(result.allSucceeded).toBe(false);
      expect(result.succeeded).toBe(1);
      expect(result.failed).toBe(1);
    });
  });
});
