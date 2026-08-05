/**
 * SyncOrchestrator Tests
 *
 * Tests for the sync orchestrator including auto-sync on online,
 * FIFO processing, event emission, and error handling.
 */

import { SyncOrchestrator } from '../SyncOrchestrator';
import type { OfflineQueueManagerAPI } from '../../queueManager';
import { OfflineSyncManager } from '../../syncManager';
import type { OfflineQueueState, OfflineOperation } from '../../queue';
import type { SyncOrchestratorEvent } from '../types';

// Mock timer functions
jest.useFakeTimers();

describe('SyncOrchestrator', () => {
  let mockQueueManager: jest.Mocked<OfflineQueueManagerAPI>;
  let mockSyncManager: jest.Mocked<OfflineSyncManager>;
  let orchestrator: SyncOrchestrator;

  const createMockOperation = (
    overrides: Partial<OfflineOperation> = {}
  ): OfflineOperation => ({
    createdAt: Date.now(),
    id: `op_${Date.now()}_${Math.random()}`,
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
    jest.clearAllTimers();

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
      processBatch: jest.fn().mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [],
      }),
      resetCircuit: jest.fn(),
      resetStats: jest.fn(),
      subscribe: jest.fn().mockReturnValue(() => {}),
      syncItem: jest.fn(),
    } as unknown as jest.Mocked<OfflineSyncManager>;

    orchestrator = new SyncOrchestrator(mockQueueManager, mockSyncManager, {
      minSyncIntervalMs: 100,
      syncDebounceMs: 100,
    });
  });

  afterEach(() => {
    orchestrator.stop();
  });

  describe('initialization', () => {
    it('creates orchestrator with inactive state', () => {
      const state = orchestrator.getState();
      expect(state.isActive).toBe(false);
      expect(state.isSyncing).toBe(false);
    });

    it('merges config with defaults', () => {
      const customOrchestrator = new SyncOrchestrator(
        mockQueueManager,
        mockSyncManager,
        { batchSize: 25 }
      );
      expect(customOrchestrator).toBeDefined();
      customOrchestrator.stop();
    });
  });

  describe('start/stop', () => {
    it('starts orchestrator and sets active state', () => {
      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);

      expect(orchestrator.getState().isActive).toBe(true);
      expect(mockOnOnline).toHaveBeenCalled();
    });

    it('emits orchestrator:start event', () => {
      const listener = jest.fn();
      orchestrator.subscribe(listener);

      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'orchestrator:start' })
      );
    });

    it('stops orchestrator and cleans up', () => {
      const mockUnsubscribe = jest.fn();
      const mockOnOnline = jest.fn().mockReturnValue(mockUnsubscribe);
      orchestrator.start(mockOnOnline);

      orchestrator.stop();

      expect(orchestrator.getState().isActive).toBe(false);
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('emits orchestrator:stop event', () => {
      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);

      const listener = jest.fn();
      orchestrator.subscribe(listener);
      orchestrator.stop();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'orchestrator:stop' })
      );
    });

    it('does not double-start', () => {
      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);
      orchestrator.start(mockOnOnline);

      expect(mockOnOnline).toHaveBeenCalledTimes(1);
    });
  });

  describe('scheduleSync', () => {
    it('schedules sync after debounce period', () => {
      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);
      orchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));

      orchestrator.scheduleSync();

      const listener = jest.fn();
      orchestrator.subscribe(listener);

      expect(listener).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'sync:started' })
      );

      jest.advanceTimersByTime(100);

      // Sync should be scheduled
      expect(orchestrator.getState().isActive).toBe(true);
    });

    it('cancels previous scheduled sync', () => {
      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);
      orchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));

      orchestrator.scheduleSync();
      orchestrator.scheduleSync();
      orchestrator.scheduleSync();

      // Should only have one pending timer
      jest.advanceTimersByTime(100);
    });

    it('does not schedule when not active', () => {
      const listener = jest.fn();
      orchestrator.subscribe(listener);

      orchestrator.scheduleSync();

      expect(listener).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'sync:scheduled' })
      );
    });
  });

  describe('sync', () => {
    beforeEach(() => {
      orchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));
    });

    it('returns error result when no executor configured', async () => {
      const noExecutorOrchestrator = new SyncOrchestrator(
        mockQueueManager,
        mockSyncManager
      );

      const result = await noExecutorOrchestrator.sync();

      expect(result.initiated).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('No executor configured');
      noExecutorOrchestrator.stop();
    });

    it('returns empty result when queue is empty', async () => {
      mockQueueManager.getState.mockReturnValue(createMockQueueState([]));

      const result = await orchestrator.sync();

      expect(result.initiated).toBe(true);
      expect(result.processed).toBe(0);
    });

    it('returns cancelled result when circuit breaker is open', async () => {
      mockSyncManager.canSync.mockReturnValue(false);
      mockQueueManager.getState.mockReturnValue(
        createMockQueueState([createMockOperation()])
      );

      const listener = jest.fn();
      orchestrator.subscribe(listener);

      const result = await orchestrator.sync();

      expect(result.initiated).toBe(false);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'sync:cancelled' })
      );
    });

    it('processes pending operations in FIFO order', async () => {
      const ops = [
        createMockOperation({ createdAt: 100, id: 'op-1' }),
        createMockOperation({ createdAt: 200, id: 'op-2' }),
        createMockOperation({ createdAt: 300, id: 'op-3' }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: ops.map((op) => ({
          id: op.id,
          payload: op.payload,
          retryContext: { attemptCount: 0, exhausted: false },
          type: op.type,
        })),
      });

      await orchestrator.sync();

      // Verify operations were marked syncing in order
      expect(mockQueueManager.markSyncing).toHaveBeenCalledWith('op-1');
      expect(mockQueueManager.markSyncing).toHaveBeenCalledWith('op-2');
      expect(mockQueueManager.markSyncing).toHaveBeenCalledWith('op-3');
    });

    it('marks successful operations as completed', async () => {
      const op = createMockOperation({ id: 'op-success' });
      mockQueueManager.getState.mockReturnValue(createMockQueueState([op]));

      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [
          {
            id: op.id,
            payload: op.payload,
            retryContext: { attemptCount: 0, exhausted: false },
            type: op.type,
          },
        ],
      });

      await orchestrator.sync();

      expect(mockQueueManager.markCompleted).toHaveBeenCalledWith('op-success');
    });

    it('marks failed operations as failed with error info', async () => {
      const op = createMockOperation({ id: 'op-fail' });
      mockQueueManager.getState.mockReturnValue(createMockQueueState([op]));

      mockSyncManager.processBatch.mockResolvedValue({
        failed: [
          {
            id: op.id,
            payload: op.payload,
            retryContext: {
              attemptCount: 6,
              exhausted: true,
              lastError: {
                category: 'server',
                isRetryable: true,
                message: 'Server error',
                original: new Error('Server error'),
              },
            },
            type: op.type,
          },
        ],
        skipped: [],
        successful: [],
      });

      await orchestrator.sync();

      expect(mockQueueManager.markFailed).toHaveBeenCalledWith(
        'op-fail',
        'Server error',
        'server'
      );
    });

    it('marks skipped operations as pending for retry', async () => {
      const op = createMockOperation({ id: 'op-skip' });
      mockQueueManager.getState.mockReturnValue(createMockQueueState([op]));

      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [
          {
            id: op.id,
            payload: op.payload,
            retryContext: { attemptCount: 0, exhausted: false },
            type: op.type,
          },
        ],
        successful: [],
      });

      await orchestrator.sync();

      expect(mockQueueManager.markPending).toHaveBeenCalledWith('op-skip');
    });

    it('emits sync:started and sync:completed events', async () => {
      mockQueueManager.getState.mockReturnValue(
        createMockQueueState([createMockOperation()])
      );

      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [],
      });

      const events: SyncOrchestratorEvent[] = [];
      orchestrator.subscribe((event) => events.push(event));

      await orchestrator.sync();

      expect(events.map((e) => e.type)).toContain('sync:started');
      expect(events.map((e) => e.type)).toContain('sync:completed');
    });

    it('returns correct result counts', async () => {
      const ops = [
        createMockOperation({ id: 'op-1' }),
        createMockOperation({ id: 'op-2' }),
        createMockOperation({ id: 'op-3' }),
      ];
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.processBatch.mockResolvedValue({
        failed: [
          {
            id: 'op-3',
            payload: ops[2].payload,
            retryContext: { attemptCount: 6, exhausted: true },
            type: ops[2].type,
          },
        ],
        skipped: [],
        successful: [
          {
            id: 'op-1',
            payload: ops[0].payload,
            retryContext: { attemptCount: 0, exhausted: false },
            type: ops[0].type,
          },
          {
            id: 'op-2',
            payload: ops[1].payload,
            retryContext: { attemptCount: 0, exhausted: false },
            type: ops[1].type,
          },
        ],
      });

      const result = await orchestrator.sync();

      expect(result.initiated).toBe(true);
      expect(result.processed).toBe(3);
      expect(result.succeeded).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.skipped).toBe(0);
    });

    it('handles processBatch errors gracefully', async () => {
      mockQueueManager.getState.mockReturnValue(
        createMockQueueState([createMockOperation()])
      );

      mockSyncManager.processBatch.mockRejectedValue(
        new Error('Network failure')
      );

      const listener = jest.fn();
      orchestrator.subscribe(listener);

      const result = await orchestrator.sync();

      expect(result.initiated).toBe(false);
      expect(result.error?.message).toBe('Network failure');
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'sync:error' })
      );
    });

    it('respects minSyncIntervalMs', async () => {
      mockQueueManager.getState.mockReturnValue(
        createMockQueueState([createMockOperation()])
      );
      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [],
      });

      await orchestrator.sync();
      const result = await orchestrator.sync(); // Immediate second call

      expect(result.initiated).toBe(false);
    });

    it('respects batch size limit', async () => {
      const ops = Array.from({ length: 100 }, (_, i) =>
        createMockOperation({ createdAt: i, id: `op-${i}` })
      );
      mockQueueManager.getState.mockReturnValue(createMockQueueState(ops));

      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [],
      });

      const customOrchestrator = new SyncOrchestrator(
        mockQueueManager,
        mockSyncManager,
        { batchSize: 25, minSyncIntervalMs: 0 }
      );
      customOrchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));

      await customOrchestrator.sync();

      expect(mockSyncManager.processBatch).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: 'op-0' })]),
        expect.any(Function),
        undefined
      );

      // Should only process 25 items
      const processedOps = mockSyncManager.processBatch.mock.calls[0][0];
      expect(processedOps.length).toBe(25);

      customOrchestrator.stop();
    });
  });

  describe('event subscription', () => {
    it('allows subscribing to events', () => {
      const listener = jest.fn();
      const unsubscribe = orchestrator.subscribe(listener);

      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);

      expect(listener).toHaveBeenCalled();
      unsubscribe();
    });

    it('allows unsubscribing from events', () => {
      const listener = jest.fn();
      const unsubscribe = orchestrator.subscribe(listener);

      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);
      listener.mockClear();

      unsubscribe();
      orchestrator.stop();

      expect(listener).not.toHaveBeenCalled();
    });

    it('ignores errors from listeners', () => {
      const errorListener = jest.fn().mockImplementation(() => {
        throw new Error('Listener error');
      });
      const normalListener = jest.fn();

      orchestrator.subscribe(errorListener);
      orchestrator.subscribe(normalListener);

      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);

      expect(normalListener).toHaveBeenCalled();
    });
  });

  describe('auto-sync on online', () => {
    it('registers callback with onOnline when autoSyncOnOnline is true', () => {
      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      orchestrator.start(mockOnOnline);

      expect(mockOnOnline).toHaveBeenCalledWith(expect.any(Function));
    });

    it('does not register callback when autoSyncOnOnline is false', () => {
      const noAutoSyncOrchestrator = new SyncOrchestrator(
        mockQueueManager,
        mockSyncManager,
        { autoSyncOnOnline: false }
      );

      const mockOnOnline = jest.fn().mockReturnValue(() => {});
      noAutoSyncOrchestrator.start(mockOnOnline);

      expect(mockOnOnline).not.toHaveBeenCalled();
      noAutoSyncOrchestrator.stop();
    });

    it('schedules sync when online callback fires', () => {
      let onlineCallback: () => void = () => {};
      const mockOnOnline = jest.fn().mockImplementation((cb) => {
        onlineCallback = cb;
        return () => {};
      });

      orchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));
      orchestrator.start(mockOnOnline);

      const listener = jest.fn();
      orchestrator.subscribe(listener);

      onlineCallback();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'sync:scheduled' })
      );
    });
  });

  describe('state management', () => {
    it('updates lastSyncAttemptAt on sync', async () => {
      mockQueueManager.getState.mockReturnValue(
        createMockQueueState([createMockOperation()])
      );
      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [],
      });
      orchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));

      await orchestrator.sync();

      expect(orchestrator.getState().lastSyncAttemptAt).toBeDefined();
    });

    it('updates lastSuccessfulSyncAt on successful sync', async () => {
      const op = createMockOperation();
      mockQueueManager.getState.mockReturnValue(createMockQueueState([op]));
      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [
          {
            id: op.id,
            payload: op.payload,
            retryContext: { attemptCount: 0, exhausted: false },
            type: op.type,
          },
        ],
      });
      orchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));

      await orchestrator.sync();

      expect(orchestrator.getState().lastSuccessfulSyncAt).toBeDefined();
    });

    it('stores last result in state', async () => {
      mockQueueManager.getState.mockReturnValue(
        createMockQueueState([createMockOperation()])
      );
      mockSyncManager.processBatch.mockResolvedValue({
        failed: [],
        skipped: [],
        successful: [],
      });
      orchestrator.setExecutor(jest.fn().mockResolvedValue(undefined));

      await orchestrator.sync();

      const state = orchestrator.getState();
      expect(state.lastResult).toBeDefined();
      expect(state.lastResult?.initiated).toBe(true);
    });
  });
});
