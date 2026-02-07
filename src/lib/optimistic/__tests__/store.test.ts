/**
 * Tests for optimistic update store
 */

import { optimisticStore } from '../store';
import type { Id } from '../../../../convex/_generated/dataModel';

const mockHabitId = (id: string) => id as Id<'habits'>;

describe('OptimisticStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const snapshot = optimisticStore.getSnapshot();
    for (const op of snapshot.operations.values()) {
      if (op.state === 'pending') {
        optimisticStore.confirm(op.id);
      }
    }
    jest.runAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Toggle operations', () => {
    it('should add a toggle operation and update pending state', () => {
      const habitId = mockHabitId('habit_123');
      const date = '2026-01-22';

      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      expect(operationId).toMatch(/^op_/);
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);
    });

    it('should track toggle to uncompleted state', () => {
      const habitId = mockHabitId('habit_456');
      const date = '2026-01-21';

      optimisticStore.addToggle({ habitId, date, toCompleted: false });

      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(false);
    });

    it('should keep pending state immediately after confirm', () => {
      const habitId = mockHabitId('habit_789');
      const date = '2026-01-20';

      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      optimisticStore.confirm(operationId);

      // Pending state persists until Convex subscription syncs (1000ms)
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);
    });

    it('should clear pending state after confirm timeout', () => {
      const habitId = mockHabitId('habit_clear');
      const date = '2026-01-20';

      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      optimisticStore.confirm(operationId);
      jest.advanceTimersByTime(1100);

      expect(optimisticStore.getPendingToggle(habitId, date)).toBeUndefined();
    });

    it('should clear pending state on failure (rollback)', () => {
      const habitId = mockHabitId('habit_abc');
      const date = '2026-01-19';

      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      optimisticStore.fail(operationId, new Error('Network error'));

      expect(optimisticStore.getPendingToggle(habitId, date)).toBeUndefined();
    });

    it('should handle multiple toggle operations for different habits', () => {
      const habit1 = mockHabitId('habit_1');
      const habit2 = mockHabitId('habit_2');
      const date = '2026-01-22';

      optimisticStore.addToggle({ habitId: habit1, date, toCompleted: true });
      optimisticStore.addToggle({ habitId: habit2, date, toCompleted: false });

      expect(optimisticStore.getPendingToggle(habit1, date)).toBe(true);
      expect(optimisticStore.getPendingToggle(habit2, date)).toBe(false);
    });
  });

  describe('Archive operations', () => {
    it('should add an archive operation', () => {
      const habitId = mockHabitId('habit_to_archive');

      const operationId = optimisticStore.addArchive({
        habitId,
        habitName: 'My Habit',
        toArchived: true,
      });

      expect(operationId).toMatch(/^op_/);
      expect(optimisticStore.getPendingArchive(habitId)).toBe(true);
    });

    it('should handle unarchive operations', () => {
      const habitId = mockHabitId('habit_to_unarchive');

      optimisticStore.addArchive({
        habitId,
        habitName: 'Archived Habit',
        toArchived: false,
      });

      expect(optimisticStore.getPendingArchive(habitId)).toBe(false);
    });

    it('should clear archive state after confirm timeout', () => {
      const habitId = mockHabitId('habit_confirm_archive');

      const operationId = optimisticStore.addArchive({
        habitId,
        habitName: 'Test',
        toArchived: true,
      });

      optimisticStore.confirm(operationId);
      jest.advanceTimersByTime(1100);

      expect(optimisticStore.getPendingArchive(habitId)).toBeUndefined();
    });
  });

  describe('Reorder operations', () => {
    it('should add a reorder operation', () => {
      const habitIds = [
        mockHabitId('habit_a'),
        mockHabitId('habit_b'),
        mockHabitId('habit_c'),
      ];
      const previousOrder = [
        mockHabitId('habit_b'),
        mockHabitId('habit_a'),
        mockHabitId('habit_c'),
      ];

      const operationId = optimisticStore.addReorder({
        habitIds,
        previousOrder,
      });

      expect(operationId).toMatch(/^op_/);
      expect(optimisticStore.getPendingReorder()).toEqual(habitIds);
    });

    it('should clear reorder after confirm timeout', () => {
      const habitIds = [mockHabitId('habit_x'), mockHabitId('habit_y')];

      const operationId = optimisticStore.addReorder({
        habitIds,
        previousOrder: [mockHabitId('habit_y'), mockHabitId('habit_x')],
      });

      optimisticStore.confirm(operationId);
      jest.advanceTimersByTime(1100);

      expect(optimisticStore.getPendingReorder()).toBeNull();
    });
  });

  describe('Pause operations', () => {
    it('should add a pause operation', () => {
      const habitId = mockHabitId('habit_to_pause');

      const operationId = optimisticStore.addPause({
        habitId,
        toPaused: true,
      });

      expect(operationId).toMatch(/^op_/);
      expect(optimisticStore.getPendingPause(habitId)).toBe(true);
    });

    it('should handle resume operations', () => {
      const habitId = mockHabitId('habit_to_resume');

      optimisticStore.addPause({ habitId, toPaused: false });

      expect(optimisticStore.getPendingPause(habitId)).toBe(false);
    });
  });

  describe('Operation counting', () => {
    it('should correctly count pending operations', () => {
      const initialCount = optimisticStore.getPendingCount();

      optimisticStore.addToggle({
        habitId: mockHabitId('count_test_1'),
        date: '2026-01-22',
        toCompleted: true,
      });

      expect(optimisticStore.getPendingCount()).toBe(initialCount + 1);
      expect(optimisticStore.hasPendingOperations()).toBe(true);
    });

    it('should decrement count after confirm', () => {
      const operationId = optimisticStore.addToggle({
        habitId: mockHabitId('count_test_2'),
        date: '2026-01-22',
        toCompleted: true,
      });

      const countBefore = optimisticStore.getPendingCount();
      optimisticStore.confirm(operationId);
      const countAfter = optimisticStore.getPendingCount();

      expect(countAfter).toBe(countBefore - 1);
    });
  });

  describe('Subscription', () => {
    it('should notify listeners on state changes', () => {
      const listener = jest.fn();
      const unsubscribe = optimisticStore.subscribe(listener);

      optimisticStore.addToggle({
        habitId: mockHabitId('subscription_test'),
        date: '2026-01-22',
        toCompleted: true,
      });

      expect(listener).toHaveBeenCalled();
      unsubscribe();
    });

    it('should not notify after unsubscribe', () => {
      const listener = jest.fn();
      const unsubscribe = optimisticStore.subscribe(listener);
      unsubscribe();
      listener.mockClear();

      optimisticStore.addToggle({
        habitId: mockHabitId('unsubscribed_test'),
        date: '2026-01-22',
        toCompleted: true,
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Operation ID uniqueness', () => {
    it('should generate unique operation IDs', () => {
      const ids = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const operationId = optimisticStore.addToggle({
          habitId: mockHabitId(`unique_test_${i}`),
          date: '2026-01-22',
          toCompleted: true,
        });
        ids.add(operationId);
      }

      expect(ids.size).toBe(100);
    });
  });

  describe('Timeout management', () => {
    it('should cancel confirm timeouts when fail is called', () => {
      const habitId = mockHabitId('cancel_test');
      const date = '2026-01-22';
      const listener = jest.fn();
      const unsubscribe = optimisticStore.subscribe(listener);

      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      optimisticStore.confirm(operationId);
      listener.mockClear();

      // Fail before confirm timeouts fire — cancels the confirm timeouts
      optimisticStore.fail(operationId, new Error('Late failure'));
      jest.advanceTimersByTime(1100);

      // Pending state was cleared by fail(), not by confirm's timeout
      expect(optimisticStore.getPendingToggle(habitId, date)).toBeUndefined();
      unsubscribe();
    });

    it('should remove operation record after confirm timeout', () => {
      const operationId = optimisticStore.addToggle({
        habitId: mockHabitId('cleanup_test'),
        date: '2026-01-22',
        toCompleted: true,
      });

      optimisticStore.confirm(operationId);

      // Before 1100ms: operation still in map
      jest.advanceTimersByTime(500);
      expect(
        optimisticStore.getSnapshot().operations.has(operationId)
      ).toBe(true);

      // After 1100ms: operation removed
      jest.advanceTimersByTime(700);
      expect(
        optimisticStore.getSnapshot().operations.has(operationId)
      ).toBe(false);
    });

    it('should remove operation record after fail timeout', () => {
      const operationId = optimisticStore.addToggle({
        habitId: mockHabitId('fail_cleanup_test'),
        date: '2026-01-22',
        toCompleted: true,
      });

      optimisticStore.fail(operationId, new Error('Server error'));

      // Before 5000ms: operation still in map
      jest.advanceTimersByTime(3000);
      expect(
        optimisticStore.getSnapshot().operations.has(operationId)
      ).toBe(true);

      // After 5000ms: operation removed
      jest.advanceTimersByTime(2500);
      expect(
        optimisticStore.getSnapshot().operations.has(operationId)
      ).toBe(false);
    });

    it('should handle duplicate confirm calls gracefully', () => {
      const habitId = mockHabitId('dup_confirm');
      const date = '2026-01-22';

      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      optimisticStore.confirm(operationId);
      // Second confirm should cancel first timeouts and set new ones
      optimisticStore.confirm(operationId);

      jest.advanceTimersByTime(1100);
      expect(optimisticStore.getPendingToggle(habitId, date)).toBeUndefined();
    });
  });
});
