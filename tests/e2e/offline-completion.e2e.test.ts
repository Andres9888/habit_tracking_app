/**
 * E2E/Integration Tests for Offline Habit Completion
 *
 * Tests the complete offline completion flow from US1:
 * - Completing habits while offline with immediate feedback (<200ms)
 * - Queue persistence across app restarts
 * - Local streak calculation with pending operations
 * - Chain animation triggers for offline completions
 *
 * @see docs/offline-habit-sync.md US1 - Complete Habits While Offline
 */

import type { Id } from '../../convex/_generated/dataModel';
import { optimisticStore } from '../../src/lib/optimistic';
import {
  calculateOfflineStreak,
  mergeTrackingWithPending,
  type TrackingRecord,
} from '../../src/lib/offline/calculations';
import {
  createOfflineQueueManager,
  getOfflineQueueManager,
  resetOfflineQueueManager,
  type OfflineQueueManagerAPI,
} from '../../src/lib/offline/queueManager';

jest.mock('../../src/lib/offline/persistence/offlineStorage', () => ({
  offlineStorage: {
    getItem: jest.fn(),
    multiRemove: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockOfflineStorage = jest.requireMock(
  '../../src/lib/offline/persistence/offlineStorage'
).offlineStorage as {
  getItem: jest.Mock;
  multiRemove: jest.Mock;
  removeItem: jest.Mock;
  setItem: jest.Mock;
};

const mockHabitId = (id: string) => id as Id<'habits'>;

describe('Offline Completion E2E', () => {
  let queueManager: OfflineQueueManagerAPI;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOfflineStorage.getItem.mockReset().mockResolvedValue(null);
    mockOfflineStorage.multiRemove.mockReset().mockResolvedValue(undefined);
    mockOfflineStorage.removeItem.mockReset().mockResolvedValue(undefined);
    mockOfflineStorage.setItem.mockReset().mockResolvedValue(undefined);
    resetOfflineQueueManager();
    queueManager = createOfflineQueueManager({ autoPersist: false });

    // Clear optimistic store
    const snapshot = optimisticStore.getSnapshot();
    for (const op of snapshot.operations.values()) {
      if (op.state === 'pending') {
        optimisticStore.confirm(op.id);
      }
    }
  });

  describe('US1: Complete Habits While Offline', () => {
    describe('Acceptance Criteria 1: Immediate feedback (<200ms)', () => {
      it('should provide optimistic update within 200ms when offline', () => {
        const habitId = mockHabitId('offline_test_1');
        const date = '2026-01-30';
        const startTime = performance.now();

        // Simulate offline completion
        const operationId = optimisticStore.addToggle({
          date,
          habitId,
          toCompleted: true,
        });

        // Queue for offline sync
        queueManager.enqueue('toggleCompletion', {
          date,
          habitId,
          toCompleted: true,
        });

        const endTime = performance.now();

        // Verify immediate optimistic state
        expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);

        // Verify timing requirement (FR-002, SC-001)
        expect(endTime - startTime).toBeLessThan(200);

        // Cleanup
        optimisticStore.confirm(operationId);
      });

      it('should queue operation for later sync when offline', () => {
        const habitId = mockHabitId('queue_test_1');
        const date = '2026-01-30';

        const result = queueManager.enqueue('toggleCompletion', {
          date,
          habitId,
          toCompleted: true,
        });

        expect(result.success).toBe(true);
        expect(result.operationId).toBeDefined();

        const stats = queueManager.getStats();
        expect(stats.pendingCount).toBe(1);
        expect(stats.totalCount).toBe(1);
      });

      it('should replace duplicate operations for same habit+date', () => {
        const habitId = mockHabitId('dedup_test_1');
        const date = '2026-01-30';

        // First toggle (complete)
        queueManager.enqueue('toggleCompletion', {
          date,
          habitId,
          toCompleted: true,
        });

        // Second toggle (uncomplete) - should replace
        const result2 = queueManager.enqueue('toggleCompletion', {
          date,
          habitId,
          toCompleted: false,
        });

        expect(result2.replaced).toBe(true);
        expect(queueManager.getStats().totalCount).toBe(1);

        const state = queueManager.getState();
        expect(state.operations[0].payload.toCompleted).toBe(false);
      });
    });

    describe('Acceptance Criteria 2: Accurate streak display', () => {
      it('should calculate correct streak with pending offline operations', () => {
        const todayDate = '2026-01-30';

        // Server tracking: completed yesterday
        const serverTracking: TrackingRecord[] = [
          { completed: true, date: '2026-01-29' },
          { completed: true, date: '2026-01-28' },
        ];

        // Pending offline: completing today
        const pendingOperations = [
          { date: '2026-01-30', habitId: mockHabitId('h1'), toCompleted: true },
        ];

        const streakData = calculateOfflineStreak(
          serverTracking,
          pendingOperations,
          todayDate
        );

        // Streak should be 3 (28th + 29th + 30th pending)
        expect(streakData.currentStreak).toBe(3);
        expect(streakData.lastCompletedDate).toBe('2026-01-30');
      });

      it('should handle streak break with pending uncomplete operation', () => {
        const todayDate = '2026-01-30';

        // Server: 3-day streak ending today
        const serverTracking: TrackingRecord[] = [
          { completed: true, date: '2026-01-30' },
          { completed: true, date: '2026-01-29' },
          { completed: true, date: '2026-01-28' },
        ];

        // Pending: user uncompletes today
        const pendingOperations = [
          {
            date: '2026-01-30',
            habitId: mockHabitId('h1'),
            toCompleted: false,
          },
        ];

        const streakData = calculateOfflineStreak(
          serverTracking,
          pendingOperations,
          todayDate
        );

        // Streak should be 2 (28th + 29th), today is now uncompleted
        expect(streakData.currentStreak).toBe(2);
        expect(streakData.lastCompletedDate).toBe('2026-01-29');
      });

      it('should merge multiple pending operations correctly', () => {
        const todayDate = '2026-01-30';

        const serverTracking: TrackingRecord[] = [
          { completed: true, date: '2026-01-27' },
        ];

        // Multiple pending operations
        const pendingOperations = [
          { date: '2026-01-28', habitId: mockHabitId('h1'), toCompleted: true },
          { date: '2026-01-29', habitId: mockHabitId('h1'), toCompleted: true },
          { date: '2026-01-30', habitId: mockHabitId('h1'), toCompleted: true },
        ];

        const merged = mergeTrackingWithPending(
          serverTracking,
          pendingOperations
        );

        expect(merged).toHaveLength(4);
        expect(merged.filter((r) => r.completed)).toHaveLength(4);

        const streakData = calculateOfflineStreak(
          serverTracking,
          pendingOperations,
          todayDate
        );

        expect(streakData.currentStreak).toBe(4);
      });
    });

    describe('Acceptance Criteria 3: Persistence across app restarts', () => {
      it('should persist queue state to durable storage', async () => {
        const habitId = mockHabitId('persist_test_1');

        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId,
          toCompleted: true,
        });

        await queueManager.persist();

        expect(mockOfflineStorage.setItem).toHaveBeenCalled();
        const mainWrite = mockOfflineStorage.setItem.mock.calls.find(
          ([key]) => !String(key).endsWith('_pending')
        );
        expect(mainWrite).toBeDefined();
        const savedData = mainWrite?.[1];
        const parsed = JSON.parse(savedData);

        expect(parsed.operations).toHaveLength(1);
        expect(parsed.version).toBe(1);
      });

      it('should restore queue state from AsyncStorage', async () => {
        const savedState = {
          createdAt: Date.now(),
          operations: [
            {
              createdAt: Date.now(),
              id: 'op_restored_1',
              payload: {
                date: '2026-01-30',
                habitId: 'habit_123',
                toCompleted: true,
              },
              retryCount: 0,
              status: 'pending',
              type: 'toggleCompletion',
            },
          ],
          updatedAt: Date.now(),
          version: 1,
        };

        mockOfflineStorage.getItem.mockImplementation(async (key: string) =>
          key.endsWith('_pending') ? null : JSON.stringify(savedState)
        );

        await queueManager.restore();

        const stats = queueManager.getStats();
        expect(stats.totalCount).toBe(1);
        expect(stats.pendingCount).toBe(1);
      });

      it('should handle corrupted storage gracefully', async () => {
        mockOfflineStorage.getItem.mockImplementation(async (key: string) =>
          key.endsWith('_pending') ? null : 'not valid json {'
        );

        // Should not throw
        await expect(queueManager.restore()).resolves.not.toThrow();

        // Queue should be empty after failed restore
        expect(queueManager.getStats().totalCount).toBe(0);
      });
    });
  });

  describe('FIFO Queue Processing (FR-005)', () => {
    it('should process operations in chronological order', () => {
      const habits = [
        { date: '2026-01-30', habitId: mockHabitId('fifo_1') },
        { date: '2026-01-30', habitId: mockHabitId('fifo_2') },
        { date: '2026-01-30', habitId: mockHabitId('fifo_3') },
      ];

      // Enqueue in order
      habits.forEach((h) => {
        queueManager.enqueue('toggleCompletion', {
          ...h,
          toCompleted: true,
        });
      });

      // Dequeue should return in same order
      const first = queueManager.dequeue();
      expect(first?.payload.habitId).toBe('fifo_1');

      const second = queueManager.dequeue();
      expect(second?.payload.habitId).toBe('fifo_2');

      const third = queueManager.dequeue();
      expect(third?.payload.habitId).toBe('fifo_3');

      expect(queueManager.dequeue()).toBeUndefined();
    });

    it('should skip syncing operations when peeking', () => {
      // Enqueue two operations
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('peek_1'),
        toCompleted: true,
      });
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('peek_2'),
        toCompleted: true,
      });

      // Mark first as syncing
      const state = queueManager.getState();
      queueManager.markSyncing(state.operations[0].id);

      // Peek should return second operation
      const peeked = queueManager.peek();
      expect(peeked?.payload.habitId).toBe('peek_2');
    });
  });

  describe('Queue Stats & Health (FR-011)', () => {
    it('should track correct counts by status', () => {
      // Add operations
      const r1 = queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('stat_1'),
        toCompleted: true,
      });
      const r2 = queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('stat_2'),
        toCompleted: true,
      });
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('stat_3'),
        toCompleted: true,
      });

      // Change statuses
      queueManager.markSyncing(r1.operationId!);
      queueManager.markFailed(r2.operationId!, 'Network error');

      const stats = queueManager.getStats();
      expect(stats.totalCount).toBe(3);
      expect(stats.pendingCount).toBe(1);
      expect(stats.syncingCount).toBe(1);
      expect(stats.failedCount).toBe(1);
      expect(stats.isHealthy).toBe(false); // has failed operations
    });

    it('should handle 500+ operations without degradation (FR-011)', () => {
      const startTime = performance.now();

      // Enqueue 500 operations
      for (let i = 0; i < 500; i++) {
        queueManager.enqueue(
          'toggleCompletion',
          {
            date: '2026-01-30',
            habitId: mockHabitId(`perf_${i}`),
            toCompleted: true,
          },
          { allowDuplicate: true }
        );
      }

      const enqueueTime = performance.now() - startTime;

      // Get stats
      const statsStart = performance.now();
      const stats = queueManager.getStats();
      const statsTime = performance.now() - statsStart;

      expect(stats.totalCount).toBe(500);

      // Performance should be reasonable (< 1s for all operations)
      expect(enqueueTime).toBeLessThan(1000);
      expect(statsTime).toBeLessThan(100);
    });
  });

  describe('Event Emission (Queue Lifecycle)', () => {
    it('should emit events for queue operations', () => {
      const events: string[] = [];
      queueManager.subscribe((e) => events.push(e.type));

      // Enqueue
      const result = queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('event_1'),
        toCompleted: true,
      });

      expect(events).toContain('operation:added');

      // Mark syncing
      queueManager.markSyncing(result.operationId!);
      expect(events).toContain('operation:updated');

      // Mark completed
      queueManager.markCompleted(result.operationId!);
      expect(events).toContain('operation:synced');
    });

    it('should emit queue:restored on restore', async () => {
      const savedState = {
        createdAt: Date.now(),
        operations: [],
        updatedAt: Date.now(),
        version: 1,
      };

      mockOfflineStorage.getItem.mockImplementation(async (key: string) =>
        key.endsWith('_pending') ? null : JSON.stringify(savedState)
      );

      const events: string[] = [];
      queueManager.subscribe((e) => events.push(e.type));

      await queueManager.restore();

      expect(events).toContain('queue:restored');
    });
  });

  describe('Optimistic + Offline Integration', () => {
    it('should coordinate optimistic store and offline queue', async () => {
      const habitId = mockHabitId('integration_1');
      const date = '2026-01-30';
      const timeline: string[] = [];

      // Simulate offline completion flow
      timeline.push('start');

      // 1. Apply optimistic update (immediate UI)
      const optOpId = optimisticStore.addToggle({
        date,
        habitId,
        toCompleted: true,
      });
      timeline.push('optimistic_applied');

      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);
      timeline.push('optimistic_verified');

      // 2. Queue for offline sync
      const queueResult = queueManager.enqueue('toggleCompletion', {
        date,
        habitId,
        toCompleted: true,
      });
      timeline.push('queued');

      expect(queueResult.success).toBe(true);
      expect(queueManager.getStats().pendingCount).toBe(1);
      timeline.push('queue_verified');

      // Verify both systems have correct state
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);
      expect(queueManager.getState().operations[0].payload.toCompleted).toBe(
        true
      );

      // Verify timeline order (all immediate, no async waits)
      expect(timeline).toEqual([
        'start',
        'optimistic_applied',
        'optimistic_verified',
        'queued',
        'queue_verified',
      ]);

      // Cleanup
      optimisticStore.confirm(optOpId);
    });

    it('should handle rapid toggle sequence correctly', () => {
      const habitId = mockHabitId('rapid_1');
      const date = '2026-01-30';

      // Toggle ON
      const opt1 = optimisticStore.addToggle({
        date,
        habitId,
        toCompleted: true,
      });
      queueManager.enqueue('toggleCompletion', {
        date,
        habitId,
        toCompleted: true,
      });

      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);

      // Toggle OFF immediately (rapid toggle)
      optimisticStore.confirm(opt1);
      const opt2 = optimisticStore.addToggle({
        date,
        habitId,
        toCompleted: false,
      });
      queueManager.enqueue('toggleCompletion', {
        date,
        habitId,
        toCompleted: false,
      });

      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(false);

      // Queue should have only latest state (deduplication)
      expect(queueManager.getStats().totalCount).toBe(1);
      expect(queueManager.getState().operations[0].payload.toCompleted).toBe(
        false
      );

      optimisticStore.confirm(opt2);
    });

    it('should handle multiple habits simultaneously', () => {
      const habits = [
        { habitId: mockHabitId('multi_1'), completed: true },
        { habitId: mockHabitId('multi_2'), completed: false },
        { habitId: mockHabitId('multi_3'), completed: true },
      ];
      const date = '2026-01-30';
      const optIds: string[] = [];

      // Complete multiple habits at once
      for (const h of habits) {
        const optId = optimisticStore.addToggle({
          date,
          habitId: h.habitId,
          toCompleted: h.completed,
        });
        optIds.push(optId);

        queueManager.enqueue('toggleCompletion', {
          date,
          habitId: h.habitId,
          toCompleted: h.completed,
        });
      }

      // Verify all optimistic states
      expect(
        optimisticStore.getPendingToggle(mockHabitId('multi_1'), date)
      ).toBe(true);
      expect(
        optimisticStore.getPendingToggle(mockHabitId('multi_2'), date)
      ).toBe(false);
      expect(
        optimisticStore.getPendingToggle(mockHabitId('multi_3'), date)
      ).toBe(true);

      // Verify queue has all operations
      expect(queueManager.getStats().totalCount).toBe(3);

      // Cleanup
      optIds.forEach((id) => optimisticStore.confirm(id));
    });
  });

  describe('Edge Cases', () => {
    it('should handle completing same habit across multiple dates', () => {
      const habitId = mockHabitId('multi_date_1');
      const dates = ['2026-01-28', '2026-01-29', '2026-01-30'];

      dates.forEach((date) => {
        optimisticStore.addToggle({
          date,
          habitId,
          toCompleted: true,
        });
        queueManager.enqueue('toggleCompletion', {
          date,
          habitId,
          toCompleted: true,
        });
      });

      // Each date should be tracked separately
      expect(queueManager.getStats().totalCount).toBe(3);

      // Verify each date in optimistic store
      dates.forEach((date) => {
        expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);
      });
    });

    it('should handle queue clear operation', () => {
      // Add several operations
      for (let i = 0; i < 5; i++) {
        queueManager.enqueue('toggleCompletion', {
          date: '2026-01-30',
          habitId: mockHabitId(`clear_${i}`),
          toCompleted: true,
        });
      }

      expect(queueManager.getStats().totalCount).toBe(5);

      queueManager.clear();

      expect(queueManager.getStats().totalCount).toBe(0);
      expect(queueManager.peek()).toBeUndefined();
    });

    it('should track oldest pending operation correctly', () => {
      const beforeEnqueue = Date.now();

      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('oldest_1'),
        toCompleted: true,
      });

      // Add delay then second operation
      queueManager.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('oldest_2'),
        toCompleted: true,
      });

      const stats = queueManager.getStats();

      expect(stats.oldestPendingAt).toBeDefined();
      expect(stats.oldestPendingAt).toBeGreaterThanOrEqual(beforeEnqueue);
    });
  });

  describe('Singleton Management', () => {
    it('should maintain singleton instance', () => {
      const instance1 = getOfflineQueueManager();
      const instance2 = getOfflineQueueManager();

      expect(instance1).toBe(instance2);
    });

    it('should create fresh instance after reset', () => {
      const instance1 = getOfflineQueueManager();
      instance1.enqueue('toggleCompletion', {
        date: '2026-01-30',
        habitId: mockHabitId('singleton_1'),
        toCompleted: true,
      });

      resetOfflineQueueManager();

      const instance2 = getOfflineQueueManager();
      expect(instance2.getStats().totalCount).toBe(0);
    });
  });
});
