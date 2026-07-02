/**
 * Tests for optimistic update store
 */

import { optimisticStore } from '../store';
import type { Id } from '../../../../convex/_generated/dataModel';

// Helper to create mock habit ID
const mockHabitId = (id: string) => id as Id<'habits'>;

describe('OptimisticStore', () => {
  beforeEach(() => {
    optimisticStore.reset();
  });

  afterEach(() => {
    optimisticStore.reset();
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

      optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: false,
      });

      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(false);
    });

    it('should clear pending state on confirm', () => {
      jest.useFakeTimers();
      const habitId = mockHabitId('habit_789');
      const date = '2026-01-20';

      const operationId = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });

      optimisticStore.confirm(operationId);
      jest.advanceTimersByTime(300);

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

    it('should clear archive state on confirm', () => {
      jest.useFakeTimers();
      const habitId = mockHabitId('habit_confirm_archive');

      const operationId = optimisticStore.addArchive({
        habitId,
        habitName: 'Test',
        toArchived: true,
      });

      optimisticStore.confirm(operationId);
      jest.advanceTimersByTime(300);

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

    it('should clear reorder on confirm', () => {
      jest.useFakeTimers();
      const habitIds = [mockHabitId('habit_x'), mockHabitId('habit_y')];

      const operationId = optimisticStore.addReorder({
        habitIds,
        previousOrder: [mockHabitId('habit_y'), mockHabitId('habit_x')],
      });

      optimisticStore.confirm(operationId);
      jest.advanceTimersByTime(300);

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

      optimisticStore.addPause({
        habitId,
        toPaused: false,
      });

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

  describe('getPendingTogglesSnapshot (stable slice)', () => {
    it('keeps a stable reference across unrelated ops, new reference on toggle', () => {
      const before = optimisticStore.getPendingTogglesSnapshot();

      // An archive op does not touch pendingToggles → reference must be stable,
      // so `usePendingToggles` consumers don't re-render.
      const archiveOp = optimisticStore.addArchive({
        habitId: mockHabitId('slice_archive'),
        habitName: 'Test',
        toArchived: true,
      });
      expect(optimisticStore.getPendingTogglesSnapshot()).toBe(before);

      // A toggle op changes pendingToggles → reference must change.
      optimisticStore.addToggle({
        habitId: mockHabitId('slice_toggle'),
        date: '2026-01-22',
        toCompleted: true,
      });
      const afterToggle = optimisticStore.getPendingTogglesSnapshot();
      expect(afterToggle).not.toBe(before);
      expect(afterToggle.get('slice_toggle:2026-01-22')).toBe(true);

      optimisticStore.confirm(archiveOp);
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
});
