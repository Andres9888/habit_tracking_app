/**
 * E2E/Integration Tests for Offline Conflict Resolution
 *
 * Tests the complete conflict resolution flow from US4:
 * - Multi-device completion scenarios (completion wins strategy)
 * - Informational-only conflict notifications (no user action required)
 * - FR-010: Resolve conflicts by preserving completions
 *
 * @see docs/offline-habit-sync.md US4 - Graceful Conflict Resolution
 */

import type { Id } from '../../convex/_generated/dataModel';
import {
  createOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../src/lib/offline';
import { SyncOrchestrator } from '../../src/lib/offline/sync/SyncOrchestrator';
import { OfflineSyncManager } from '../../src/lib/offline/syncManager';
import {
  resolveOperation,
  resolveOperations,
  resolveOperationsBatch,
  DEFAULT_CONFLICT_RESOLVER_CONFIG,
} from '../../src/lib/offline/sync/conflictResolver';
import { createHabitDateKey } from '../../src/lib/offline/sync/conflictResolver/helpers';
import { processQueue } from '../../src/lib/offline/sync/processQueue';
import type {
  OfflineQueueManagerAPI,
  OfflineOperation,
  OfflineQueueState,
  SyncOrchestratorEvent,
} from '../../src/lib/offline';
import type {
  CompletionStateChecker,
  BatchCompletionStateChecker,
  ConflictEvent,
  ConflictResolutionResult,
} from '../../src/lib/offline/sync/conflictResolver';
import type { OfflineSyncManager as SyncManagerType } from '../../src/lib/offline/syncManager';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
}));

// Use fake timers for testing debounce and timeouts
jest.useFakeTimers();

const mockHabitId = (id: string) => id as Id<'habits'>;

