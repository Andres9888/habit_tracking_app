/**
 * Integration tests for optimistic updates
 *
 * These tests verify the end-to-end behavior of optimistic updates,
 * including proper UI feedback timing and rollback scenarios.
 */

import { optimisticStore } from '../../../src/lib/optimistic';
import type { Id } from '../../../convex/_generated/dataModel';

const mockHabitId = (id: string) => id as Id<'habits'>;

describe('Optimistic Updates Integration', () => {
  beforeEach(() => {
    optimisticStore.reset();
  });

  afterEach(() => {
    optimisticStore.reset();
    jest.useRealTimers();
  });

  describe('Toggle Completion Flow', () => {
    it('should provide immediate feedback before server confirms', async () => {
      const habitId = mockHabitId('toggle_feedback');
      const date = '2026-01-22';
      const timeline: string[] = [];

      // Simulate server mutation with delay
      const serverMutation = () =>
        new Promise<void>((resolve) => {
          timeline.push('server_start');
          setTimeout(() => {
            timeline.push('server_complete');
            resolve();
          }, 100);
        });

      // Apply optimistic update
      timeline.push('optimistic_applied');
      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      // Verify immediate state
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);
      timeline.push('state_checked');

      // Execute server mutation
      await serverMutation();

      // Confirm
      optimisticStore.confirm(operationId);
      timeline.push('confirmed');

      // Verify timeline order: optimistic state available BEFORE server completes
      expect(timeline).toEqual([
        'optimistic_applied',
        'state_checked',
        'server_start',
        'server_complete',
        'confirmed',
      ]);
    });

    it('should rollback on network failure', async () => {
      const habitId = mockHabitId('toggle_rollback');
      const date = '2026-01-22';

      // Apply optimistic update
      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      // Verify optimistic state applied
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);

      // Simulate server failure
      optimisticStore.fail(operationId, new Error('Network timeout'));

      // Verify rollback - state should be cleared
      expect(optimisticStore.getPendingToggle(habitId, date)).toBeUndefined();
    });

    it('should handle rapid toggling correctly', async () => {
      jest.useFakeTimers();
      const habitId = mockHabitId('rapid_toggle');
      const date = '2026-01-22';

      // Toggle on
      const op1 = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);

      // Immediately toggle off
      optimisticStore.confirm(op1);
      const op2 = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: false,
      });
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(false);

      // Confirm second toggle
      optimisticStore.confirm(op2);
      jest.advanceTimersByTime(300);
      expect(optimisticStore.getPendingToggle(habitId, date)).toBeUndefined();
    });

    it('should handle multiple habits simultaneously', async () => {
      const habits = [
        { id: mockHabitId('multi_1'), date: '2026-01-22', completed: true },
        { id: mockHabitId('multi_2'), date: '2026-01-22', completed: false },
        { id: mockHabitId('multi_3'), date: '2026-01-21', completed: true },
      ];

      const operations: string[] = [];

      // Add all toggles
      for (const habit of habits) {
        operations.push(
          optimisticStore.addToggle({
            habitId: habit.id,
            date: habit.date,
            toCompleted: habit.completed,
          })
        );
      }

      // Verify each has correct state
      expect(
        optimisticStore.getPendingToggle(habits[0].id, habits[0].date)
      ).toBe(true);
      expect(
        optimisticStore.getPendingToggle(habits[1].id, habits[1].date)
      ).toBe(false);
      expect(
        optimisticStore.getPendingToggle(habits[2].id, habits[2].date)
      ).toBe(true);

      // Confirm all
      for (const opId of operations) {
        optimisticStore.confirm(opId);
      }
    });
  });

  describe('Archive/Unarchive Flow', () => {
    it('should immediately hide archived habit from list', () => {
      const habitId = mockHabitId('archive_hide');

      const operationId = optimisticStore.addArchive({
        habitId,
        habitName: 'Test Habit',
        toArchived: true,
      });

      // Habit should appear as archived immediately
      expect(optimisticStore.getPendingArchive(habitId)).toBe(true);

      optimisticStore.confirm(operationId);
    });

    it('should restore habit on archive failure', () => {
      const habitId = mockHabitId('archive_restore');

      const operationId = optimisticStore.addArchive({
        habitId,
        habitName: 'Test Habit',
        toArchived: true,
      });

      expect(optimisticStore.getPendingArchive(habitId)).toBe(true);

      // Server fails
      optimisticStore.fail(operationId, new Error('Permission denied'));

      // Habit should no longer appear as pending archive
      expect(optimisticStore.getPendingArchive(habitId)).toBeUndefined();
    });

    it('should handle undo (unarchive) optimistically', () => {
      const habitId = mockHabitId('archive_undo');

      // First archive
      const archiveOp = optimisticStore.addArchive({
        habitId,
        habitName: 'Test',
        toArchived: true,
      });
      optimisticStore.confirm(archiveOp);

      // Then unarchive
      const unarchiveOp = optimisticStore.addArchive({
        habitId,
        habitName: 'Test',
        toArchived: false,
      });

      expect(optimisticStore.getPendingArchive(habitId)).toBe(false);
      optimisticStore.confirm(unarchiveOp);
    });
  });

  describe('Reorder Flow', () => {
    it('should apply new order immediately during drag', () => {
      jest.useFakeTimers();
      const originalOrder = [
        mockHabitId('drag_1'),
        mockHabitId('drag_2'),
        mockHabitId('drag_3'),
      ];
      const newOrder = [
        mockHabitId('drag_2'),
        mockHabitId('drag_3'),
        mockHabitId('drag_1'),
      ];

      const operationId = optimisticStore.addReorder({
        habitIds: newOrder,
        previousOrder: originalOrder,
      });

      // New order should be available immediately
      expect(optimisticStore.getPendingReorder()).toEqual(newOrder);

      optimisticStore.confirm(operationId);
      jest.advanceTimersByTime(300);
      expect(optimisticStore.getPendingReorder()).toBeNull();
    });

    it('should restore original order on failure', () => {
      const originalOrder = [mockHabitId('fail_1'), mockHabitId('fail_2')];
      const newOrder = [mockHabitId('fail_2'), mockHabitId('fail_1')];

      const operationId = optimisticStore.addReorder({
        habitIds: newOrder,
        previousOrder: originalOrder,
      });

      expect(optimisticStore.getPendingReorder()).toEqual(newOrder);

      // Server fails
      optimisticStore.fail(operationId, new Error('Conflict'));

      // Pending reorder should be cleared (UI reverts to server state)
      expect(optimisticStore.getPendingReorder()).toBeNull();
    });
  });

  describe('Operation State Machine', () => {
    it('should transition through pending -> confirmed states', () => {
      const operationId = optimisticStore.addToggle({
        habitId: mockHabitId('state_machine'),
        date: '2026-01-22',
        toCompleted: true,
      });

      const snapshot1 = optimisticStore.getSnapshot();
      const operation1 = snapshot1.operations.get(operationId);
      expect(operation1?.state).toBe('pending');

      optimisticStore.confirm(operationId);

      const snapshot2 = optimisticStore.getSnapshot();
      const operation2 = snapshot2.operations.get(operationId);
      expect(operation2?.state).toBe('confirmed');
    });

    it('should transition through pending -> failed states', () => {
      const operationId = optimisticStore.addToggle({
        habitId: mockHabitId('state_fail'),
        date: '2026-01-22',
        toCompleted: true,
      });

      optimisticStore.fail(operationId, new Error('Test error'));

      const snapshot = optimisticStore.getSnapshot();
      const operation = snapshot.operations.get(operationId);
      expect(operation?.state).toBe('failed');
      expect(operation?.error?.message).toBe('Test error');
    });

    it('should track operation timestamps', () => {
      const beforeStart = Date.now();

      const operationId = optimisticStore.addToggle({
        habitId: mockHabitId('timestamps'),
        date: '2026-01-22',
        toCompleted: true,
      });

      const afterStart = Date.now();

      const snapshot1 = optimisticStore.getSnapshot();
      const operation1 = snapshot1.operations.get(operationId);
      expect(operation1?.startedAt).toBeGreaterThanOrEqual(beforeStart);
      expect(operation1?.startedAt).toBeLessThanOrEqual(afterStart);
      expect(operation1?.completedAt).toBeUndefined();

      const beforeComplete = Date.now();
      optimisticStore.confirm(operationId);
      const afterComplete = Date.now();

      const snapshot2 = optimisticStore.getSnapshot();
      const operation2 = snapshot2.operations.get(operationId);
      expect(operation2?.completedAt).toBeGreaterThanOrEqual(beforeComplete);
      expect(operation2?.completedAt).toBeLessThanOrEqual(afterComplete);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent toggle and archive on same habit', () => {
      const habitId = mockHabitId('concurrent_ops');

      const toggleOp = optimisticStore.addToggle({
        habitId,
        date: '2026-01-22',
        toCompleted: true,
      });

      const archiveOp = optimisticStore.addArchive({
        habitId,
        habitName: 'Concurrent Test',
        toArchived: true,
      });

      // Both states should be trackable
      expect(optimisticStore.getPendingToggle(habitId, '2026-01-22')).toBe(
        true
      );
      expect(optimisticStore.getPendingArchive(habitId)).toBe(true);

      // Confirm both
      optimisticStore.confirm(toggleOp);
      optimisticStore.confirm(archiveOp);
    });

    it('should maintain correct count with parallel operations', () => {
      const initialCount = optimisticStore.getPendingCount();

      const op1 = optimisticStore.addToggle({
        habitId: mockHabitId('count_1'),
        date: '2026-01-22',
        toCompleted: true,
      });
      const op2 = optimisticStore.addToggle({
        habitId: mockHabitId('count_2'),
        date: '2026-01-22',
        toCompleted: true,
      });
      const op3 = optimisticStore.addArchive({
        habitId: mockHabitId('count_3'),
        habitName: 'Test',
        toArchived: true,
      });

      expect(optimisticStore.getPendingCount()).toBe(initialCount + 3);

      optimisticStore.confirm(op1);
      expect(optimisticStore.getPendingCount()).toBe(initialCount + 2);

      optimisticStore.fail(op2, new Error('Test'));
      expect(optimisticStore.getPendingCount()).toBe(initialCount + 1);

      optimisticStore.confirm(op3);
      expect(optimisticStore.getPendingCount()).toBe(initialCount);
    });
  });
});
