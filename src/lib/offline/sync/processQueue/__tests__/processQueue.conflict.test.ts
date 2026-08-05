/**
 * Process Queue Conflict Integration Tests
 *
 * Tests for conflict detection integration in processQueue batch processing.
 * Implements US4 (Graceful Conflict Resolution) at the queue level.
 *
 * @see docs/offline-habit-sync.md US4 - Graceful Conflict Resolution
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { OfflineOperation, OfflineQueueState } from '../../../queue';
import type { OfflineQueueManagerAPI } from '../../../queueManager';
import type { OfflineSyncManager } from '../../../syncManager';
import type {
  CompletionStateChecker,
  ConflictEvent,
} from '../../conflictResolver';
import type { QueueProcessorDeps, ProcessQueueConfig } from '../types';
import { processQueue } from '../processQueue';

describe('processQueue conflict detection (US4)', () => {
  const mockHabitId1 = 'habit_1' as Id<'habits'>;
  const mockHabitId2 = 'habit_2' as Id<'habits'>;
  const mockDate = '2026-01-15';

  // Mock dependencies
  let mockQueueManager: jest.Mocked<OfflineQueueManagerAPI>;
  let mockSyncManager: jest.Mocked<OfflineSyncManager>;
  let mockExecutor: jest.Mock;
  let mockServerStateChecker: jest.MockedFunction<CompletionStateChecker>;

  function createMockOperation(
    id: string,
    toCompleted: boolean,
    habitId: Id<'habits'> = mockHabitId1,
    date: string = mockDate
  ): OfflineOperation<'toggleCompletion'> {
    return {
      createdAt: Date.now(),
      id,
      payload: { date, habitId, toCompleted },
      retryCount: 0,
      status: 'pending',
      type: 'toggleCompletion',
    };
  }

  function setupQueueState(operations: OfflineOperation[]): OfflineQueueState {
    return {
      createdAt: Date.now(),
      operations,
      updatedAt: Date.now(),
      version: 1,
    };
  }

  function createDeps(
    serverStateChecker?: CompletionStateChecker
  ): QueueProcessorDeps {
    return {
      executor: mockExecutor,
      queueManager: mockQueueManager,
      serverStateChecker,
      syncManager: mockSyncManager,
    };
  }

  beforeEach(() => {
    mockQueueManager = {
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

    mockSyncManager = {
      canSync: jest.fn().mockReturnValue(true),
      syncItem: jest.fn().mockResolvedValue({
        item: { retryContext: { exhausted: false } },
        success: true,
      }),
    } as unknown as jest.Mocked<OfflineSyncManager>;

    mockExecutor = jest.fn().mockResolvedValue(undefined);
    mockServerStateChecker = jest.fn();
  });

  describe('result aggregation', () => {
    it('tracks conflictSkipped count in result', async () => {
      // Server already complete for habit_1, not for habit_2
      mockServerStateChecker.mockImplementation(async (habitId) => {
        return habitId === mockHabitId1;
      });

      const op1 = createMockOperation('op_1', true, mockHabitId1); // Will skip
      const op2 = createMockOperation('op_2', true, mockHabitId2); // Will sync
      mockQueueManager.getState.mockReturnValue(setupQueueState([op1, op2]));

      const deps = createDeps(mockServerStateChecker);
      const result = await processQueue(deps, {});

      expect(result.conflictSkipped).toBe(1);
      expect(result.succeeded).toBe(2); // Both "succeed" (one via skip, one via sync)
      expect(result.total).toBe(2);
    });

    it('tracks multiple conflict skips', async () => {
      mockServerStateChecker.mockResolvedValue(true); // All already complete

      const op1 = createMockOperation('op_1', true, mockHabitId1);
      const op2 = createMockOperation('op_2', true, mockHabitId2);
      const op3 = createMockOperation('op_3', true, mockHabitId1, '2026-01-16');
      mockQueueManager.getState.mockReturnValue(
        setupQueueState([op1, op2, op3])
      );

      const deps = createDeps(mockServerStateChecker);
      const result = await processQueue(deps, {});

      expect(result.conflictSkipped).toBe(3);
      expect(result.succeeded).toBe(3);
      expect(result.allSucceeded).toBe(true);
    });

    it('returns zero conflictSkipped when all operations sync', async () => {
      mockServerStateChecker.mockResolvedValue(false); // None already complete

      const op1 = createMockOperation('op_1', true, mockHabitId1);
      const op2 = createMockOperation('op_2', true, mockHabitId2);
      mockQueueManager.getState.mockReturnValue(setupQueueState([op1, op2]));

      const deps = createDeps(mockServerStateChecker);
      const result = await processQueue(deps, {});

      expect(result.conflictSkipped).toBe(0);
      expect(result.succeeded).toBe(2);
    });
  });

  describe('config propagation', () => {
    it('passes conflictConfig to processSingleOperation', async () => {
      mockServerStateChecker.mockResolvedValue(true);
      const op = createMockOperation('op_1', true);
      mockQueueManager.getState.mockReturnValue(setupQueueState([op]));

      const deps = createDeps(mockServerStateChecker);
      const config: ProcessQueueConfig = {
        conflictConfig: { checkServerStateBeforeSync: false },
      };

      const result = await processQueue(deps, config);

      // When checkServerStateBeforeSync is false, sync should proceed
      expect(mockSyncManager.syncItem).toHaveBeenCalled();
      expect(result.conflictSkipped).toBe(0);
    });

    it('passes onConflict callback to processSingleOperation', async () => {
      mockServerStateChecker.mockResolvedValue(true);
      const op = createMockOperation('op_1', true);
      mockQueueManager.getState.mockReturnValue(setupQueueState([op]));

      const deps = createDeps(mockServerStateChecker);
      const onConflict = jest.fn();
      const config: ProcessQueueConfig = { onConflict };

      await processQueue(deps, config);

      expect(onConflict).toHaveBeenCalled();
    });

    it('passes onConflictSkip callback to processSingleOperation', async () => {
      mockServerStateChecker.mockResolvedValue(true);
      const op = createMockOperation('op_1', true);
      mockQueueManager.getState.mockReturnValue(setupQueueState([op]));

      const deps = createDeps(mockServerStateChecker);
      const onConflictSkip = jest.fn();
      const config: ProcessQueueConfig = { onConflictSkip };

      await processQueue(deps, config);

      expect(onConflictSkip).toHaveBeenCalledWith(
        op,
        expect.stringContaining('completion wins')
      );
    });
  });

  describe('US4 acceptance criteria', () => {
    /**
     * US4 AC1: Given same habit completed on Device A and B offline,
     * When both sync, Then remains marked complete (completion wins)
     */
    it('AC1: handles concurrent completion - completion wins', async () => {
      // Device A already synced completion, server says complete
      mockServerStateChecker.mockResolvedValue(true);

      // Device B tries to sync same completion
      const opFromDeviceB = createMockOperation('op_deviceB', true);
      mockQueueManager.getState.mockReturnValue(
        setupQueueState([opFromDeviceB])
      );

      const deps = createDeps(mockServerStateChecker);
      const result = await processQueue(deps, {});

      // Should skip unnecessary sync, but mark as success
      expect(result.succeeded).toBe(1);
      expect(result.conflictSkipped).toBe(1);
      expect(mockSyncManager.syncItem).not.toHaveBeenCalled();
      expect(mockQueueManager.markCompleted).toHaveBeenCalledWith('op_deviceB');
    });

    /**
     * US4 AC2: Given conflict occurs, When user notified,
     * Then informational only, no action required
     */
    it('AC2: notifies via onConflict callback when conflict detected', async () => {
      mockServerStateChecker.mockResolvedValue(true);
      const op = createMockOperation('op_1', true);
      mockQueueManager.getState.mockReturnValue(setupQueueState([op]));

      const onConflict = jest.fn();
      const deps = createDeps(mockServerStateChecker);
      const config: ProcessQueueConfig = { onConflict };

      await processQueue(deps, config);

      // Verify informational notification was sent
      expect(onConflict).toHaveBeenCalled();
      const event: ConflictEvent = onConflict.mock.calls[0][0];
      expect(event.type).toMatch(/conflict:(detected|skip_sync)/);
    });
  });

  describe('edge cases', () => {
    it('handles empty queue with conflict config', async () => {
      mockQueueManager.getState.mockReturnValue(setupQueueState([]));

      const deps = createDeps(mockServerStateChecker);
      const result = await processQueue(deps, { conflictConfig: {} });

      expect(result.total).toBe(0);
      expect(result.conflictSkipped).toBe(0);
      expect(mockServerStateChecker).not.toHaveBeenCalled();
    });

    it('handles mixed success, failure, and conflict skip', async () => {
      // First op: conflict skip (server already complete)
      // Second op: sync success (server not complete)
      // Third op: sync failure (executor fails)
      mockServerStateChecker.mockImplementation(async (habitId, date) => {
        if (habitId === mockHabitId1 && date === mockDate) return true;
        return false;
      });
      mockSyncManager.syncItem
        .mockResolvedValueOnce({
          item: { retryContext: { exhausted: false } },
          success: true,
        })
        .mockResolvedValueOnce({
          error: { message: 'Network error' },
          item: { retryContext: { exhausted: true } },
          success: false,
        });

      const op1 = createMockOperation('op_1', true, mockHabitId1, mockDate);
      const op2 = createMockOperation('op_2', true, mockHabitId2, mockDate);
      const op3 = createMockOperation('op_3', true, mockHabitId1, '2026-01-16');
      mockQueueManager.getState.mockReturnValue(
        setupQueueState([op1, op2, op3])
      );

      const deps = createDeps(mockServerStateChecker);
      const result = await processQueue(deps, {});

      expect(result.conflictSkipped).toBe(1); // op_1
      expect(result.succeeded).toBe(2); // op_1 (via skip) + op_2 (via sync)
      expect(result.failed).toBe(1); // op_3
      expect(result.total).toBe(3);
    });
  });
});