describe('Offline Conflict Resolution E2E (US4)', () => {
  let queueManager: OfflineQueueManagerAPI;
  let syncManager: OfflineSyncManager;
  let orchestrator: SyncOrchestrator;
  let mockExecutor: jest.Mock;

  const createMockOperation = (
    id: string,
    toCompleted: boolean,
    habitId: Id<'habits'> = mockHabitId('habit_123'),
    date: string = '2026-01-30'
  ): OfflineOperation<'toggleCompletion'> => ({
    createdAt: Date.now(),
    id,
    payload: { date, habitId, toCompleted },
    retryCount: 0,
    status: 'pending',
    type: 'toggleCompletion',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    resetOfflineQueueManager();

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

  describe('US4: Graceful Conflict Resolution', () => {
    describe('Acceptance Criteria 1: Completion wins strategy (FR-010)', () => {
      /**
       * Scenario: Device A and Device B both mark the same habit complete
       * while offline. Device A syncs first, then Device B tries to sync.
       * Expected: Device B's sync should skip (server already complete),
       * habit remains marked complete.
       */
      it('should preserve completion when both devices mark complete offline', async () => {
        // Device B's pending operation (wants to complete)
        const deviceBOperation = createMockOperation(
          'op_device_b',
          true, // toCompleted
          mockHabitId('morning_run'),
          '2026-01-30'
        );

        // After Device A synced, server shows complete
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const result = await resolveOperation(
          deviceBOperation,
          checkServerState
        );

        // Should skip sync because server is already complete (FR-010)
        expect(result.resolution).toBe('skip');
        expect(result.hasConflict).toBe(true);
        expect(result.reason).toContain('completion wins');
        expect(result.serverState?.isCompleted).toBe(true);
      });

      it('should sync when offline wants complete but server is not complete', async () => {
        const operation = createMockOperation(
          'op_1',
          true, // toCompleted
          mockHabitId('meditate')
        );

        // Server shows not complete
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(false);

        const result = await resolveOperation(operation, checkServerState);

        expect(result.resolution).toBe('sync');
        expect(result.hasConflict).toBe(false);
      });

      it('should allow undo (uncomplete) after multi-device completion', async () => {
        // User on Device B intentionally wants to undo completion
        const undoOperation = createMockOperation(
          'op_undo',
          false, // toCompleted = false (uncomplete)
          mockHabitId('workout')
        );

        // Server shows complete (from earlier sync)
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const result = await resolveOperation(undoOperation, checkServerState);

        // Undo should sync because user explicitly wants different state
        expect(result.resolution).toBe('sync');
        expect(result.hasConflict).toBe(false);
      });

      it('should skip sync when uncomplete matches server uncomplete state', async () => {
        const operation = createMockOperation(
          'op_1',
          false, // toCompleted = false
          mockHabitId('read')
        );

        // Server also shows not complete
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(false);

        const result = await resolveOperation(operation, checkServerState);

        // Skip - desired state already exists
        expect(result.resolution).toBe('skip');
        expect(result.hasConflict).toBe(true);
      });

      it('should handle three-device scenario correctly', async () => {
        // Devices A, B, C all complete same habit offline
        // Device A syncs first -> server is complete
        // Devices B and C both try to sync

        const operations = [
          createMockOperation('op_device_b', true, mockHabitId('habit_1')),
          createMockOperation('op_device_c', true, mockHabitId('habit_1')),
        ];

        // Server already complete from Device A
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const results = await resolveOperations(operations, checkServerState);

        // Both should skip - server already has completion
        expect(results.skipCount).toBe(2);
        expect(results.syncCount).toBe(0);
        expect(results.conflictsDetected).toBe(2);
        expect(results.conflictsResolvedByCompletionWins).toBe(2);
      });

      it('should handle mixed completion states across habits', async () => {
        const operations = [
          createMockOperation('op_1', true, mockHabitId('habit_1')), // Server: complete
          createMockOperation('op_2', true, mockHabitId('habit_2')), // Server: not complete
          createMockOperation('op_3', false, mockHabitId('habit_3')), // Server: not complete
        ];

        // Mixed server states
        const serverStates: Record<string, boolean> = {
          habit_1: true, // conflict -> skip
          habit_2: false, // no conflict -> sync
          habit_3: false, // conflict -> skip
        };

        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockImplementation(async (habitId) => serverStates[habitId]);

        const results = await resolveOperations(operations, checkServerState);

        expect(results.total).toBe(3);
        expect(results.skipCount).toBe(2); // habit_1 and habit_3
        expect(results.syncCount).toBe(1); // habit_2
        expect(results.conflictsDetected).toBe(2);
      });
    });

    describe('Acceptance Criteria 2: Informational notification (no action required)', () => {
      it('should emit conflict:detected event when conflict found', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const events: ConflictEvent[] = [];

        await resolveOperation(operation, checkServerState, {}, (e) =>
          events.push(e)
        );

        const detectedEvent = events.find(
          (e) => e.type === 'conflict:detected'
        );
        expect(detectedEvent).toBeDefined();
        expect(detectedEvent?.data.operationId).toBe('op_1');
        expect(detectedEvent?.data.resolution).toBe('skip');
      });

      it('should emit conflict:skip_sync event when skipping', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const events: ConflictEvent[] = [];

        await resolveOperation(operation, checkServerState, {}, (e) =>
          events.push(e)
        );

        const skipEvent = events.find((e) => e.type === 'conflict:skip_sync');
        expect(skipEvent).toBeDefined();
      });

      it('should NOT emit conflict events when no conflict exists', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(false); // No conflict - server not complete

        const events: ConflictEvent[] = [];

        await resolveOperation(operation, checkServerState, {}, (e) =>
          events.push(e)
        );

        expect(events).toHaveLength(0);
      });

      it('should emit conflict:error event on server check failure', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockRejectedValue(new Error('Network unavailable'));

        const events: ConflictEvent[] = [];

        const result = await resolveOperation(
          operation,
          checkServerState,
          {},
          (e) => events.push(e)
        );

        // Should proceed with sync (fail-safe)
        expect(result.resolution).toBe('sync');

        // Should emit error event for monitoring
        const errorEvent = events.find((e) => e.type === 'conflict:error');
        expect(errorEvent).toBeDefined();
        expect(errorEvent?.data.error?.message).toBe('Network unavailable');
      });

      it('should provide conflict count for notification display', async () => {
        const operations = [
          createMockOperation('op_1', true, mockHabitId('habit_1')),
          createMockOperation('op_2', true, mockHabitId('habit_2')),
          createMockOperation('op_3', true, mockHabitId('habit_3')),
        ];

        // All already complete on server
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const results = await resolveOperations(operations, checkServerState);

        // conflictsDetected can be used for notification
        expect(results.conflictsDetected).toBe(3);
        expect(results.conflictsResolvedByCompletionWins).toBe(3);
      });
    });
  });

  describe('Conflict Resolution Configuration', () => {
    it('should have correct default configuration', () => {
      expect(DEFAULT_CONFLICT_RESOLVER_CONFIG.checkServerStateBeforeSync).toBe(
        true
      );
      expect(DEFAULT_CONFLICT_RESOLVER_CONFIG.completionWins).toBe(true);
      expect(DEFAULT_CONFLICT_RESOLVER_CONFIG.serverCheckTimeoutMs).toBe(5000);
    });

    it('should skip server check when disabled', async () => {
      const operation = createMockOperation('op_1', true);
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const result = await resolveOperation(operation, checkServerState, {
        checkServerStateBeforeSync: false,
      });

      expect(result.resolution).toBe('sync');
      expect(result.reason).toContain('disabled');
      expect(checkServerState).not.toHaveBeenCalled();
    });

    it('should timeout on slow server checks', async () => {
      const operation = createMockOperation('op_1', true);
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(true), 10000))
        );

      const resultPromise = resolveOperation(operation, checkServerState, {
        serverCheckTimeoutMs: 50,
      });

      // Advance past timeout
      jest.advanceTimersByTime(100);

      const result = await resultPromise;

      // Fail-safe: proceed with sync on timeout
      expect(result.resolution).toBe('sync');
      expect(result.reason).toContain('timed out');
    });
  });

  describe('Batch Conflict Resolution', () => {
    it('should resolve multiple operations with individual checker', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId('habit_1'), '2026-01-28'),
        createMockOperation('op_2', true, mockHabitId('habit_1'), '2026-01-29'),
        createMockOperation('op_3', true, mockHabitId('habit_1'), '2026-01-30'),
      ];

      const serverStates: Record<string, boolean> = {
        '2026-01-28': true, // conflict
        '2026-01-29': false, // no conflict
        '2026-01-30': true, // conflict
      };

      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockImplementation((_, date) => Promise.resolve(serverStates[date]));

      const results = await resolveOperations(operations, checkServerState);

      expect(results.total).toBe(3);
      expect(results.skipCount).toBe(2);
      expect(results.syncCount).toBe(1);
      expect(checkServerState).toHaveBeenCalledTimes(3);
    });

    it('should resolve multiple operations with batch checker', async () => {
      const habit1 = mockHabitId('habit_1');
      const habit2 = mockHabitId('habit_2');

      const operations = [
        createMockOperation('op_1', true, habit1, '2026-01-30'),
        createMockOperation('op_2', true, habit2, '2026-01-30'),
      ];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(
          new Map([
            [createHabitDateKey(habit1, '2026-01-30'), true], // conflict
            [createHabitDateKey(habit2, '2026-01-30'), false], // no conflict
          ])
        );

      const results = await resolveOperationsBatch(operations, batchChecker);

      expect(results.total).toBe(2);
      expect(results.skipCount).toBe(1);
      expect(results.syncCount).toBe(1);
      // Batch checker called once for all operations
      expect(batchChecker).toHaveBeenCalledTimes(1);
    });

    it('should handle missing server state in batch response', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId('habit_1')),
        createMockOperation('op_2', true, mockHabitId('habit_2')),
      ];

      // Only return state for first operation
      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(
          new Map([
            [createHabitDateKey(mockHabitId('habit_1'), '2026-01-30'), true],
          ])
        );

      const results = await resolveOperationsBatch(operations, batchChecker);

      // op_1: skip (conflict), op_2: sync (unknown state)
      expect(results.skipCount).toBe(1);
      expect(results.syncCount).toBe(1);
      expect(results.results[1].reason).toContain('Server state not found');
    });

    it('should handle batch checker error gracefully', async () => {
      const operations = [
        createMockOperation('op_1', true),
        createMockOperation('op_2', true),
      ];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockRejectedValue(new Error('Batch fetch failed'));

      const results = await resolveOperationsBatch(operations, batchChecker);

      // Fail-safe: all proceed with sync
      expect(results.syncCount).toBe(2);
      expect(results.results[0].reason).toContain('Batch server check failed');
    });
  });

  describe('Queue Processing with Conflict Detection', () => {
    function createMockQueueManager(): jest.Mocked<OfflineQueueManagerAPI> {
      return {
        clear: jest.fn(),
        dequeue: jest.fn(),
        enqueue: jest.fn(),
        getState: jest.fn().mockReturnValue({ operations: [], version: 1 }),
        getStats: jest.fn(),
        markCompleted: jest.fn(),
        markFailed: jest.fn(),
        markPending: jest.fn(),
        markSyncing: jest.fn(),
        peek: jest.fn(),
        persist: jest.fn(),
        remove: jest.fn(),
        restore: jest.fn(),
        subscribe: jest.fn(),
        subscribeToState: jest.fn(),
      } as unknown as jest.Mocked<OfflineQueueManagerAPI>;
    }

    function createMockSyncManager(): jest.Mocked<SyncManagerType> {
      return {
        canSync: jest.fn().mockReturnValue(true),
        syncItem: jest.fn().mockResolvedValue({
          item: { retryContext: { exhausted: false } },
          success: true,
        }),
      } as unknown as jest.Mocked<SyncManagerType>;
    }

    it('should integrate conflict resolution into queue processing', async () => {
      const mockQM = createMockQueueManager();
      const mockSM = createMockSyncManager();
      const mockExec = jest.fn().mockResolvedValue(undefined);

      // Server already complete for habit_1
      const serverStateChecker: CompletionStateChecker = jest
        .fn()
        .mockImplementation(async (habitId) => {
          return habitId === 'habit_1';
        });

      const op1 = createMockOperation('op_1', true, mockHabitId('habit_1')); // Conflict
      const op2 = createMockOperation('op_2', true, mockHabitId('habit_2')); // No conflict

      mockQM.getState.mockReturnValue({
        createdAt: Date.now(),
        operations: [op1, op2],
        updatedAt: Date.now(),
        version: 1,
      } as OfflineQueueState);

      const result = await processQueue(
        {
          executor: mockExec,
          queueManager: mockQM,
          serverStateChecker,
          syncManager: mockSM,
        },
        {}
      );

      expect(result.conflictSkipped).toBe(1);
      expect(result.succeeded).toBe(2); // Both succeed (one via skip, one via sync)
      expect(mockQM.markCompleted).toHaveBeenCalledWith('op_1'); // Conflict skip
    });

    it('should call onConflict callback during queue processing', async () => {
      const mockQM = createMockQueueManager();
      const mockSM = createMockSyncManager();
      const mockExec = jest.fn().mockResolvedValue(undefined);
      const onConflict = jest.fn();

      const serverStateChecker: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const op = createMockOperation('op_1', true);
      mockQM.getState.mockReturnValue({
        createdAt: Date.now(),
        operations: [op],
        updatedAt: Date.now(),
        version: 1,
      } as OfflineQueueState);

      await processQueue(
        {
          executor: mockExec,
          queueManager: mockQM,
          serverStateChecker,
          syncManager: mockSM,
        },
        { onConflict }
      );

      expect(onConflict).toHaveBeenCalled();
    });

    it('should call onConflictSkip callback when skipping', async () => {
      const mockQM = createMockQueueManager();
      const mockSM = createMockSyncManager();
      const mockExec = jest.fn().mockResolvedValue(undefined);
      const onConflictSkip = jest.fn();

      const serverStateChecker: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const op = createMockOperation('op_1', true);
      mockQM.getState.mockReturnValue({
        createdAt: Date.now(),
        operations: [op],
        updatedAt: Date.now(),
        version: 1,
      } as OfflineQueueState);

      await processQueue(
        {
          executor: mockExec,
          queueManager: mockQM,
          serverStateChecker,
          syncManager: mockSM,
        },
        { onConflictSkip }
      );

      expect(onConflictSkip).toHaveBeenCalledWith(
        op,
        expect.stringContaining('completion wins')
      );
    });
  });

  describe('Real-World Multi-Device Scenarios', () => {
    it('should handle Device A online, Device B offline completing same habit', async () => {
      // Timeline:
      // 1. Device A completes habit online -> server is complete
      // 2. Device B (offline) completes same habit
      // 3. Device B comes online and syncs

      const deviceBOperation = createMockOperation(
        'op_device_b',
        true,
        mockHabitId('daily_run')
      );

      // When Device B syncs, server already shows complete from Device A
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const result = await resolveOperation(deviceBOperation, checkServerState);

      // Device B's sync should skip - no redundant API call
      expect(result.resolution).toBe('skip');
      expect(result.hasConflict).toBe(true);
    });

    it('should handle stale offline completions', async () => {
      // User completed habit 3 days ago while offline
      // Comes back online - server may or may not have that completion

      const staleOperation = createMockOperation(
        'op_stale',
        true,
        mockHabitId('morning_routine'),
        '2026-01-27' // 3 days ago
      );

      // Server doesn't have this completion
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(false);

      const result = await resolveOperation(staleOperation, checkServerState);

      // Should sync - server needs this completion
      expect(result.resolution).toBe('sync');
    });

    it('should handle partial sync after connectivity loss', async () => {
      // User completed 5 habits, connection dropped after 2 synced
      // Remaining 3 need to sync, but 2 of them may conflict

      const operations = [
        createMockOperation('op_3', true, mockHabitId('habit_3')), // Synced by another device
        createMockOperation('op_4', true, mockHabitId('habit_4')), // Not synced
        createMockOperation('op_5', true, mockHabitId('habit_5')), // Not synced
      ];

      const serverStates: Record<string, boolean> = {
        habit_3: true, // Conflict - another device synced
        habit_4: false, // No conflict
        habit_5: false, // No conflict
      };

      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockImplementation((habitId) =>
          Promise.resolve(serverStates[habitId])
        );

      const results = await resolveOperations(operations, checkServerState);

      expect(results.skipCount).toBe(1); // habit_3
      expect(results.syncCount).toBe(2); // habit_4, habit_5
    });

    it('should handle rapid toggle sequences (complete, uncomplete, complete)', async () => {
      // User toggles rapidly while offline: complete -> uncomplete -> complete
      // Only the final state matters

      // Assuming queue deduplication keeps only the latest operation
      const finalOperation = createMockOperation(
        'op_final',
        true, // Final state: complete
        mockHabitId('water_intake')
      );

      // Server shows not complete
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(false);

      const result = await resolveOperation(finalOperation, checkServerState);

      expect(result.resolution).toBe('sync');
    });
  });

  describe('Fail-Safe Behavior', () => {
    it('should proceed with sync when server is unreachable', async () => {
      const operation = createMockOperation('op_1', true);
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockRejectedValue(new Error('ECONNREFUSED'));

      const result = await resolveOperation(operation, checkServerState);

      expect(result.resolution).toBe('sync');
      expect(result.reason).toContain('ECONNREFUSED');
      expect(result.reason).toContain('proceeding with sync');
    });

    it('should proceed with sync when server returns null', async () => {
      const operation = createMockOperation('op_1', true);
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(null);

      const result = await resolveOperation(operation, checkServerState);

      expect(result.resolution).toBe('sync');
      expect(result.reason).toContain('Could not determine');
    });

    it('should not lose completions due to network issues', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId('habit_1')),
        createMockOperation('op_2', true, mockHabitId('habit_2')),
        createMockOperation('op_3', true, mockHabitId('habit_3')),
      ];

      // Intermittent network issues
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValueOnce(true) // First: conflict (skip)
        .mockRejectedValueOnce(new Error('Timeout')) // Second: error (sync)
        .mockResolvedValueOnce(null); // Third: unknown (sync)

      const results = await resolveOperations(operations, checkServerState);

      // Only one skip, two syncs - completions not lost
      expect(results.skipCount).toBe(1);
      expect(results.syncCount).toBe(2);
    });
  });

  describe('Performance with Conflicts', () => {
    it('should handle 100+ operations with conflict checking efficiently', async () => {
      const operations: OfflineOperation<'toggleCompletion'>[] = [];

      for (let i = 0; i < 100; i++) {
        operations.push(
          createMockOperation(
            `op_${i}`,
            true,
            mockHabitId(`habit_${i % 10}`), // 10 unique habits
            `2026-01-${String((i % 28) + 1).padStart(2, '0')}` // Various dates
          )
        );
      }

      // 50% conflict rate
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockImplementation(() => Promise.resolve(Math.random() < 0.5));

      const startTime = performance.now();
      const results = await resolveOperations(operations, checkServerState);
      const duration = performance.now() - startTime;

      expect(results.total).toBe(100);
      expect(results.skipCount + results.syncCount).toBe(100);
      // Should complete quickly (in-memory operations)
      expect(duration).toBeLessThan(1000);
    });

    it('should use batch checker for better performance', async () => {
      const operations: OfflineOperation<'toggleCompletion'>[] = [];

      for (let i = 0; i < 50; i++) {
        operations.push(
          createMockOperation(
            `op_${i}`,
            true,
            mockHabitId(`habit_${i}`),
            '2026-01-30'
          )
        );
      }

      const individualChecker: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(false);

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(new Map());

      // Individual checker
      await resolveOperations(operations, individualChecker);
      expect(individualChecker).toHaveBeenCalledTimes(50);

      // Batch checker - should be called once
      await resolveOperationsBatch(operations, batchChecker);
      expect(batchChecker).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty operations array', async () => {
      const checkServerState: CompletionStateChecker = jest.fn();

      const results = await resolveOperations([], checkServerState);

      expect(results.total).toBe(0);
      expect(results.results).toHaveLength(0);
      expect(checkServerState).not.toHaveBeenCalled();
    });

    it('should handle same habit, same date, different operations', async () => {
      // Edge case: queue somehow has two operations for same habit+date
      // (should be prevented by deduplication, but testing resilience)

      const operations = [
        createMockOperation('op_1', true, mockHabitId('habit_x'), '2026-01-30'),
        createMockOperation('op_2', true, mockHabitId('habit_x'), '2026-01-30'),
      ];

      // Server shows complete
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const results = await resolveOperations(operations, checkServerState);

      // Both should skip (both are redundant)
      expect(results.skipCount).toBe(2);
    });

    it('should handle operations with different types gracefully', async () => {
      // Only toggleCompletion operations should go through conflict resolution
      // Other types should be handled appropriately

      const toggleOp = createMockOperation('op_toggle', true);

      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const result = await resolveOperation(toggleOp, checkServerState);

      expect(result.resolution).toBe('skip');
      expect(result.payload.toCompleted).toBe(true);
    });

    it('should preserve operation metadata through resolution', async () => {
      const operation = createMockOperation(
        'op_with_meta',
        true,
        mockHabitId('habit_meta'),
        '2026-01-15'
      );

      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(false);

      const result = await resolveOperation(operation, checkServerState);

      expect(result.operationId).toBe('op_with_meta');
      expect(result.payload.habitId).toBe('habit_meta');
      expect(result.payload.date).toBe('2026-01-15');
    });
  });
});
