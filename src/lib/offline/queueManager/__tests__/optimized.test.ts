/**
 * Performance Tests for Optimized Queue Operations
 *
 * Verifies FR-011: Handle queue sizes of at least 500 operations
 * without performance degradation.
 *
 * @see docs/offline-habit-sync.md FR-011
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import { createOfflineQueueManager, resetOfflineQueueManager } from '../index';
import type { OfflineQueueManagerAPI } from '../types';
import type { OfflineOperation } from '../../queue';
import {
  buildOperationIndex,
  findOperationIndexOptimized,
  hasDuplicateOptimized,
} from '../optimized';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockHabitId = (id: string) => id as Id<'habits'>;

describe('Optimized Queue Operations (FR-011)', () => {
  let manager: OfflineQueueManagerAPI;

  beforeEach(() => {
    jest.clearAllMocks();
    resetOfflineQueueManager();
    manager = createOfflineQueueManager({ autoPersist: false });
  });

  describe('buildOperationIndex', () => {
    it('builds index from operations array', () => {
      const ops: OfflineOperation[] = [
        createOp('op1', 'habit1', '2026-01-30'),
        createOp('op2', 'habit2', '2026-01-30'),
        createOp('op3', 'habit1', '2026-01-31'),
      ];

      const index = buildOperationIndex(ops);

      expect(index.byId.get('op1')).toBe(0);
      expect(index.byId.get('op2')).toBe(1);
      expect(index.byId.get('op3')).toBe(2);
      expect(index.byDedupeKey.get('toggle:habit1:2026-01-30')).toBe('op1');
      expect(index.byDedupeKey.get('toggle:habit2:2026-01-30')).toBe('op2');
    });

    it('handles empty array', () => {
      const index = buildOperationIndex([]);

      expect(index.byId.size).toBe(0);
      expect(index.byDedupeKey.size).toBe(0);
    });
  });

  describe('findOperationIndexOptimized', () => {
    it('finds operation index in O(1)', () => {
      const ops = createManyOps(1000);
      const index = buildOperationIndex(ops);

      const startTime = performance.now();
      const foundIdx = findOperationIndexOptimized(index, 'op_500');
      const endTime = performance.now();

      expect(foundIdx).toBe(500);
      expect(endTime - startTime).toBeLessThan(1); // O(1) lookup
    });

    it('returns -1 for non-existent operation', () => {
      const ops = createManyOps(100);
      const index = buildOperationIndex(ops);

      expect(findOperationIndexOptimized(index, 'non_existent')).toBe(-1);
    });
  });

  describe('hasDuplicateOptimized', () => {
    it('detects duplicate in O(1)', () => {
      const ops = createManyOps(1000);
      const index = buildOperationIndex(ops);

      const result = hasDuplicateOptimized(index, 'habit_500', '2026-01-30');

      expect(result.exists).toBe(true);
      expect(result.operationId).toBe('op_500');
    });

    it('returns false for non-existent', () => {
      const ops = createManyOps(100);
      const index = buildOperationIndex(ops);

      const result = hasDuplicateOptimized(index, 'non_existent', '2026-01-30');

      expect(result.exists).toBe(false);
      expect(result.operationId).toBeUndefined();
    });
  });

  describe('Batch Operations', () => {
    describe('markCompletedBatch', () => {
      it('marks multiple operations as completed in single update', () => {
        // Add 10 operations
        const ids: string[] = [];
        for (let i = 0; i < 10; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        expect(manager.getState().operations).toHaveLength(10);

        // Batch complete first 5
        const batchIds = ids.slice(0, 5);
        const result = manager.markCompletedBatch(batchIds);

        expect(result.succeeded).toHaveLength(5);
        expect(result.notFound).toHaveLength(0);
        expect(manager.getState().operations).toHaveLength(5);
      });

      it('reports not found operations', () => {
        manager.enqueue('toggleCompletion', {
          habitId: mockHabitId('h1'),
          date: '2026-01-30',
          toCompleted: true,
        });

        const result = manager.markCompletedBatch([
          'non_existent_1',
          'non_existent_2',
        ]);

        expect(result.succeeded).toHaveLength(0);
        expect(result.notFound).toContain('non_existent_1');
        expect(result.notFound).toContain('non_existent_2');
      });

      it('handles empty array', () => {
        const result = manager.markCompletedBatch([]);

        expect(result.succeeded).toHaveLength(0);
        expect(result.notFound).toHaveLength(0);
      });
    });

    describe('markFailedBatch', () => {
      it('marks multiple operations as failed in single update', () => {
        const ids: string[] = [];
        for (let i = 0; i < 5; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const result = manager.markFailedBatch(
          ids.slice(0, 3),
          'Network error',
          'network'
        );

        expect(result.succeeded).toHaveLength(3);

        const ops = manager.getState().operations;
        const failed = ops.filter((op) => op.status === 'failed');
        expect(failed).toHaveLength(3);
        expect(failed[0].lastError).toBe('Network error');
        expect(failed[0].lastErrorCategory).toBe('network');
        expect(failed[0].retryCount).toBe(1);
      });
    });

    describe('markSyncingBatch', () => {
      it('marks multiple operations as syncing in single update', () => {
        const ids: string[] = [];
        for (let i = 0; i < 5; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const result = manager.markSyncingBatch(ids.slice(0, 3));

        expect(result.succeeded).toHaveLength(3);

        const ops = manager.getState().operations;
        const syncing = ops.filter((op) => op.status === 'syncing');
        expect(syncing).toHaveLength(3);
        expect(syncing[0].lastAttemptAt).toBeDefined();
      });
    });

    describe('peekBatch', () => {
      it('returns multiple pending operations in FIFO order', () => {
        for (let i = 0; i < 10; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const batch = manager.peekBatch(5);

        expect(batch).toHaveLength(5);
        expect(batch[0].payload.habitId).toBe('h0');
        expect(batch[4].payload.habitId).toBe('h4');

        // Verify queue unchanged
        expect(manager.getState().operations).toHaveLength(10);
      });

      it('skips non-pending operations', () => {
        const ids: string[] = [];
        for (let i = 0; i < 5; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        // Mark first 2 as syncing
        manager.markSyncing(ids[0]);
        manager.markSyncing(ids[1]);

        const batch = manager.peekBatch(5);

        expect(batch).toHaveLength(3);
        expect(batch[0].payload.habitId).toBe('h2');
      });

      it('returns fewer than requested if not enough pending', () => {
        for (let i = 0; i < 3; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const batch = manager.peekBatch(10);

        expect(batch).toHaveLength(3);
      });
    });

    describe('removeBatch', () => {
      it('removes multiple operations in single update', () => {
        const ids: string[] = [];
        for (let i = 0; i < 10; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const result = manager.removeBatch(ids.slice(0, 5));

        expect(result.succeeded).toHaveLength(5);
        expect(manager.getState().operations).toHaveLength(5);
      });
    });
  });

  describe('Performance with 500+ operations', () => {
    it('enqueues 500 operations without degradation', () => {
      const startTime = performance.now();

      for (let i = 0; i < 500; i++) {
        manager.enqueue('toggleCompletion', {
          habitId: mockHabitId(`habit_${i}`),
          date: '2026-01-30',
          toCompleted: true,
        });
      }

      const endTime = performance.now();
      const avgTimePerOp = (endTime - startTime) / 500;

      expect(manager.getState().operations).toHaveLength(500);
      // Each enqueue should average under 2ms
      expect(avgTimePerOp).toBeLessThan(2);
    });

    it('batch completes 500 operations efficiently', () => {
      // Setup: Add 500 operations
      const ids: string[] = [];
      for (let i = 0; i < 500; i++) {
        const result = manager.enqueue('toggleCompletion', {
          habitId: mockHabitId(`habit_${i}`),
          date: '2026-01-30',
          toCompleted: true,
        });
        ids.push(result.operationId!);
      }

      // Measure batch completion
      const startTime = performance.now();
      const result = manager.markCompletedBatch(ids);
      const endTime = performance.now();

      expect(result.succeeded).toHaveLength(500);
      expect(manager.getState().operations).toHaveLength(0);
      // Batch operation should complete in under 50ms
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('peekBatch handles 500+ queue efficiently', () => {
      // Setup: Add 600 operations
      for (let i = 0; i < 600; i++) {
        manager.enqueue('toggleCompletion', {
          habitId: mockHabitId(`habit_${i}`),
          date: '2026-01-30',
          toCompleted: true,
        });
      }

      // Measure peekBatch
      const startTime = performance.now();
      const batch = manager.peekBatch(50);
      const endTime = performance.now();

      expect(batch).toHaveLength(50);
      // Should complete in under 5ms (early termination)
      expect(endTime - startTime).toBeLessThan(5);
    });

    it('getStats calculates efficiently with 500+ operations', () => {
      // Setup
      for (let i = 0; i < 500; i++) {
        const result = manager.enqueue('toggleCompletion', {
          habitId: mockHabitId(`habit_${i}`),
          date: '2026-01-30',
          toCompleted: true,
        });

        // Mix statuses
        if (i % 10 === 0) manager.markSyncing(result.operationId!);
        if (i % 15 === 0)
          manager.markFailed(result.operationId!, 'error', 'network');
      }

      const startTime = performance.now();
      const stats = manager.getStats();
      const endTime = performance.now();

      expect(stats.totalCount).toBe(500);
      // Stats calculation should be under 5ms
      expect(endTime - startTime).toBeLessThan(5);
    });

    it('maintains FIFO order with 500+ operations', () => {
      // Add 500 operations
      for (let i = 0; i < 500; i++) {
        manager.enqueue('toggleCompletion', {
          habitId: mockHabitId(`habit_${i}`),
          date: '2026-01-30',
          toCompleted: true,
        });
      }

      // Verify FIFO order
      const first = manager.peek();
      expect(first?.payload.habitId).toBe('habit_0');

      // Dequeue 50 and verify order
      for (let i = 0; i < 50; i++) {
        const op = manager.dequeue();
        expect(op?.payload.habitId).toBe(`habit_${i}`);
      }
    });

    it('handles concurrent-like batch operations', () => {
      // Simulate rapid enqueue/complete cycles
      for (let batch = 0; batch < 10; batch++) {
        const ids: string[] = [];

        // Enqueue 50 operations
        for (let i = 0; i < 50; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`b${batch}_h${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        // Complete all in batch
        manager.markCompletedBatch(ids);
      }

      // Queue should be empty after all cycles
      expect(manager.getState().operations).toHaveLength(0);
    });
  });

  describe('Index Build Performance', () => {
    it('builds index from 500 operations efficiently', () => {
      const ops = createManyOps(500);

      const startTime = performance.now();
      const index = buildOperationIndex(ops);
      const endTime = performance.now();

      expect(index.byId.size).toBe(500);
      // Index build should be under 10ms
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('builds index from 1000 operations', () => {
      const ops = createManyOps(1000);

      const startTime = performance.now();
      const index = buildOperationIndex(ops);
      const endTime = performance.now();

      expect(index.byId.size).toBe(1000);
      // Should scale linearly
      expect(endTime - startTime).toBeLessThan(20);
    });
  });
});

// Helper functions

function createOp(id: string, habitId: string, date: string): OfflineOperation {
  return {
    id,
    type: 'toggleCompletion',
    payload: {
      habitId: habitId as Id<'habits'>,
      date,
      toCompleted: true,
    },
    status: 'pending',
    createdAt: Date.now(),
    retryCount: 0,
  };
}

function createManyOps(count: number): OfflineOperation[] {
  return Array.from({ length: count }, (_, i) =>
    createOp(`op_${i}`, `habit_${i}`, '2026-01-30')
  );
}
