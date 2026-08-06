/**
 * useOfflineHabitState Hook Tests
 *
 * Tests for the hook that merges server state with offline queue operations
 * to provide accurate habit completion and streak data.
 *
 * @see docs/offline-habit-sync.md T013
 */

import { renderHook } from '@testing-library/react-native';
import { useOfflineHabitState } from '../useOfflineHabitState';
import {
  createOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../../../lib/offline/queueManager';
import type { Id } from '../../../../../convex/_generated/dataModel';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the useOfflineQueue hook to use test manager
jest.mock('../../../../lib/offline/hooks/useOfflineQueue', () => {
  const actual = jest.requireActual(
    '../../../../lib/offline/hooks/useOfflineQueue'
  );
  return {
    ...actual,
    useOfflineQueue: (opts?: { manager?: unknown }) =>
      actual.useOfflineQueue({
        manager:
          opts?.manager ??
          require('../../../../lib/offline/queueManager').getOfflineQueueManager(),
      }),
  };
});

describe('useOfflineHabitState', () => {
  const habitId = 'test-habit-1' as Id<'habits'>;
  const todayDate = '2026-01-30';

  beforeEach(() => {
    jest.clearAllMocks();
    resetOfflineQueueManager();
  });

  describe('initial state without pending operations', () => {
    it('returns server completion status when no pending operations', () => {
      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverCompleted: true,
          todayDate,
        })
      );

      expect(result.current.completed).toBe(true);
    });

    it('returns server streak data when no pending operations', () => {
      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverStreak: {
            bestStreak: 10,
            currentStreak: 5,
            lastCompletedDate: '2026-01-29',
          },
          todayDate,
        })
      );

      expect(result.current.currentStreak).toBe(5);
      expect(result.current.bestStreak).toBe(10);
    });

    it('reports hasPendingOperations as false', () => {
      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          todayDate,
        })
      );

      expect(result.current.hasPendingOperations).toBe(false);
      expect(result.current.pendingCount).toBe(0);
    });
  });

  describe('with pending toggle operations', () => {
    it('returns pending completion status for today over server state', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // Queue a completion toggle
      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: true,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverCompleted: false, // Server says not completed
          todayDate,
        })
      );

      // Should use pending operation's value
      expect(result.current.completed).toBe(true);
    });

    it('returns pending uncomplete status over server completed', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // Queue an uncomplete toggle
      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: false,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverCompleted: true, // Server says completed
          todayDate,
        })
      );

      // Should use pending operation's value
      expect(result.current.completed).toBe(false);
    });

    it('reports hasPendingOperations as true', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: true,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          todayDate,
        })
      );

      expect(result.current.hasPendingOperations).toBe(true);
      expect(result.current.pendingCount).toBe(1);
    });

    it('ignores operations for different habits', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId: 'different-habit' as Id<'habits'>,
        toCompleted: true,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverCompleted: false,
          todayDate,
        })
      );

      expect(result.current.completed).toBe(false);
      expect(result.current.hasPendingOperations).toBe(false);
    });

    it('ignores completed (synced) operations', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // Queue and then mark as completed (synced)
      const { operationId } = manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: true,
      });
      manager.markCompleted(operationId!);

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverCompleted: false,
          todayDate,
        })
      );

      // Operation was synced, should use server state
      expect(result.current.hasPendingOperations).toBe(false);
    });
  });

  describe('streak calculation with pending operations', () => {
    it('calculates streak including pending completion', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // Server tracking shows yesterday completed
      const serverTracking = [{ completed: true, date: '2026-01-29' }];

      // Queue today's completion
      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: true,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverTracking,
          todayDate,
        })
      );

      // Should have 2-day streak (yesterday + today)
      expect(result.current.currentStreak).toBe(2);
    });

    it('calculates streak when breaking with pending uncomplete', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // Server shows today completed (2-day streak)
      const serverTracking = [
        { completed: true, date: '2026-01-29' },
        { completed: true, date: todayDate },
      ];

      // Queue uncomplete for today
      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: false,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverStreak: {
            bestStreak: 2,
            currentStreak: 2,
            lastCompletedDate: todayDate,
          },
          serverTracking,
          todayDate,
        })
      );

      // Streak should be 0 (today uncompleted, breaking the streak)
      expect(result.current.currentStreak).toBe(0);
    });

    it('preserves best streak from server when lower', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: true,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverStreak: {
            bestStreak: 30,
            currentStreak: 1,
            lastCompletedDate: '2026-01-29',
          },
          serverTracking: [{ completed: true, date: '2026-01-29' }],
          todayDate,
        })
      );

      // Best streak should be max of calculated and server
      expect(result.current.bestStreak).toBeGreaterThanOrEqual(30);
    });
  });

  describe('multiple operations handling', () => {
    it('uses latest pending operation for same date', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // First toggle to complete
      manager.enqueue(
        'toggleCompletion',
        { date: todayDate, habitId, toCompleted: true },
        { allowDuplicate: true }
      );

      // Second toggle to uncomplete (user changed mind)
      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: false,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          serverCompleted: false,
          todayDate,
        })
      );

      // Should use the latest (uncomplete)
      expect(result.current.completed).toBe(false);
    });

    it('counts all pending operations for this habit', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // Queue operations for multiple dates
      manager.enqueue('toggleCompletion', {
        date: todayDate,
        habitId,
        toCompleted: true,
      });
      manager.enqueue('toggleCompletion', {
        date: '2026-01-29',
        habitId,
        toCompleted: true,
      });

      const { result } = renderHook(() =>
        useOfflineHabitState({
          habitId,
          todayDate,
        })
      );

      expect(result.current.pendingCount).toBe(2);
    });
  });
});
