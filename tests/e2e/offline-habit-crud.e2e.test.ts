/**
 * E2E Tests for Offline Habit CRUD Operations
 *
 * Tests offline resilience for:
 * - Creating habits while offline
 * - Editing habits while offline
 * - Archiving/pausing/removing habits while offline
 * - Sync reconciliation when coming back online
 */

import type { Id } from '../../convex/_generated/dataModel';
import {
  createOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../src/lib/offline';
import type {
  OfflineQueueManagerAPI,
  CreateHabitPayload,
  UpdateHabitPayload,
} from '../../src/lib/offline';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Offline Habit CRUD E2E', () => {
  let queueManager: OfflineQueueManagerAPI;

  beforeEach(() => {
    jest.clearAllMocks();
    resetOfflineQueueManager();
    queueManager = createOfflineQueueManager({ autoPersist: false });
  });

  describe('Create Habit Offline', () => {
    it('should queue habit creation when offline', () => {
      const payload: CreateHabitPayload = {
        color: '#047857',
        icon: '💪',
        name: 'Morning Workout',
        notes: 'Exercise for 30 minutes',
        tempId: 'temp_123_abc',
      };

      const result = queueManager.enqueue('createHabit', payload);

      expect(result.success).toBe(true);
      expect(result.operationId).toBeDefined();

      const state = queueManager.getState();
      expect(state.operations).toHaveLength(1);
      expect(state.operations[0].type).toBe('createHabit');
      expect(state.operations[0].payload).toMatchObject(payload);
    });

    it('should assign unique temp IDs for multiple creations', () => {
      const habit1 = queueManager.enqueue('createHabit', {
        name: 'Habit 1',
        tempId: 'temp_1',
      });

      const habit2 = queueManager.enqueue('createHabit', {
        name: 'Habit 2',
        tempId: 'temp_2',
      });

      expect(habit1.operationId).not.toBe(habit2.operationId);
      const state = queueManager.getState();
      expect(state.operations).toHaveLength(2);
    });

    it('should preserve habit creation order in queue (FIFO)', () => {
      queueManager.enqueue('createHabit', {
        name: 'First Habit',
        tempId: 'temp_first',
      });
      queueManager.enqueue('createHabit', {
        name: 'Second Habit',
        tempId: 'temp_second',
      });
      queueManager.enqueue('createHabit', {
        name: 'Third Habit',
        tempId: 'temp_third',
      });

      const operations = queueManager.getState().operations;
      expect(operations[0].payload).toMatchObject({ name: 'First Habit' });
      expect(operations[1].payload).toMatchObject({ name: 'Second Habit' });
      expect(operations[2].payload).toMatchObject({ name: 'Third Habit' });
    });
  });

  describe('Update Habit Offline', () => {
    const mockHabitId = 'habit_123' as Id<'habits'>;

    it('should queue habit update when offline', () => {
      const payload: UpdateHabitPayload = {
        habitId: mockHabitId,
        updates: {
          color: '#059669',
          name: 'Updated Habit Name',
          notes: 'New notes',
        },
      };

      const result = queueManager.enqueue('updateHabit', payload);

      expect(result.success).toBe(true);
      const state = queueManager.getState();
      expect(state.operations).toHaveLength(1);
      expect(state.operations[0].type).toBe('updateHabit');
      expect(state.operations[0].payload).toMatchObject(payload);
    });

    it('should coalesce multiple updates to same habit', () => {
      // First update
      queueManager.enqueue('updateHabit', {
        habitId: mockHabitId,
        updates: { name: 'First Update' },
      });

      // Second update (should replace first)
      queueManager.enqueue('updateHabit', {
        habitId: mockHabitId,
        updates: { name: 'Second Update', color: '#047857' },
      });

      const operations = queueManager.getState().operations;
      expect(operations).toHaveLength(1);
      expect(operations[0].payload).toMatchObject({
        habitId: mockHabitId,
        updates: { name: 'Second Update', color: '#047857' },
      });
    });
  });

  describe('Archive Habit Offline', () => {
    const mockHabitId = 'habit_archive' as Id<'habits'>;

    it('should queue archive operation when offline', () => {
      const result = queueManager.enqueue('archiveHabit', {
        habitId: mockHabitId,
      });

      expect(result.success).toBe(true);
      const operations = queueManager.getState().operations;
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('archiveHabit');
      expect(operations[0].payload).toMatchObject({ habitId: mockHabitId });
    });
  });

  describe('Pause Habit Offline', () => {
    const mockHabitId = 'habit_pause' as Id<'habits'>;

    it('should queue pause operation when offline', () => {
      const result = queueManager.enqueue('pauseHabit', {
        habitId: mockHabitId,
      });

      expect(result.success).toBe(true);
      const operations = queueManager.getState().operations;
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('pauseHabit');
    });
  });

  describe('Remove Habit Offline', () => {
    const mockHabitId = 'habit_remove' as Id<'habits'>;

    it('should queue remove operation when offline', () => {
      const result = queueManager.enqueue('removeHabit', {
        habitId: mockHabitId,
      });

      expect(result.success).toBe(true);
      const operations = queueManager.getState().operations;
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('removeHabit');
    });

    it('should prioritize remove over other operations for same habit', () => {
      const habitId = 'habit_xyz' as Id<'habits'>;

      // Queue an update
      queueManager.enqueue('updateHabit', {
        habitId,
        updates: { name: 'Updated' },
      });

      // Queue a removal (should replace update)
      queueManager.enqueue('removeHabit', { habitId });

      const operations = queueManager.getState().operations;
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('removeHabit');
    });
  });

  describe('Mixed Operations Offline', () => {
    it('should handle complex offline scenario: create → update → toggle', () => {
      const tempId = 'temp_complex_123';

      // Create habit offline
      queueManager.enqueue('createHabit', {
        name: 'New Habit',
        tempId,
      });

      // Update the habit (using temp ID)
      // Note: In production, we'd use optimistic store to track tempId → actualId mapping
      queueManager.enqueue('updateHabit', {
        habitId: tempId as unknown as Id<'habits'>,
        updates: { name: 'Updated Habit' },
      });

      // Toggle completion
      queueManager.enqueue('toggleCompletion', {
        date: '2026-02-15',
        habitId: tempId as unknown as Id<'habits'>,
        toCompleted: true,
      });

      const operations = queueManager.getState().operations;
      expect(operations).toHaveLength(3);
      expect(operations.map((op) => op.type)).toEqual([
        'createHabit',
        'updateHabit',
        'toggleCompletion',
      ]);
    });

    it('should maintain operation order for different habits', () => {
      const habit1 = 'habit_1' as Id<'habits'>;
      const habit2 = 'habit_2' as Id<'habits'>;

      queueManager.enqueue('updateHabit', {
        habitId: habit1,
        updates: { name: 'Habit 1 Update' },
      });

      queueManager.enqueue('archiveHabit', { habitId: habit2 });

      queueManager.enqueue('toggleCompletion', {
        date: '2026-02-15',
        habitId: habit1,
        toCompleted: true,
      });

      const operations = queueManager.getState().operations;
      expect(operations).toHaveLength(3);

      // Verify order preserved
      expect(operations[0].type).toBe('updateHabit');
      expect(operations[1].type).toBe('archiveHabit');
      expect(operations[2].type).toBe('toggleCompletion');
    });
  });

  describe('Queue Stats for New Operations', () => {
    it('should track pending count across all operation types', () => {
      queueManager.enqueue('createHabit', {
        name: 'Habit A',
        tempId: 'temp_a',
      });
      queueManager.enqueue('updateHabit', {
        habitId: 'habit_b' as Id<'habits'>,
        updates: { name: 'Updated B' },
      });
      queueManager.enqueue('archiveHabit', {
        habitId: 'habit_c' as Id<'habits'>,
      });

      const stats = queueManager.getStats();
      expect(stats.pendingCount).toBe(3);
      expect(stats.totalCount).toBe(3);
    });

    it('should update stats after operations complete', () => {
      const op1 = queueManager.enqueue('createHabit', {
        name: 'Habit 1',
        tempId: 'temp_1',
      });
      queueManager.enqueue('pauseHabit', {
        habitId: 'habit_2' as Id<'habits'>,
      });

      // Mark first operation as completed
      queueManager.removeOperation(op1.operationId!);

      const stats = queueManager.getStats();
      expect(stats.pendingCount).toBe(1);
      expect(stats.totalCount).toBe(1);
    });
  });
});
