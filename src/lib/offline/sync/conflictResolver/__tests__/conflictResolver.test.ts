/**
 * Conflict Resolver Tests
 *
 * Tests for conflict resolution during offline sync operations.
 * Implements US4 (Graceful Conflict Resolution) and FR-010 (completion wins).
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { OfflineOperation } from '../../../queue';
import {
  DEFAULT_CONFLICT_RESOLVER_CONFIG,
  resolveOperation,
  resolveOperations,
  resolveOperationsBatch,
} from '../conflictResolver';
import { createHabitDateKey } from '../helpers';
import type {
  BatchCompletionStateChecker,
  CompletionStateChecker,
  ConflictEvent,
} from '../types';

describe('conflictResolver', () => {
  const mockHabitId = 'habit_123' as Id<'habits'>;
  const mockDate = '2026-01-15';

  // Use fake timers to prevent leaks from timeout tests
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  function createMockOperation(
    id: string,
    toCompleted: boolean,
    habitId: Id<'habits'> = mockHabitId,
    date: string = mockDate
  ): OfflineOperation<'toggleCompletion'> {
    return {
      id,
      type: 'toggleCompletion',
      payload: { habitId, date, toCompleted },
      status: 'pending',
      createdAt: Date.now(),
      retryCount: 0,
    };
  }

  describe('DEFAULT_CONFLICT_RESOLVER_CONFIG', () => {
    it('has sensible defaults', () => {
      expect(DEFAULT_CONFLICT_RESOLVER_CONFIG.checkServerStateBeforeSync).toBe(
        true
      );
      expect(DEFAULT_CONFLICT_RESOLVER_CONFIG.serverCheckTimeoutMs).toBe(5000);
      expect(DEFAULT_CONFLICT_RESOLVER_CONFIG.completionWins).toBe(true);
    });
  });

  describe('resolveOperation', () => {
    describe('completion wins strategy (FR-010)', () => {
      it('skips sync when offline wants complete and server is complete', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const result = await resolveOperation(operation, checkServerState);

        expect(result.resolution).toBe('skip');
        expect(result.hasConflict).toBe(true);
        expect(result.reason).toContain('completion wins');
        expect(checkServerState).toHaveBeenCalledWith(mockHabitId, mockDate);
      });

      it('syncs when offline wants complete and server is not complete', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(false);

        const result = await resolveOperation(operation, checkServerState);

        expect(result.resolution).toBe('sync');
        expect(result.hasConflict).toBe(false);
      });

      it('syncs when offline wants uncomplete and server is complete', async () => {
        const operation = createMockOperation('op_1', false);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);

        const result = await resolveOperation(operation, checkServerState);

        expect(result.resolution).toBe('sync');
        expect(result.hasConflict).toBe(false);
      });

      it('skips sync when offline wants uncomplete and server is not complete', async () => {
        const operation = createMockOperation('op_1', false);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(false);

        const result = await resolveOperation(operation, checkServerState);

        expect(result.resolution).toBe('skip');
        expect(result.hasConflict).toBe(true);
      });
    });

    describe('server state checking', () => {
      it('proceeds with sync when server returns null (unknown state)', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(null);

        const result = await resolveOperation(operation, checkServerState);

        expect(result.resolution).toBe('sync');
        expect(result.reason).toContain('Could not determine');
        expect(result.serverState).toBeUndefined();
      });

      it('proceeds with sync on server check error (fail-safe)', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockRejectedValue(new Error('Network error'));

        const result = await resolveOperation(operation, checkServerState);

        expect(result.resolution).toBe('sync');
        expect(result.reason).toContain('Network error');
        expect(result.reason).toContain('proceeding with sync');
      });

      it('proceeds with sync on timeout', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockImplementation(
            () =>
              new Promise((resolve) => setTimeout(() => resolve(true), 10000))
          );

        const resultPromise = resolveOperation(operation, checkServerState, {
          serverCheckTimeoutMs: 50,
        });

        // Advance timers to trigger the timeout
        jest.advanceTimersByTime(100);

        const result = await resultPromise;
        expect(result.resolution).toBe('sync');
        expect(result.reason).toContain('timed out');
      });
    });

    describe('configuration options', () => {
      it('skips server check when disabled', async () => {
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
    });

    describe('event emission', () => {
      it('emits conflict:detected event on conflict', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);
        const events: ConflictEvent[] = [];

        await resolveOperation(operation, checkServerState, {}, (e) =>
          events.push(e)
        );

        expect(events).toHaveLength(2); // detected + skip_sync
        expect(events[0].type).toBe('conflict:detected');
        expect(events[0].data.operationId).toBe('op_1');
        expect(events[0].data.resolution).toBe('skip');
      });

      it('emits conflict:skip_sync event when skipping', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(true);
        const events: ConflictEvent[] = [];

        await resolveOperation(operation, checkServerState, {}, (e) =>
          events.push(e)
        );

        expect(events[1].type).toBe('conflict:skip_sync');
      });

      it('emits conflict:error event on error', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockRejectedValue(new Error('Test error'));
        const events: ConflictEvent[] = [];

        await resolveOperation(operation, checkServerState, {}, (e) =>
          events.push(e)
        );

        expect(events).toHaveLength(1);
        expect(events[0].type).toBe('conflict:error');
        expect(events[0].data.error?.message).toBe('Test error');
      });

      it('does not emit events when no conflict', async () => {
        const operation = createMockOperation('op_1', true);
        const checkServerState: CompletionStateChecker = jest
          .fn()
          .mockResolvedValue(false);
        const events: ConflictEvent[] = [];

        await resolveOperation(operation, checkServerState, {}, (e) =>
          events.push(e)
        );

        expect(events).toHaveLength(0);
      });
    });
  });

  describe('resolveOperations (batch)', () => {
    it('returns empty result for empty operations', async () => {
      const checkServerState: CompletionStateChecker = jest.fn();

      const result = await resolveOperations([], checkServerState);

      expect(result.total).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(checkServerState).not.toHaveBeenCalled();
    });

    it('resolves multiple operations using individual checker', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId, '2026-01-01'),
        createMockOperation('op_2', true, mockHabitId, '2026-01-02'),
        createMockOperation('op_3', false, mockHabitId, '2026-01-03'),
      ];

      const serverStates: Record<string, boolean> = {
        '2026-01-01': true, // conflict - skip
        '2026-01-02': false, // no conflict - sync
        '2026-01-03': false, // conflict - skip
      };

      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockImplementation((_, date) => Promise.resolve(serverStates[date]));

      const result = await resolveOperations(operations, checkServerState);

      expect(result.total).toBe(3);
      expect(result.syncCount).toBe(1);
      expect(result.skipCount).toBe(2);
      expect(result.conflictsDetected).toBe(2);
      expect(checkServerState).toHaveBeenCalledTimes(3);
    });

    it('resolves operations using batch checker', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId, '2026-01-01'),
        createMockOperation('op_2', true, mockHabitId, '2026-01-02'),
      ];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(
          new Map([
            [createHabitDateKey(mockHabitId, '2026-01-01'), true],
            [createHabitDateKey(mockHabitId, '2026-01-02'), false],
          ])
        );

      const result = await resolveOperationsBatch(operations, batchChecker);

      expect(result.total).toBe(2);
      expect(result.syncCount).toBe(1); // 2026-01-02
      expect(result.skipCount).toBe(1); // 2026-01-01 (conflict)
      expect(batchChecker).toHaveBeenCalledTimes(1);
    });

    it('skips server check for all when disabled', async () => {
      const operations = [
        createMockOperation('op_1', true),
        createMockOperation('op_2', true),
      ];
      const checkServerState: CompletionStateChecker = jest.fn();

      const result = await resolveOperations(operations, checkServerState, {
        checkServerStateBeforeSync: false,
      });

      expect(result.total).toBe(2);
      expect(result.syncCount).toBe(2);
      expect(checkServerState).not.toHaveBeenCalled();
    });

    it('handles batch checker timeout gracefully', async () => {
      const operations = [createMockOperation('op_1', true)];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve(new Map()), 10000)
            )
        );

      const resultPromise = resolveOperationsBatch(operations, batchChecker, {
        serverCheckTimeoutMs: 50,
      });

      // Advance timers to trigger the timeout
      jest.advanceTimersByTime(100);

      const result = await resultPromise;
      expect(result.total).toBe(1);
      expect(result.syncCount).toBe(1); // fail-safe: proceed with sync
    });

    it('handles batch checker error gracefully', async () => {
      const operations = [
        createMockOperation('op_1', true),
        createMockOperation('op_2', true),
      ];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockRejectedValue(new Error('Batch error'));

      const result = await resolveOperationsBatch(operations, batchChecker);

      expect(result.total).toBe(2);
      expect(result.syncCount).toBe(2); // fail-safe: proceed with sync
      expect(result.results[0].reason).toContain('Batch server check failed');
    });

    it('handles missing server state in batch response', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId, '2026-01-01'),
        createMockOperation('op_2', true, mockHabitId, '2026-01-02'),
      ];

      // Only return state for first operation
      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(
          new Map([[createHabitDateKey(mockHabitId, '2026-01-01'), true]])
        );

      const result = await resolveOperationsBatch(operations, batchChecker);

      expect(result.total).toBe(2);
      // op_1: conflict (skip), op_2: unknown state (sync)
      expect(result.skipCount).toBe(1);
      expect(result.syncCount).toBe(1);
      expect(result.results[1].reason).toContain('Server state not found');
    });
  });

  describe('US4: Multi-device conflict scenario', () => {
    it('preserves completion when both devices mark complete offline', async () => {
      // Scenario: Device A and B both mark habit complete while offline
      // Device A syncs first, server now shows complete
      // Device B tries to sync - should SKIP because completion already exists

      const deviceBOperation = createMockOperation('op_device_b', true);

      // After Device A synced, server shows complete
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const result = await resolveOperation(deviceBOperation, checkServerState);

      expect(result.resolution).toBe('skip');
      expect(result.hasConflict).toBe(true);
      expect(result.reason).toContain('completion wins');
    });

    it('allows toggle off after multi-device complete', async () => {
      // Scenario: Both devices completed, user on Device B wants to undo
      // Device B marks as incomplete while online sees it as complete
      // Should SYNC to toggle off the completion

      const undoOperation = createMockOperation('op_undo', false);
      const checkServerState: CompletionStateChecker = jest
        .fn()
        .mockResolvedValue(true);

      const result = await resolveOperation(undoOperation, checkServerState);

      expect(result.resolution).toBe('sync');
      expect(result.hasConflict).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles multiple habits in batch', async () => {
      const habit1 = 'habit_1' as Id<'habits'>;
      const habit2 = 'habit_2' as Id<'habits'>;

      const operations = [
        createMockOperation('op_1', true, habit1, '2026-01-01'),
        createMockOperation('op_2', true, habit2, '2026-01-01'),
      ];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(
          new Map([
            [createHabitDateKey(habit1, '2026-01-01'), true], // conflict
            [createHabitDateKey(habit2, '2026-01-01'), false], // no conflict
          ])
        );

      const result = await resolveOperationsBatch(operations, batchChecker);

      expect(result.total).toBe(2);
      expect(result.conflictsDetected).toBe(1);
      expect(result.skipCount).toBe(1);
      expect(result.syncCount).toBe(1);
    });

    it('handles same habit multiple dates', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId, '2026-01-01'),
        createMockOperation('op_2', true, mockHabitId, '2026-01-02'),
        createMockOperation('op_3', true, mockHabitId, '2026-01-03'),
      ];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(
          new Map([
            [createHabitDateKey(mockHabitId, '2026-01-01'), true],
            [createHabitDateKey(mockHabitId, '2026-01-02'), true],
            [createHabitDateKey(mockHabitId, '2026-01-03'), false],
          ])
        );

      const result = await resolveOperationsBatch(operations, batchChecker);

      expect(result.conflictsDetected).toBe(2);
      expect(result.skipCount).toBe(2);
      expect(result.syncCount).toBe(1);
    });

    it('counts completion-wins resolutions correctly', async () => {
      const operations = [
        createMockOperation('op_1', true, mockHabitId, '2026-01-01'), // complete conflict -> skip
        createMockOperation('op_2', false, mockHabitId, '2026-01-02'), // uncomplete conflict -> skip
      ];

      const batchChecker: BatchCompletionStateChecker = jest
        .fn()
        .mockResolvedValue(
          new Map([
            [createHabitDateKey(mockHabitId, '2026-01-01'), true], // conflict
            [createHabitDateKey(mockHabitId, '2026-01-02'), false], // conflict
          ])
        );

      const result = await resolveOperationsBatch(operations, batchChecker);

      expect(result.conflictsDetected).toBe(2);
      expect(result.conflictsResolvedByCompletionWins).toBe(2);
    });
  });
});
