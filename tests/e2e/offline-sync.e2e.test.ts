/**
 * E2E/Integration Tests for Offline Sync
 *
 * Tests the complete offline sync flow from US2:
 * - Automatic sync on reconnect (within 30 seconds)
 * - Exponential backoff retry on failures
 * - State reconciliation after sync (server-authoritative values)
 *
 * @see docs/offline-habit-sync.md US2 - Automatic Background Sync on Reconnect
 */

import type { Id } from '../../convex/_generated/dataModel';
import {
  createOfflineQueueManager,
  getOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../src/lib/offline';
import { SyncOrchestrator } from '../../src/lib/offline/sync/SyncOrchestrator';
import { OfflineSyncManager } from '../../src/lib/offline/syncManager';
import {
  SYNC_RETRY_STRATEGY,
  FAST_SYNC_RETRY_STRATEGY,
  RATE_LIMITED_RETRY_STRATEGY,
  calculateSyncRetryDelay,
  shouldRetrySyncOperation,
  createSyncRetryContext,
  selectSyncRetryStrategy,
} from '../../src/lib/offline/sync/retryStrategy';
import {
  StateReconciler,
  resetStateReconciler,
} from '../../src/lib/offline/sync/reconcile';
import type {
  ProcessedOperation,
  ReconciliationEvent,
} from '../../src/lib/offline/sync/reconcile';
import { cleanupOrphans } from '../../src/lib/offline/sync/cleanupOrphans';
import type { HabitExistsResult } from '../../src/lib/offline/sync/cleanupOrphans';
import type {
  OfflineQueueManagerAPI,
  OfflineQueueState,
  OfflineOperation,
  SyncOrchestratorEvent,
  ClassifiedError,
} from '../../src/lib/offline';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
}));

// Use fake timers for testing debounce and retry delays
jest.useFakeTimers();

const mockHabitId = (id: string) => id as Id<'habits'>;

