/**
 * Conflict Detection Integration Tests
 *
 * Tests for conflict detection integration in processSingleOperation.
 * Implements US4 (Graceful Conflict Resolution) integration into queue processing.
 *
 * @see docs/offline-habit-sync.md US4 - Graceful Conflict Resolution
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { OfflineOperation } from '../../../queue';
import type { OfflineQueueManagerAPI } from '../../../queueManager';
import type { OfflineSyncManager, SyncItem } from '../../../syncManager';
import type {
  CompletionStateChecker,
  ConflictEvent,
} from '../../conflictResolver';
import type { QueueProcessorDeps, ProcessSingleOptions } from '../types';
import { processSingleOperation } from '../processSingleOperation';

describe('processSingleOperation conflict detection (US4)', () => {
  const mockHabitId = 'habit_123' as Id<'habits'>;
  const mockDate = '2026-01-15';

  // Mock dependencies
  let mockQueueManager: jest.Mocked<OfflineQueueManagerAPI>;
  let mockSyncManager: jest.Mocked<OfflineSyncManager>;
  let mockExecutor: jest.Mock;
  let mockServerStateChecker: jest.MockedFunction<CompletionStateChecker>;

  function createMockOperation(
    id: string,
    toCompleted: boolean,
    habitId: Id<'habits'> = mockHabitId,
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

  function createOptions(
    callbacks?: ProcessSingleOptions['callbacks'],
    conflictConfig?: ProcessSingleOptions['conflictConfig']
  ): ProcessSingleOptions {
    return {
      callbacks,
      conflictConfig,
      context: {
        batchIndex: 0,
        batchSize: 1,
        failedCount: 0,
        skippedCount: 0,
        startedAt: Date.now(),
        successCount: 0,
      },
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

  describe('without serverStateChecker', () => {
    it('proceeds with sync when no server state checker is provided', async () => {
      const operation = createMockOperation('op_1', true);
      const deps = createDeps(); // No server state checker
      const options = createOptions();

      const result = await processSingleOperation(operation, deps, options);

      expect(result.success).toBe(true);
      expect(result.skippedDueToConflict).toBeUndefined();
      expect(mockSyncManager.syncItem).toHaveBeenCalled();
      expect(mockQueueManager.markCompleted).toHaveBeenCalledWith('op_1');
    });
  });

  describe('with serverStateChecker', () => {
    describe('completion wins strategy (FR-010)', () => {
      it('skips sync when offline wants complete and server is already complete', async () => {
        mockServerStateChecker.mockResolvedValue(true); // Server says completed
        const operation = createMockOperation('op_1', true); // Offline wants complete
        const deps = createDeps(mockServerStateChecker);
        const options = createOptions();

        const result = await processSingleOperation(operation, deps, options);

        expect(result.success).toBe(true);
        expect(result.skippedDueToConflict).toBe(true);
        expect(result.conflictResolution).toBe('skip');
        expect(mockSyncManager.syncItem).not.toHaveBeenCalled();
        expect(mockQueueManager.markCompleted).toHaveBeenCalledWith('op_1');
      });

      it('skips sync when offline wants uncomplete and server is already uncomplete', async () => {
        mockServerStateChecker.mockResolvedValue(false); // Server says not completed
        const operation = createMockOperation('op_1', false); // Offline wants uncomplete
        const deps = createDeps(mockServerStateChecker);
        const options = createOptions();

        const result = await processSingleOperation(operation, deps, options);

        expect(result.success).toBe(true);
        expect(result.skippedDueToConflict).toBe(true);
        expect(result.conflictResolution).toBe('skip');
        expect(mockSyncManager.syncItem).not.toHaveBeenCalled();
      });

      it('syncs when offline wants complete and server is not complete', async () => {
        mockServerStateChecker.mockResolvedValue(false); // Server says not completed
        const operation = createMockOperation('op_1', true); // Offline wants complete
        const deps = createDeps(mockServerStateChecker);
        const options = createOptions();

        const result = await processSingleOperation(operation, deps, options);

        expect(result.success).toBe(true);
        expect(result.skippedDueToConflict).toBeUndefined();
        expect(result.conflictResolution).toBe('sync');
        expect(mockSyncManager.syncItem).toHaveBeenCalled();
      });

      it('syncs when offline wants uncomplete and server is complete', async () => {
        mockServerStateChecker.mockResolvedValue(true); // Server says completed
        const operation = createMockOperation('op_1', false); // Offline wants uncomplete
        const deps = createDeps(mockServerStateChecker);
        const options = createOptions();

        const result = await processSingleOperation(operation, deps, options);

        expect(result.success).toBe(true);
        expect(result.skippedDueToConflict).toBeUndefined();
        expect(result.conflictResolution).toBe('sync');
        expect(mockSyncManager.syncItem).toHaveBeenCalled();
      });
    });

    describe('fail-safe behavior', () => {
      it('proceeds with sync when server check returns null', async () => {
        mockServerStateChecker.mockResolvedValue(null); // Unknown state
        const operation = createMockOperation('op_1', true);
        const deps = createDeps(mockServerStateChecker);
        const options = createOptions();

        const result = await processSingleOperation(operation, deps, options);

        expect(result.success).toBe(true);
        expect(result.skippedDueToConflict).toBeUndefined();
        expect(mockSyncManager.syncItem).toHaveBeenCalled();
      });

      it('proceeds with sync when server check throws error', async () => {
        mockServerStateChecker.mockRejectedValue(new Error('Network error'));
        const operation = createMockOperation('op_1', true);
        const deps = createDeps(mockServerStateChecker);
        const options = createOptions();

        const result = await processSingleOperation(operation, deps, options);

        expect(result.success).toBe(true);
        expect(result.skippedDueToConflict).toBeUndefined();
        expect(mockSyncManager.syncItem).toHaveBeenCalled();
      });
    });

    describe('callbacks', () => {
      it('calls onConflictSkip callback when operation is skipped due to conflict', async () => {
        mockServerStateChecker.mockResolvedValue(true);
        const operation = createMockOperation('op_1', true);
        const deps = createDeps(mockServerStateChecker);
        const onConflictSkip = jest.fn();
        const options = createOptions({ onConflictSkip });

        await processSingleOperation(operation, deps, options);

        expect(onConflictSkip).toHaveBeenCalledWith(
          operation,
          expect.stringContaining('completion wins')
        );
      });

      it('calls onConflict event listener when conflict detected', async () => {
        mockServerStateChecker.mockResolvedValue(true);
        const operation = createMockOperation('op_1', true);
        const deps = createDeps(mockServerStateChecker);
        const onConflict = jest.fn();
        const options = createOptions({ onConflict });

        await processSingleOperation(operation, deps, options);

        expect(onConflict).toHaveBeenCalled();
        const event: ConflictEvent = onConflict.mock.calls[0][0];
        expect(event.type).toMatch(/conflict:/);
        expect(event.data.operationId).toBe('op_1');
        expect(event.data.habitId).toBe(mockHabitId);
        expect(event.data.date).toBe(mockDate);
      });

      it('does not call onSuccess when skipped due to conflict', async () => {
        mockServerStateChecker.mockResolvedValue(true);
        const operation = createMockOperation('op_1', true);
        const deps = createDeps(mockServerStateChecker);
        const onSuccess = jest.fn();
        const onConflictSkip = jest.fn();
        const options = createOptions({ onConflictSkip, onSuccess });

        await processSingleOperation(operation, deps, options);

        // onSuccess is for actual syncs, not conflict skips
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onConflictSkip).toHaveBeenCalled();
      });
    });

    describe('conflict configuration', () => {
      it('respects checkServerStateBeforeSync=false config', async () => {
        mockServerStateChecker.mockResolvedValue(true);
        const operation = createMockOperation('op_1', true);
        const deps = createDeps(mockServerStateChecker);
        const options = createOptions(undefined, {
          checkServerStateBeforeSync: false,
        });

        const result = await processSingleOperation(operation, deps, options);

        expect(result.success).toBe(true);
        expect(result.skippedDueToConflict).toBeUndefined();
        expect(mockSyncManager.syncItem).toHaveBeenCalled();
      });
    });
  });

  describe('operation marking', () => {
    it('marks operation as completed when skipped due to conflict', async () => {
      mockServerStateChecker.mockResolvedValue(true);
      const operation = createMockOperation('op_1', true);
      const deps = createDeps(mockServerStateChecker);
      const options = createOptions();

      await processSingleOperation(operation, deps, options);

      expect(mockQueueManager.markCompleted).toHaveBeenCalledWith('op_1');
      expect(mockQueueManager.markSyncing).not.toHaveBeenCalled();
    });

    it('marks operation as syncing when proceeding with sync', async () => {
      mockServerStateChecker.mockResolvedValue(false);
      const operation = createMockOperation('op_1', true);
      const deps = createDeps(mockServerStateChecker);
      const options = createOptions();

      await processSingleOperation(operation, deps, options);

      expect(mockQueueManager.markSyncing).toHaveBeenCalledWith('op_1');
    });
  });

  describe('result fields', () => {
    it('returns conflictResolution=skip for conflict skipped operations', async () => {
      mockServerStateChecker.mockResolvedValue(true);
      const operation = createMockOperation('op_1', true);
      const deps = createDeps(mockServerStateChecker);
      const options = createOptions();

      const result = await processSingleOperation(operation, deps, options);

      expect(result.conflictResolution).toBe('skip');
      expect(result.skippedDueToConflict).toBe(true);
      expect(result.shouldRetry).toBe(false);
    });

    it('returns conflictResolution=sync for synced operations', async () => {
      mockServerStateChecker.mockResolvedValue(false);
      const operation = createMockOperation('op_1', true);
      const deps = createDeps(mockServerStateChecker);
      const options = createOptions();

      const result = await processSingleOperation(operation, deps, options);

      expect(result.conflictResolution).toBe('sync');
      expect(result.skippedDueToConflict).toBeUndefined();
    });
  });

  describe('timing', () => {
    it('includes duration for conflict-skipped operations', async () => {
      mockServerStateChecker.mockResolvedValue(true);
      const operation = createMockOperation('op_1', true);
      const deps = createDeps(mockServerStateChecker);
      const options = createOptions();

      const result = await processSingleOperation(operation, deps, options);

      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });
});
