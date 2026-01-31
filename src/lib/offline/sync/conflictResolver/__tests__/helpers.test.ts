/**
 * Conflict Resolver Helpers Tests
 *
 * Tests for pure conflict detection and resolution logic.
 */

import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { ToggleCompletionPayload } from '../../../queue';
import type { ConflictResolutionResult, ServerCompletionState } from '../types';
import {
  buildBatchResult,
  buildResolutionResult,
  createConflictEvent,
  createEmptyBatchResult,
  createHabitDateKey,
  detectConflict,
  parseHabitDateKey,
  resolveConflict,
} from '../helpers';

describe('conflictResolver/helpers', () => {
  const mockHabitId = 'habit_123' as Id<'habits'>;
  const mockDate = '2026-01-15';

  describe('createHabitDateKey', () => {
    it('creates a unique key from habit ID and date', () => {
      const key = createHabitDateKey(mockHabitId, mockDate);
      expect(key).toBe('habit_123:2026-01-15');
    });

    it('handles different habit IDs correctly', () => {
      const key1 = createHabitDateKey('h1' as Id<'habits'>, '2026-01-01');
      const key2 = createHabitDateKey('h2' as Id<'habits'>, '2026-01-01');
      expect(key1).not.toBe(key2);
    });

    it('handles different dates correctly', () => {
      const key1 = createHabitDateKey(mockHabitId, '2026-01-01');
      const key2 = createHabitDateKey(mockHabitId, '2026-01-02');
      expect(key1).not.toBe(key2);
    });
  });

  describe('parseHabitDateKey', () => {
    it('parses a key back into components', () => {
      const { habitId, date } = parseHabitDateKey('habit_123:2026-01-15');
      expect(habitId).toBe('habit_123');
      expect(date).toBe('2026-01-15');
    });

    it('handles keys with special characters in habit ID', () => {
      const { habitId, date } = parseHabitDateKey('habit_abc_xyz:2026-12-31');
      expect(habitId).toBe('habit_abc_xyz');
      expect(date).toBe('2026-12-31');
    });
  });

  describe('detectConflict', () => {
    it('detects conflict when offline wants to complete and server is complete', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: true,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: true,
        fetchedAt: Date.now(),
      };

      expect(detectConflict(payload, serverState)).toBe(true);
    });

    it('detects conflict when offline wants to uncomplete and server is uncomplete', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: false,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: false,
        fetchedAt: Date.now(),
      };

      expect(detectConflict(payload, serverState)).toBe(true);
    });

    it('no conflict when offline wants to complete and server is uncomplete', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: true,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: false,
        fetchedAt: Date.now(),
      };

      expect(detectConflict(payload, serverState)).toBe(false);
    });

    it('no conflict when offline wants to uncomplete and server is complete', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: false,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: true,
        fetchedAt: Date.now(),
      };

      expect(detectConflict(payload, serverState)).toBe(false);
    });
  });

  describe('resolveConflict', () => {
    it('SKIP when offline wants to complete and server is complete (FR-010)', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: true,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: true,
        fetchedAt: Date.now(),
      };

      const result = resolveConflict(payload, serverState);
      expect(result.resolution).toBe('skip');
      expect(result.reason).toContain('completion wins');
    });

    it('SYNC when offline wants to complete and server is not complete', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: true,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: false,
        fetchedAt: Date.now(),
      };

      const result = resolveConflict(payload, serverState);
      expect(result.resolution).toBe('sync');
      expect(result.reason).toContain('marked complete');
    });

    it('SYNC when offline wants to uncomplete and server is complete', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: false,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: true,
        fetchedAt: Date.now(),
      };

      const result = resolveConflict(payload, serverState);
      expect(result.resolution).toBe('sync');
      expect(result.reason).toContain('incomplete');
    });

    it('SKIP when offline wants to uncomplete and server is not complete', () => {
      const payload: ToggleCompletionPayload = {
        habitId: mockHabitId,
        date: mockDate,
        toCompleted: false,
      };
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: false,
        fetchedAt: Date.now(),
      };

      const result = resolveConflict(payload, serverState);
      expect(result.resolution).toBe('skip');
      expect(result.reason).toContain('state achieved');
    });
  });

  describe('buildResolutionResult', () => {
    const mockPayload: ToggleCompletionPayload = {
      habitId: mockHabitId,
      date: mockDate,
      toCompleted: true,
    };

    it('builds result with conflict detected', () => {
      const serverState: ServerCompletionState = {
        habitId: mockHabitId,
        date: mockDate,
        isCompleted: true,
        fetchedAt: Date.now(),
      };

      const result = buildResolutionResult(
        'op_1',
        mockPayload,
        serverState,
        'skip',
        'Conflict resolved'
      );

      expect(result.operationId).toBe('op_1');
      expect(result.payload).toEqual(mockPayload);
      expect(result.hasConflict).toBe(true);
      expect(result.resolution).toBe('skip');
      expect(result.reason).toBe('Conflict resolved');
      expect(result.serverState).toEqual(serverState);
    });

    it('builds result without server state', () => {
      const result = buildResolutionResult(
        'op_2',
        mockPayload,
        undefined,
        'sync',
        'No server state'
      );

      expect(result.operationId).toBe('op_2');
      expect(result.hasConflict).toBe(false);
      expect(result.serverState).toBeUndefined();
    });
  });

  describe('buildBatchResult', () => {
    it('aggregates results correctly', () => {
      const results: ConflictResolutionResult[] = [
        {
          operationId: 'op_1',
          payload: {
            habitId: mockHabitId,
            date: '2026-01-01',
            toCompleted: true,
          },
          hasConflict: true,
          resolution: 'skip',
          reason: 'Completion wins',
        },
        {
          operationId: 'op_2',
          payload: {
            habitId: mockHabitId,
            date: '2026-01-02',
            toCompleted: true,
          },
          hasConflict: false,
          resolution: 'sync',
          reason: 'Need to sync',
        },
        {
          operationId: 'op_3',
          payload: {
            habitId: mockHabitId,
            date: '2026-01-03',
            toCompleted: false,
          },
          hasConflict: true,
          resolution: 'skip',
          reason: 'State achieved',
        },
      ];

      const batch = buildBatchResult(results);

      expect(batch.total).toBe(3);
      expect(batch.syncCount).toBe(1);
      expect(batch.skipCount).toBe(2);
      expect(batch.failCount).toBe(0);
      expect(batch.conflictsDetected).toBe(2);
      expect(batch.conflictsResolvedByCompletionWins).toBe(2);
      expect(batch.results).toEqual(results);
    });

    it('handles failed resolutions', () => {
      const results: ConflictResolutionResult[] = [
        {
          operationId: 'op_1',
          payload: {
            habitId: mockHabitId,
            date: '2026-01-01',
            toCompleted: true,
          },
          hasConflict: false,
          resolution: 'fail',
          reason: 'Cannot resolve',
        },
      ];

      const batch = buildBatchResult(results);
      expect(batch.failCount).toBe(1);
      expect(batch.syncCount).toBe(0);
      expect(batch.skipCount).toBe(0);
    });

    it('handles empty results', () => {
      const batch = buildBatchResult([]);
      expect(batch.total).toBe(0);
      expect(batch.syncCount).toBe(0);
      expect(batch.skipCount).toBe(0);
      expect(batch.failCount).toBe(0);
      expect(batch.conflictsDetected).toBe(0);
    });
  });

  describe('createConflictEvent', () => {
    it('creates event with correct type and timestamp', () => {
      const before = Date.now();
      const event = createConflictEvent('conflict:detected', {
        operationId: 'op_1',
        habitId: mockHabitId,
        date: mockDate,
        resolution: 'skip',
      });
      const after = Date.now();

      expect(event.type).toBe('conflict:detected');
      expect(event.timestamp).toBeGreaterThanOrEqual(before);
      expect(event.timestamp).toBeLessThanOrEqual(after);
      expect(event.data.operationId).toBe('op_1');
      expect(event.data.habitId).toBe(mockHabitId);
      expect(event.data.date).toBe(mockDate);
    });

    it('includes error when provided', () => {
      const error = new Error('Test error');
      const event = createConflictEvent('conflict:error', {
        operationId: 'op_1',
        habitId: mockHabitId,
        date: mockDate,
        error,
      });

      expect(event.type).toBe('conflict:error');
      expect(event.data.error).toBe(error);
    });
  });

  describe('createEmptyBatchResult', () => {
    it('creates empty batch with all counts at zero', () => {
      const batch = createEmptyBatchResult();

      expect(batch.results).toEqual([]);
      expect(batch.total).toBe(0);
      expect(batch.syncCount).toBe(0);
      expect(batch.skipCount).toBe(0);
      expect(batch.failCount).toBe(0);
      expect(batch.conflictsDetected).toBe(0);
      expect(batch.conflictsResolvedByCompletionWins).toBe(0);
    });
  });
});