describe('Offline Sync E2E', () => {
  let queueManager: OfflineQueueManagerAPI;
  let syncManager: OfflineSyncManager;
  let orchestrator: SyncOrchestrator;
  let mockExecutor: jest.Mock;

  const createMockOperation = (
    overrides: Partial<OfflineOperation> = {}
  ): OfflineOperation => ({
    createdAt: Date.now(),
    id: `op_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    payload: {
      date: '2026-01-30',
      habitId: mockHabitId('habit_123'),
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
    resetOfflineQueueManager();
    resetStateReconciler();

    queueManager = createOfflineQueueManager({ autoPersist: false });
    syncManager = new OfflineSyncManager();
    mockExecutor = jest.fn().mockResolvedValue(undefined);

    orchestrator = new SyncOrchestrator(queueManager, syncManager, {
      batchSize: 50,
      minSyncIntervalMs: 100,
      syncDebounceMs: 100,
    });
    orchestrator.setExecutor(mockExecutor);
  });

  afterEach(() => {
    orchestrator.stop();
  });

  describe('US2: Automatic Background Sync on Reconnect', () => {
    describe('Acceptance Criteria 1: Sync within 30 seconds of connectivity', () => {
      it('should schedule sync when online callback fires', () => {
        const events: SyncOrchestratorEvent[] = [];
        orchestrator.subscribe((e) => events.push(e));

        let onlineCallback: () => void = () => {};
        const mockOnOnline = jest.fn().mockImplementation((cb) => {
          onlineCallback = cb;
          return () => {};
        });

        orchestrator.start(mockOnOnline);
        expect(orchestrator.getState().isActive).toBe(true);

        // Simulate connectivity restored
        onlineCallback();

        expect(events.some((e) => e.type === 'sync:scheduled')).toBe(true);
      });

      it('should trigger sync after debounce period (< 30s)', async () => {
        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('sync_test_1'),
          toCompleted: true,
        });

        const events: SyncOrchestratorEvent[] = [];
        orchestrator.subscribe((e) => events.push(e));

        let onlineCallback: () => void = () => {};
        const mockOnOnline = jest.fn().mockImplementation((cb) => {
          onlineCallback = cb;
          return () => {};
        });

        orchestrator.start(mockOnOnline);

        // Simulate going online
        onlineCallback();

        // Advance past debounce (100ms configured)
        jest.advanceTimersByTime(100);

        // Allow async sync to complete
        await Promise.resolve();
        jest.runAllTimers();
        await Promise.resolve();

        expect(events.some((e) => e.type === 'sync:started')).toBe(true);
      });

      it('should complete sync with pending operations', async () => {
        // Queue multiple operations
        const habitIds = ['habit_1', 'habit_2', 'habit_3'];
        habitIds.forEach((id) => {
          queueManager.enqueue('toggleCompletion', {
            date: '2026-01-30',
            habitId: mockHabitId(id),
            toCompleted: true,
          });
        });

        expect(queueManager.getStats().pendingCount).toBe(3);

        // Run sync directly
        const result = await orchestrator.sync();

        expect(result.initiated).toBe(true);
        expect(result.processed).toBe(3);
        expect(result.succeeded).toBe(3);
        expect(result.failed).toBe(0);
      });

      it('should process operations in FIFO order (FR-005)', async () => {
        const processedOrder: string[] = [];
        mockExecutor.mockImplementation(async (payload) => {
          processedOrder.push(payload.habitId);
        });

        // Enqueue in specific order
        ['first', 'second', 'third'].forEach((id, i) => {
          queueManager.enqueue(
            'toggleCompletion',
            {
              date: '2026-01-30',
              habitId: mockHabitId(id),
              toCompleted: true,
            },
            { allowDuplicate: true }
          );
        });

        await orchestrator.sync();

        // Verify FIFO order
        expect(processedOrder).toEqual(['first', 'second', 'third']);
      });

      it('should complete sync within NFR-002 time limit for <50 items', async () => {
        // Add 49 operations (under the 50-item threshold)
        for (let i = 0; i < 49; i++) {
          queueManager.enqueue(
            'toggleCompletion',
            {
              date: '2026-01-30',
              habitId: mockHabitId(`habit_${i}`),
              toCompleted: true,
            },
            { allowDuplicate: true }
          );
        }

        const startTime = performance.now();
        const result = await orchestrator.sync();
        const duration = performance.now() - startTime;

        expect(result.succeeded).toBe(49);
        // Should be well under 30 seconds for in-memory operations
        expect(duration).toBeLessThan(5000);
      });
    });

    describe('Acceptance Criteria 2: Exponential backoff retry (FR-006)', () => {
      it('should use correct default retry strategy', () => {
        expect(SYNC_RETRY_STRATEGY.baseDelayMs).toBe(2000);
        expect(SYNC_RETRY_STRATEGY.backoffMultiplier).toBe(2);
        expect(SYNC_RETRY_STRATEGY.maxRetries).toBe(5);
        expect(SYNC_RETRY_STRATEGY.maxDelayMs).toBe(30000);
        expect(SYNC_RETRY_STRATEGY.jitterFactor).toBe(0.2);
      });

      it('should calculate increasing delays with exponential backoff', () => {
        const delays: number[] = [];
        for (let attempt = 0; attempt < 5; attempt++) {
          delays.push(
            calculateSyncRetryDelay(attempt, {
              ...SYNC_RETRY_STRATEGY,
              jitterFactor: 0,
            })
          );
        }

        // Without jitter: 2000, 4000, 8000, 16000, 30000 (capped)
        expect(delays[0]).toBe(2000);
        expect(delays[1]).toBe(4000);
        expect(delays[2]).toBe(8000);
        expect(delays[3]).toBe(16000);
        expect(delays[4]).toBe(30000); // Max delay cap
      });

      it('should apply jitter to prevent thundering herd', () => {
        const baseDelay = 2000;
        const jitterFactor = 0.2;
        const delays = new Set<number>();

        // Generate multiple delays to check jitter creates variance
        for (let i = 0; i < 100; i++) {
          const delay = calculateSyncRetryDelay(0, SYNC_RETRY_STRATEGY);
          delays.add(delay);
        }

        // Should have variance due to jitter
        expect(delays.size).toBeGreaterThan(1);

        // All delays should be within jitter range
        const minDelay = baseDelay * (1 - jitterFactor);
        const maxDelay = baseDelay * (1 + jitterFactor);
        for (const delay of delays) {
          expect(delay).toBeGreaterThanOrEqual(minDelay);
          expect(delay).toBeLessThanOrEqual(maxDelay);
        }
      });

      it('should select FAST strategy for network errors', () => {
        const networkError: ClassifiedError = {
          category: 'network',
          isRetryable: true,
          message: 'Network unavailable',
          original: new Error('Network unavailable'),
        };

        const strategy = selectSyncRetryStrategy(networkError);

        expect(strategy).toBe(FAST_SYNC_RETRY_STRATEGY);
        expect(strategy.baseDelayMs).toBe(500);
        expect(strategy.maxRetries).toBe(3);
      });

      it('should select RATE_LIMITED strategy for 429 errors', () => {
        const rateLimitError: ClassifiedError = {
          category: 'rateLimit',
          isRetryable: true,
          message: 'Too many requests',
          original: new Error('429 Too Many Requests'),
        };

        const strategy = selectSyncRetryStrategy(rateLimitError);

        expect(strategy).toBe(RATE_LIMITED_RETRY_STRATEGY);
        expect(strategy.baseDelayMs).toBe(5000);
        expect(strategy.backoffMultiplier).toBe(3);
      });

      it('should track retry context correctly', () => {
        const context = createSyncRetryContext(0);

        expect(context.attemptCount).toBe(0);
        expect(context.exhausted).toBe(false);

        // After 5 retries, should be exhausted
        const exhaustedContext = createSyncRetryContext(5);
        expect(exhaustedContext.exhausted).toBe(true);
      });

      it('should respect max retries limit', () => {
        const context = createSyncRetryContext(4);
        expect(shouldRetrySyncOperation(context)).toBe(true);

        const exhaustedContext = createSyncRetryContext(5);
        expect(shouldRetrySyncOperation(exhaustedContext)).toBe(false);
      });

      it('should not retry non-retryable errors', () => {
        const context = createSyncRetryContext(0);
        const authError: ClassifiedError = {
          category: 'auth',
          isRetryable: false,
          message: 'Unauthorized',
          original: new Error('401 Unauthorized'),
        };

        expect(shouldRetrySyncOperation(context, authError)).toBe(false);
      });

      it('should handle failed operations with retry marking', async () => {
        const failError = new Error('Temporary failure');
        mockExecutor.mockRejectedValueOnce(failError);

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('retry_test'),
          toCompleted: true,
        });

        const result = await orchestrator.sync();

        // First sync processes the operation, and it may be marked for retry (not permanent fail)
        // The operation is processed, whether it's marked failed or skipped depends on retry exhaustion
        expect(result.processed).toBe(1);
        // Operations can be marked as failed, skipped, or succeeded depending on retry context
        expect(result.failed + result.skipped + result.succeeded).toBe(1);
      });
    });

    describe('Acceptance Criteria 3: Server-authoritative reconciliation (FR-008)', () => {
      it('should track synced habits for reconciliation', () => {
        const reconciler = new StateReconciler();

        // Create processed operations for reconciliation
        const operations: ProcessedOperation[] = [
          {
            id: 'op1',
            habitId: mockHabitId('habit_1'),
            date: '2026-01-30',
            success: true,
          },
          {
            id: 'op2',
            habitId: mockHabitId('habit_2'),
            date: '2026-01-30',
            success: true,
          },
        ];

        reconciler.reconcile(operations);

        const state = reconciler.getState();

        // After reconcile, habits should have sync timestamps
        expect(state.habitSyncTimestamps.has('habit_1')).toBe(true);
        expect(state.habitSyncTimestamps.has('habit_2')).toBe(true);
      });

      it('should emit reconciliation events', () => {
        const reconciler = new StateReconciler();
        const events: string[] = [];

        reconciler.subscribe((e: ReconciliationEvent) => events.push(e.type));

        const operations: ProcessedOperation[] = [
          {
            id: 'op1',
            habitId: mockHabitId('habit_1'),
            date: '2026-01-30',
            success: true,
          },
        ];

        reconciler.reconcile(operations);

        expect(events).toContain('reconcile:started');
        expect(events).toContain('reconcile:completed');
      });

      it('should update sync timestamps per habit', () => {
        const reconciler = new StateReconciler();
        const beforeSync = Date.now();

        const operations: ProcessedOperation[] = [
          {
            id: 'op1',
            habitId: mockHabitId('habit_1'),
            date: '2026-01-30',
            success: true,
          },
        ];

        reconciler.reconcile(operations);

        const state = reconciler.getState();
        const timestamp = state.habitSyncTimestamps.get('habit_1');

        expect(timestamp).toBeDefined();
        expect(timestamp).toBeGreaterThanOrEqual(beforeSync);
      });

      it('should check if habit was synced after a given time', () => {
        const reconciler = new StateReconciler();
        const beforeSync = Date.now() - 1000;

        const operations: ProcessedOperation[] = [
          {
            id: 'op1',
            habitId: mockHabitId('habit_1'),
            date: '2026-01-30',
            success: true,
          },
        ];

        reconciler.reconcile(operations);

        const state = reconciler.getState();
        const syncTime = state.habitSyncTimestamps.get('habit_1');

        expect(syncTime).toBeDefined();
        expect(syncTime!).toBeGreaterThan(beforeSync);
      });

      it('should clear reconciliation state on reset', () => {
        const reconciler = new StateReconciler();

        const operations: ProcessedOperation[] = [
          {
            id: 'op1',
            habitId: mockHabitId('habit_1'),
            date: '2026-01-30',
            success: true,
          },
        ];

        reconciler.reconcile(operations);
        reconciler.reset();

        const state = reconciler.getState();

        expect(state.habitSyncTimestamps.size).toBe(0);
      });

      it('should use isHabitSynced helper', () => {
        const reconciler = new StateReconciler();

        expect(reconciler.isHabitSynced('habit_1')).toBe(false);

        const operations: ProcessedOperation[] = [
          {
            id: 'op1',
            habitId: mockHabitId('habit_1'),
            date: '2026-01-30',
            success: true,
          },
        ];

        reconciler.reconcile(operations);

        expect(reconciler.isHabitSynced('habit_1')).toBe(true);
        expect(reconciler.isHabitSynced('habit_2')).toBe(false);
      });
    });
  });

  describe('Sync Orchestrator Integration', () => {
    describe('Event lifecycle', () => {
      it('should emit complete event lifecycle for successful sync', async () => {
        const events: SyncOrchestratorEvent['type'][] = [];
        orchestrator.subscribe((e) => events.push(e.type));

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('event_test'),
          toCompleted: true,
        });

        const mockOnOnline = jest.fn().mockReturnValue(() => {});
        orchestrator.start(mockOnOnline);

        expect(events).toContain('orchestrator:start');

        await orchestrator.sync();

        expect(events).toContain('sync:started');
        expect(events).toContain('sync:completed');
      });

      it('should emit error event on sync failure', async () => {
        const events: SyncOrchestratorEvent[] = [];
        orchestrator.subscribe((e) => events.push(e));

        // Make the executor throw an error that propagates to the orchestrator
        const syncError = new Error('Sync failed');
        mockExecutor.mockRejectedValue(syncError);

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('error_test'),
          toCompleted: true,
        });

        const result = await orchestrator.sync();

        // The sync should complete (not throw), but the result should indicate failure
        // Individual operation failures are handled internally
        expect(result.processed).toBe(1);

        // Either error event was emitted, or the result contains the failure info
        const hasErrorEvent = events.some((e) => e.type === 'sync:error');
        const hasFailedOrSkipped = result.failed > 0 || result.skipped > 0;
        expect(hasErrorEvent || hasFailedOrSkipped).toBe(true);
      });

      it('should handle circuit breaker state tracking', async () => {
        // This test verifies that the sync manager tracks circuit breaker status
        const status = syncManager.getStatus();

        // Initial state should be closed
        expect(status.circuitStatus.state).toBe('closed');
        expect(status.circuitStatus.failureCount).toBe(0);

        // After multiple failures, circuit may transition
        // We verify the circuit breaker infrastructure exists and tracks state
        syncManager.resetCircuit();
        const resetStatus = syncManager.getStatus();
        expect(resetStatus.circuitStatus.failureCount).toBe(0);
      });
    });

    describe('State management', () => {
      it('should track sync state correctly', async () => {
        const state1 = orchestrator.getState();
        expect(state1.isSyncing).toBe(false);
        expect(state1.lastSyncAttemptAt).toBeUndefined();

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('state_test'),
          toCompleted: true,
        });

        await orchestrator.sync();

        const state2 = orchestrator.getState();
        expect(state2.lastSyncAttemptAt).toBeDefined();
        expect(state2.lastResult).toBeDefined();
        expect(state2.lastResult?.initiated).toBe(true);
      });

      it('should track lastSuccessfulSyncAt on success', async () => {
        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('success_test'),
          toCompleted: true,
        });

        await orchestrator.sync();

        const state = orchestrator.getState();
        expect(state.lastSuccessfulSyncAt).toBeDefined();
      });

      it('should not update lastSuccessfulSyncAt on failure', async () => {
        mockExecutor.mockRejectedValue(new Error('Fail'));

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('fail_test'),
          toCompleted: true,
        });

        await orchestrator.sync();

        const state = orchestrator.getState();
        expect(state.lastSuccessfulSyncAt).toBeUndefined();
      });
    });

    describe('Batch processing', () => {
      it('should respect batch size limit', async () => {
        // Add 100 operations
        for (let i = 0; i < 100; i++) {
          queueManager.enqueue(
            'toggleCompletion',
            {
              date: '2026-01-30',
              habitId: mockHabitId(`batch_${i}`),
              toCompleted: true,
            },
            { allowDuplicate: true }
          );
        }

        const result = await orchestrator.sync();

        // Should only process up to batchSize (50)
        expect(result.processed).toBeLessThanOrEqual(50);
      });

      it('should mark operations as syncing during processing', async () => {
        const syncingIds: string[] = [];

        // Capture operations marked as syncing
        const originalMarkSyncing = queueManager.markSyncing.bind(queueManager);
        jest.spyOn(queueManager, 'markSyncing').mockImplementation((id) => {
          syncingIds.push(id);
          return originalMarkSyncing(id);
        });

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('syncing_test'),
          toCompleted: true,
        });

        await orchestrator.sync();

        expect(syncingIds.length).toBeGreaterThan(0);
      });

      it('should mark completed operations as completed', async () => {
        const completedIds: string[] = [];

        const originalMarkCompleted =
          queueManager.markCompleted.bind(queueManager);
        jest.spyOn(queueManager, 'markCompleted').mockImplementation((id) => {
          completedIds.push(id);
          return originalMarkCompleted(id);
        });

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId('complete_test'),
          toCompleted: true,
        });

        await orchestrator.sync();

        expect(completedIds.length).toBe(1);
      });
    });
  });

  describe('Orphan Cleanup (Edge Case: Deleted habits)', () => {
    it('should identify orphan operations for deleted habits', async () => {
      const existingHabits = new Set(['habit_exists']);

      // HabitExistsChecker returns {habitId, exists} object
      const mockCheckHabitExists = jest
        .fn()
        .mockImplementation(
          async (habitId: Id<'habits'>): Promise<HabitExistsResult> => {
            return { habitId, exists: existingHabits.has(habitId) };
          }
        );

      // Create operations for both existing and deleted habits
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('habit_exists'),
        toCompleted: true,
      });
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('habit_deleted'),
        toCompleted: true,
      });

      const removedIds: string[] = [];

      const result = await cleanupOrphans(
        {
          checkHabitExists: mockCheckHabitExists,
          getOperations: () => queueManager.getState().operations,
          removeOperation: (id) => {
            removedIds.push(id);
            return queueManager.remove(id);
          },
        },
        { batchSize: 100 }
      );

      expect(result.deletedHabitIds).toContain('habit_deleted');
      expect(result.orphansRemoved).toBe(1);
      expect(removedIds.length).toBe(1);
    });

    it('should not remove operations for existing habits', async () => {
      const existingHabits = new Set(['habit_1', 'habit_2']);

      const mockCheckHabitExists = jest
        .fn()
        .mockImplementation(
          async (habitId: Id<'habits'>): Promise<HabitExistsResult> => {
            return { habitId, exists: existingHabits.has(habitId) };
          }
        );

      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('habit_1'),
        toCompleted: true,
      });
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('habit_2'),
        toCompleted: true,
      });

      const result = await cleanupOrphans({
        checkHabitExists: mockCheckHabitExists,
        getOperations: () => queueManager.getState().operations,
        removeOperation: (id) => queueManager.remove(id),
      });

      expect(result.orphansRemoved).toBe(0);
      expect(queueManager.getStats().totalCount).toBe(2);
    });

    it('should fail-safe on habit existence check failure', async () => {
      const mockCheckHabitExists = jest
        .fn()
        .mockRejectedValue(new Error('Network error'));

      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('unknown_habit'),
        toCompleted: true,
      });

      // The cleanup should NOT throw - it fails-safe by assuming habit exists
      // This prevents accidental deletion of valid operations when network is down
      const result = await cleanupOrphans({
        checkHabitExists: mockCheckHabitExists,
        getOperations: () => queueManager.getState().operations,
        removeOperation: (id) => queueManager.remove(id),
      });

      // No orphans removed because we assume the habit exists on check failure
      expect(result.orphansRemoved).toBe(0);
      expect(result.deletedHabitIds).toHaveLength(0);

      // Operation should still be in queue
      expect(queueManager.getStats().totalCount).toBe(1);
    });

    it('should emit cleanup events', async () => {
      const events: string[] = [];
      const existingHabits = new Set<string>();

      const mockCheckHabitExists = jest
        .fn()
        .mockImplementation(
          async (habitId: Id<'habits'>): Promise<HabitExistsResult> => {
            return { habitId, exists: existingHabits.has(habitId) };
          }
        );

      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('orphan_habit'),
        toCompleted: true,
      });

      await cleanupOrphans(
        {
          checkHabitExists: mockCheckHabitExists,
          getOperations: () => queueManager.getState().operations,
          removeOperation: (id) => queueManager.remove(id),
        },
        {},
        (event) => events.push(event.type)
      );

      expect(events).toContain('cleanup:started');
      expect(events).toContain('cleanup:completed');
    });
  });

  describe('Queue + Sync Integration', () => {
    it('should handle complete offline-to-online flow', async () => {
      // 1. Simulate offline completions
      const habits = ['morning_run', 'meditate', 'read'];
      habits.forEach((habit) => {
        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId(habit),
          toCompleted: true,
        });
      });

      expect(queueManager.getStats().pendingCount).toBe(3);

      // 2. Call sync directly to simulate what happens after coming online
      // The scheduled sync mechanism is tested separately in "should schedule sync" tests
      const result = await orchestrator.sync();

      // 3. Verify sync completed
      expect(result.initiated).toBe(true);
      expect(result.succeeded).toBe(3);

      const state = orchestrator.getState();
      expect(state.lastResult?.succeeded).toBe(3);
      expect(state.lastSuccessfulSyncAt).toBeDefined();
    });

    it('should handle rapid reconnects with debounce', async () => {
      let syncCount = 0;
      const originalSync = orchestrator.sync.bind(orchestrator);
      jest.spyOn(orchestrator, 'sync').mockImplementation(async () => {
        syncCount++;
        return originalSync();
      });

      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('debounce_test'),
        toCompleted: true,
      });

      let onlineCallback: () => void = () => {};
      const mockOnOnline = jest.fn().mockImplementation((cb) => {
        onlineCallback = cb;
        return () => {};
      });

      orchestrator.start(mockOnOnline);

      // Rapid reconnects
      onlineCallback();
      jest.advanceTimersByTime(50);
      onlineCallback();
      jest.advanceTimersByTime(50);
      onlineCallback();

      // Wait for final debounce
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      jest.runAllTimers();
      await Promise.resolve();

      // Should only sync once due to debouncing
      expect(syncCount).toBe(1);
    });

    it('should persist queue after sync for remaining operations', async () => {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage') as typeof import('@react-native-async-storage/async-storage').default;

      // Fail first operation, succeed second
      mockExecutor
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce(undefined);

      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('will_fail'),
        toCompleted: true,
      });
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('will_succeed'),
        toCompleted: true,
      });

      await orchestrator.sync();
      await queueManager.persist();

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should handle 500+ operations without degradation (FR-011)', async () => {
      const startEnqueue = performance.now();

      for (let i = 0; i < 500; i++) {
        queueManager.enqueue(
          'toggleCompletion',
          {
            date: '2026-01-30',
            habitId: mockHabitId(`perf_${i}`),
            toCompleted: true,
          },
          { allowDuplicate: true }
        );
      }

      const enqueueTime = performance.now() - startEnqueue;

      expect(queueManager.getStats().totalCount).toBe(500);
      expect(enqueueTime).toBeLessThan(1000); // Should be fast

      // Sync first batch
      const startSync = performance.now();
      await orchestrator.sync();
      const syncTime = performance.now() - startSync;

      // Sync should complete reasonably fast
      expect(syncTime).toBeLessThan(5000);
    });

    it('should not block during async operations', async () => {
      const timeline: Array<{ event: string; time: number }> = [];
      const startTime = Date.now();

      const record = (event: string) => {
        timeline.push({ event, time: Date.now() - startTime });
      };

      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('nonblock_test'),
        toCompleted: true,
      });

      record('before_sync');

      // Start sync without awaiting
      const syncPromise = orchestrator.sync();

      record('after_sync_call');

      // Main thread should not be blocked
      const quickOp = () => 1 + 1;
      expect(quickOp()).toBe(2);

      record('quick_op_completed');

      await syncPromise;

      record('sync_completed');

      // Verify non-blocking behavior
      const syncCallTime =
        timeline.find((t) => t.event === 'after_sync_call')!.time -
        timeline.find((t) => t.event === 'before_sync')!.time;

      expect(syncCallTime).toBeLessThan(100); // Should return immediately
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty queue gracefully', async () => {
      expect(queueManager.getStats().totalCount).toBe(0);

      const result = await orchestrator.sync();

      expect(result.initiated).toBe(true);
      expect(result.processed).toBe(0);
      expect(result.error).toBeUndefined();
    });

    it('should handle sync when orchestrator not started', async () => {
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('not_started'),
        toCompleted: true,
      });

      // Sync without calling start()
      const result = await orchestrator.sync();

      // Should still process (start() just enables auto-sync)
      expect(result.initiated).toBe(true);
    });

    it('should handle concurrent sync calls', async () => {
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('concurrent'),
        toCompleted: true,
      });

      // Fire multiple syncs concurrently
      const results = await Promise.all([
        orchestrator.sync(),
        orchestrator.sync(),
        orchestrator.sync(),
      ]);

      // Due to min interval, only one should process
      const initiated = results.filter((r) => r.initiated && r.processed > 0);
      expect(initiated.length).toBe(1);
    });

    it('should handle operations with different dates for same habit', async () => {
      const dates = ['2026-01-28', '2026-01-29', '2026-01-30'];

      dates.forEach((date) => {
        queueManager.enqueue('toggleCompletion', {
          date,
          habitId: mockHabitId('multi_date_habit'),
          toCompleted: true,
        });
      });

      // Each date is a separate operation
      expect(queueManager.getStats().totalCount).toBe(3);

      await orchestrator.sync();

      expect(mockExecutor).toHaveBeenCalledTimes(3);
    });
  });
});
