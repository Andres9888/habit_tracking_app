/**
 * Performance Benchmark Tests
 *
 * Comprehensive performance benchmarks for the offline sync module.
 * Validates requirements:
 * - FR-011: Handle queue sizes of at least 500 operations without performance degradation
 * - SC-001: Habit completion with feedback in under 200ms regardless of connectivity
 * - SC-006: App launch time increase ≤100ms when loading offline queue
 *
 * @see docs/offline-habit-sync.md
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import {
  buildOperationIndex,
  createOfflineQueueManager,
  resetOfflineQueueManager,
  type OfflineQueueManagerAPI,
} from '../queueManager';
import type { OfflineOperation, OfflineQueueState } from '../queue';
import { DEFAULT_QUEUE_STATE } from '../queue';
import {
  calculateOfflineStreak,
  calculateStreakFromHistory,
  mergeTrackingWithPending,
} from '../calculations';
import type { PendingToggleOperation, TrackingRecord } from '../calculations';

// Mock AsyncStorage with configurable latency
const mockStorage = new Map<string, string>();
let mockLatencyMs = 0;

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key: string) => {
    if (mockLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, mockLatencyMs));
    }
    return mockStorage.get(key) ?? null;
  }),
  setItem: jest.fn(async (key: string, value: string) => {
    if (mockLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, mockLatencyMs));
    }
    mockStorage.set(key, value);
  }),
  removeItem: jest.fn(async (key: string) => {
    if (mockLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, mockLatencyMs));
    }
    mockStorage.delete(key);
  }),
}));

// Helper to create test operations
const mockHabitId = (id: string) => id as Id<'habits'>;

function createOperation(
  id: string,
  habitId: string,
  date: string
): OfflineOperation {
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

function createManyOperations(count: number): OfflineOperation[] {
  return Array.from({ length: count }, (_, i) =>
    createOperation(`op_${i}`, `habit_${i}`, '2026-01-30')
  );
}

function createTrackingRecords(
  count: number,
  startDate: string
): TrackingRecord[] {
  const records: TrackingRecord[] = [];
  const date = new Date(startDate);

  for (let i = 0; i < count; i++) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    records.push({
      date: `${year}-${month}-${day}`,
      completed: Math.random() > 0.3, // 70% completion rate
    });
    date.setDate(date.getDate() - 1);
  }

  return records;
}

function createPendingOperations(count: number): PendingToggleOperation[] {
  const operations: PendingToggleOperation[] = [];
  const date = new Date('2026-01-30');

  for (let i = 0; i < count; i++) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    operations.push({
      date: `${year}-${month}-${day}`,
      toCompleted: Math.random() > 0.5,
    });
    date.setDate(date.getDate() - 1);
  }

  return operations;
}

describe('Performance Benchmarks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.clear();
    mockLatencyMs = 0;
    resetOfflineQueueManager();
  });

  describe('Queue Manager Operations (FR-011)', () => {
    let manager: OfflineQueueManagerAPI;

    beforeEach(() => {
      manager = createOfflineQueueManager({ autoPersist: false });
    });

    describe('enqueue performance', () => {
      it('enqueues 100 operations in under 50ms', () => {
        const startTime = performance.now();

        for (let i = 0; i < 100; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const duration = performance.now() - startTime;
        expect(manager.getState().operations).toHaveLength(100);
        expect(duration).toBeLessThan(50);
      });

      it('enqueues 500 operations in under 200ms', () => {
        const startTime = performance.now();

        for (let i = 0; i < 500; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const duration = performance.now() - startTime;
        expect(manager.getState().operations).toHaveLength(500);
        expect(duration).toBeLessThan(200);
      });

      it('enqueues 1000 operations in under 500ms', () => {
        const startTime = performance.now();

        for (let i = 0; i < 1000; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const duration = performance.now() - startTime;
        expect(manager.getState().operations).toHaveLength(1000);
        expect(duration).toBeLessThan(500);
      });

      it('average enqueue time stays under 2ms per operation', () => {
        const iterations = 500;
        const startTime = performance.now();

        for (let i = 0; i < iterations; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const avgTime = (performance.now() - startTime) / iterations;
        expect(avgTime).toBeLessThan(2);
      });
    });

    describe('batch operations performance', () => {
      it('markCompletedBatch processes 500 operations in under 50ms', () => {
        const ids: string[] = [];
        for (let i = 0; i < 500; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const startTime = performance.now();
        const result = manager.markCompletedBatch(ids);
        const duration = performance.now() - startTime;

        expect(result.succeeded).toHaveLength(500);
        expect(duration).toBeLessThan(50);
      });

      it('markFailedBatch processes 500 operations in under 50ms', () => {
        const ids: string[] = [];
        for (let i = 0; i < 500; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const startTime = performance.now();
        const result = manager.markFailedBatch(ids, 'Test error', 'network');
        const duration = performance.now() - startTime;

        expect(result.succeeded).toHaveLength(500);
        expect(duration).toBeLessThan(50);
      });

      it('markSyncingBatch processes 500 operations in under 50ms', () => {
        const ids: string[] = [];
        for (let i = 0; i < 500; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const startTime = performance.now();
        const result = manager.markSyncingBatch(ids);
        const duration = performance.now() - startTime;

        expect(result.succeeded).toHaveLength(500);
        expect(duration).toBeLessThan(50);
      });

      it('removeBatch processes 500 operations in under 50ms', () => {
        const ids: string[] = [];
        for (let i = 0; i < 500; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const startTime = performance.now();
        const result = manager.removeBatch(ids);
        const duration = performance.now() - startTime;

        expect(result.succeeded).toHaveLength(500);
        expect(duration).toBeLessThan(50);
      });

      it('peekBatch retrieves 50 from 500+ queue in under 5ms', () => {
        for (let i = 0; i < 600; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const startTime = performance.now();
        const batch = manager.peekBatch(50);
        const duration = performance.now() - startTime;

        expect(batch).toHaveLength(50);
        expect(duration).toBeLessThan(5);
      });
    });

    describe('getStats performance', () => {
      it('calculates stats for 500 operations in under 5ms', () => {
        for (let i = 0; i < 500; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });

          // Create varied statuses
          if (i % 10 === 0) manager.markSyncing(result.operationId!);
          if (i % 15 === 0)
            manager.markFailed(result.operationId!, 'error', 'network');
        }

        const startTime = performance.now();
        const stats = manager.getStats();
        const duration = performance.now() - startTime;

        expect(stats.totalCount).toBe(500);
        expect(duration).toBeLessThan(5);
      });

      it('calculates stats for 1000 operations in under 10ms', () => {
        for (let i = 0; i < 1000; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        const startTime = performance.now();
        const stats = manager.getStats();
        const duration = performance.now() - startTime;

        expect(stats.totalCount).toBe(1000);
        expect(duration).toBeLessThan(10);
      });
    });

    describe('index building performance', () => {
      it('builds index from 500 operations in under 10ms', () => {
        const ops = createManyOperations(500);

        const startTime = performance.now();
        const index = buildOperationIndex(ops);
        const duration = performance.now() - startTime;

        expect(index.byId.size).toBe(500);
        expect(duration).toBeLessThan(10);
      });

      it('builds index from 1000 operations in under 20ms', () => {
        const ops = createManyOperations(1000);

        const startTime = performance.now();
        const index = buildOperationIndex(ops);
        const duration = performance.now() - startTime;

        expect(index.byId.size).toBe(1000);
        expect(duration).toBeLessThan(20);
      });

      it('builds index from 5000 operations in under 100ms', () => {
        const ops = createManyOperations(5000);

        const startTime = performance.now();
        const index = buildOperationIndex(ops);
        const duration = performance.now() - startTime;

        expect(index.byId.size).toBe(5000);
        expect(duration).toBeLessThan(100);
      });
    });
  });

  describe('Streak Calculation Performance (SC-001)', () => {
    const todayDate = '2026-01-30';

    describe('mergeTrackingWithPending', () => {
      it('merges 100 server records with 50 pending ops in under 5ms', () => {
        const serverTracking = createTrackingRecords(100, todayDate);
        const pendingOps = createPendingOperations(50);

        const startTime = performance.now();
        const result = mergeTrackingWithPending(serverTracking, pendingOps);
        const duration = performance.now() - startTime;

        expect(result.length).toBeGreaterThan(0);
        expect(duration).toBeLessThan(5);
      });

      it('merges 365 server records with 100 pending ops in under 10ms', () => {
        const serverTracking = createTrackingRecords(365, todayDate);
        const pendingOps = createPendingOperations(100);

        const startTime = performance.now();
        const result = mergeTrackingWithPending(serverTracking, pendingOps);
        const duration = performance.now() - startTime;

        expect(result.length).toBeGreaterThan(0);
        expect(duration).toBeLessThan(10);
      });

      it('merges 1000 server records with 500 pending ops in under 50ms', () => {
        const serverTracking = createTrackingRecords(1000, todayDate);
        const pendingOps = createPendingOperations(500);

        const startTime = performance.now();
        const result = mergeTrackingWithPending(serverTracking, pendingOps);
        const duration = performance.now() - startTime;

        expect(result.length).toBeGreaterThan(0);
        expect(duration).toBeLessThan(50);
      });
    });

    describe('calculateStreakFromHistory', () => {
      it('calculates streak from 100 records in under 20ms', () => {
        const tracking = createTrackingRecords(100, todayDate);

        const startTime = performance.now();
        const result = calculateStreakFromHistory(tracking, todayDate);
        const duration = performance.now() - startTime;

        expect(typeof result.currentStreak).toBe('number');
        // Allow generous threshold for first-run JIT overhead
        expect(duration).toBeLessThan(20);
      });

      it('calculates streak from 365 records in under 20ms', () => {
        const tracking = createTrackingRecords(365, todayDate);

        const startTime = performance.now();
        const result = calculateStreakFromHistory(tracking, todayDate);
        const duration = performance.now() - startTime;

        expect(typeof result.currentStreak).toBe('number');
        expect(duration).toBeLessThan(20);
      });

      it('calculates streak from 1000 records in under 50ms', () => {
        const tracking = createTrackingRecords(1000, todayDate);

        const startTime = performance.now();
        const result = calculateStreakFromHistory(tracking, todayDate);
        const duration = performance.now() - startTime;

        expect(typeof result.currentStreak).toBe('number');
        expect(duration).toBeLessThan(50);
      });
    });

    describe('calculateOfflineStreak (full pipeline)', () => {
      it('full calculation with 100 records + 50 pending in under 10ms', () => {
        const serverTracking = createTrackingRecords(100, todayDate);
        const pendingOps = createPendingOperations(50);

        const startTime = performance.now();
        const result = calculateOfflineStreak(
          serverTracking,
          pendingOps,
          todayDate
        );
        const duration = performance.now() - startTime;

        expect(typeof result.currentStreak).toBe('number');
        expect(duration).toBeLessThan(10);
      });

      it('full calculation with 365 records + 100 pending in under 20ms', () => {
        const serverTracking = createTrackingRecords(365, todayDate);
        const pendingOps = createPendingOperations(100);

        const startTime = performance.now();
        const result = calculateOfflineStreak(
          serverTracking,
          pendingOps,
          todayDate
        );
        const duration = performance.now() - startTime;

        expect(typeof result.currentStreak).toBe('number');
        expect(duration).toBeLessThan(20);
      });

      it('full calculation under 200ms for worst case (SC-001)', () => {
        // Worst case: 1000 server records + 500 pending operations
        const serverTracking = createTrackingRecords(1000, todayDate);
        const pendingOps = createPendingOperations(500);

        const startTime = performance.now();
        const result = calculateOfflineStreak(
          serverTracking,
          pendingOps,
          todayDate
        );
        const duration = performance.now() - startTime;

        expect(typeof result.currentStreak).toBe('number');
        expect(duration).toBeLessThan(200);
      });
    });
  });

  describe('Persistence Performance (SC-006)', () => {
    describe('saveQueueState performance', () => {
      // Import actual save function for timing (mocked storage)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { saveQueueStateUnsafe } = require('../persistence');

      it('saves 100 operations state in under 10ms (excluding I/O)', async () => {
        const state: OfflineQueueState = {
          ...DEFAULT_QUEUE_STATE,
          operations: createManyOperations(100),
        };

        const startTime = performance.now();
        await saveQueueStateUnsafe(state);
        const duration = performance.now() - startTime;

        expect(duration).toBeLessThan(10);
      });

      it('saves 500 operations state in under 50ms (excluding I/O)', async () => {
        const state: OfflineQueueState = {
          ...DEFAULT_QUEUE_STATE,
          operations: createManyOperations(500),
        };

        const startTime = performance.now();
        await saveQueueStateUnsafe(state);
        const duration = performance.now() - startTime;

        expect(duration).toBeLessThan(50);
      });

      it('saves 1000 operations state in under 100ms (excluding I/O)', async () => {
        const state: OfflineQueueState = {
          ...DEFAULT_QUEUE_STATE,
          operations: createManyOperations(1000),
        };

        const startTime = performance.now();
        await saveQueueStateUnsafe(state);
        const duration = performance.now() - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    describe('loadQueueState performance (SC-006)', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const {
        loadQueueState,
        saveQueueStateUnsafe,
      } = require('../persistence');

      it('loads empty queue in under 10ms', async () => {
        const startTime = performance.now();
        const state = await loadQueueState();
        const duration = performance.now() - startTime;

        expect(state.operations).toHaveLength(0);
        expect(duration).toBeLessThan(10);
      });

      it('loads 100 operations in under 20ms', async () => {
        // Setup: save state first
        const setupState: OfflineQueueState = {
          ...DEFAULT_QUEUE_STATE,
          operations: createManyOperations(100),
        };
        await saveQueueStateUnsafe(setupState);

        const startTime = performance.now();
        const state = await loadQueueState();
        const duration = performance.now() - startTime;

        expect(state.operations).toHaveLength(100);
        expect(duration).toBeLessThan(20);
      });

      it('loads 500 operations in under 50ms (SC-006 limit)', async () => {
        // Setup: save state first
        const setupState: OfflineQueueState = {
          ...DEFAULT_QUEUE_STATE,
          operations: createManyOperations(500),
        };
        await saveQueueStateUnsafe(setupState);

        const startTime = performance.now();
        const state = await loadQueueState();
        const duration = performance.now() - startTime;

        expect(state.operations).toHaveLength(500);
        expect(duration).toBeLessThan(50);
      });

      it('loads 1000 operations in under 100ms (SC-006 limit)', async () => {
        // Setup: save state first
        const setupState: OfflineQueueState = {
          ...DEFAULT_QUEUE_STATE,
          operations: createManyOperations(1000),
        };
        await saveQueueStateUnsafe(setupState);

        const startTime = performance.now();
        const state = await loadQueueState();
        const duration = performance.now() - startTime;

        expect(state.operations).toHaveLength(1000);
        // ≤100ms is the requirement, being conservative
        expect(duration).toBeLessThan(100);
      });
    });
  });

  describe('Combined Workflow Performance', () => {
    describe('offline completion workflow', () => {
      let manager: OfflineQueueManagerAPI;

      beforeEach(() => {
        manager = createOfflineQueueManager({ autoPersist: false });
      });

      it('complete habit + calculate streak in under 50ms', () => {
        // Setup: server tracking data
        const serverTracking = createTrackingRecords(100, '2026-01-30');

        const startTime = performance.now();

        // 1. Enqueue offline completion
        const result = manager.enqueue('toggleCompletion', {
          habitId: mockHabitId('habit_1'),
          date: '2026-01-30',
          toCompleted: true,
        });

        // 2. Get pending operations
        const ops = manager.getState().operations;
        const pendingOps: PendingToggleOperation[] = ops.map((op) => ({
          date: op.payload.date,
          toCompleted: op.payload.toCompleted,
        }));

        // 3. Calculate streak with pending operations
        const streak = calculateOfflineStreak(
          serverTracking,
          pendingOps,
          '2026-01-30'
        );

        const duration = performance.now() - startTime;

        expect(result.success).toBe(true);
        expect(typeof streak.currentStreak).toBe('number');
        expect(duration).toBeLessThan(50);
      });

      it('rapid toggle sequence (10 toggles) in under 100ms', () => {
        const serverTracking = createTrackingRecords(100, '2026-01-30');

        const startTime = performance.now();

        // Simulate rapid toggling
        for (let i = 0; i < 10; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId('habit_1'),
            date: '2026-01-30',
            toCompleted: i % 2 === 0, // Toggle back and forth
          });

          // Calculate streak each time (simulating UI update)
          const ops = manager.getState().operations;
          const pendingOps: PendingToggleOperation[] = ops.map((op) => ({
            date: op.payload.date,
            toCompleted: op.payload.toCompleted,
          }));

          calculateOfflineStreak(serverTracking, pendingOps, '2026-01-30');
        }

        const duration = performance.now() - startTime;
        expect(duration).toBeLessThan(100);
      });
    });

    describe('sync workflow performance', () => {
      let manager: OfflineQueueManagerAPI;

      beforeEach(() => {
        manager = createOfflineQueueManager({ autoPersist: false });
      });

      it('process batch of 50 completions in under 100ms', () => {
        // Enqueue 50 operations
        const ids: string[] = [];
        for (let i = 0; i < 50; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const startTime = performance.now();

        // Simulate sync workflow
        // 1. Peek batch
        const batch = manager.peekBatch(50);

        // 2. Mark as syncing
        manager.markSyncingBatch(ids);

        // 3. Mark as completed (simulating successful sync)
        manager.markCompletedBatch(ids);

        const duration = performance.now() - startTime;

        expect(batch).toHaveLength(50);
        expect(manager.getState().operations).toHaveLength(0);
        expect(duration).toBeLessThan(100);
      });

      it('process batch of 500 with mixed results in under 200ms', () => {
        // Enqueue 500 operations
        const ids: string[] = [];
        for (let i = 0; i < 500; i++) {
          const result = manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
          ids.push(result.operationId!);
        }

        const startTime = performance.now();

        // Simulate sync workflow with mixed results
        // 1. Peek batch
        const batch = manager.peekBatch(500);

        // 2. Mark as syncing
        manager.markSyncingBatch(ids);

        // 3. Split: 400 succeed, 100 fail
        const successIds = ids.slice(0, 400);
        const failIds = ids.slice(400);

        manager.markCompletedBatch(successIds);
        manager.markFailedBatch(failIds, 'Network error', 'network');

        const duration = performance.now() - startTime;

        expect(batch).toHaveLength(500);
        expect(manager.getState().operations).toHaveLength(100); // Failed ones remain
        expect(duration).toBeLessThan(200);
      });
    });
  });

  describe('Memory and Stress Tests', () => {
    describe('large queue handling', () => {
      let manager: OfflineQueueManagerAPI;

      beforeEach(() => {
        manager = createOfflineQueueManager({ autoPersist: false });
      });

      it('handles 2000 operations without error', () => {
        for (let i = 0; i < 2000; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        expect(manager.getState().operations).toHaveLength(2000);
        const stats = manager.getStats();
        expect(stats.totalCount).toBe(2000);
      });

      it('maintains FIFO order with 1000+ operations', () => {
        for (let i = 0; i < 1000; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        // Check FIFO order
        const batch = manager.peekBatch(100);
        for (let i = 0; i < 100; i++) {
          expect(batch[i].payload.habitId).toBe(`habit_${i}`);
        }
      });

      it('dequeue maintains order under stress', () => {
        // Enqueue 500, dequeue 250, enqueue 500, dequeue remaining
        for (let i = 0; i < 500; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`batch1_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        for (let i = 0; i < 250; i++) {
          const op = manager.dequeue();
          expect(op?.payload.habitId).toBe(`batch1_${i}`);
        }

        for (let i = 0; i < 500; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`batch2_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        // Should continue with batch1 items 250-499, then batch2
        for (let i = 250; i < 500; i++) {
          const op = manager.dequeue();
          expect(op?.payload.habitId).toBe(`batch1_${i}`);
        }

        for (let i = 0; i < 500; i++) {
          const op = manager.dequeue();
          expect(op?.payload.habitId).toBe(`batch2_${i}`);
        }
      });
    });

    describe('index rebuild performance', () => {
      it('rebuilds index after dequeue operations efficiently', () => {
        const manager = createOfflineQueueManager({ autoPersist: false });

        // Add 500 operations
        for (let i = 0; i < 500; i++) {
          manager.enqueue('toggleCompletion', {
            habitId: mockHabitId(`habit_${i}`),
            date: '2026-01-30',
            toCompleted: true,
          });
        }

        // Dequeue half
        for (let i = 0; i < 250; i++) {
          manager.dequeue();
        }

        // Measure stats calculation (uses index)
        const startTime = performance.now();
        const stats = manager.getStats();
        const duration = performance.now() - startTime;

        expect(stats.totalCount).toBe(250);
        expect(duration).toBeLessThan(5);
      });
    });
  });

  describe('Benchmarks Summary', () => {
    it('FR-011: 500+ operations requirement validation', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });

      // Add 500 operations
      const startEnqueue = performance.now();
      for (let i = 0; i < 500; i++) {
        manager.enqueue('toggleCompletion', {
          habitId: mockHabitId(`habit_${i}`),
          date: '2026-01-30',
          toCompleted: true,
        });
      }
      const enqueueTime = performance.now() - startEnqueue;

      // Get stats
      const startStats = performance.now();
      const stats = manager.getStats();
      const statsTime = performance.now() - startStats;

      // Peek batch
      const startPeek = performance.now();
      const batch = manager.peekBatch(50);
      const peekTime = performance.now() - startPeek;

      expect(stats.totalCount).toBe(500);
      expect(batch).toHaveLength(50);
      expect(enqueueTime).toBeLessThan(200);
      expect(statsTime).toBeLessThan(5);
      expect(peekTime).toBeLessThan(5);
    });

    it('SC-001: Sub-200ms feedback requirement validation', () => {
      const serverTracking = createTrackingRecords(100, '2026-01-30');
      const manager = createOfflineQueueManager({ autoPersist: false });

      const startTime = performance.now();

      // Complete offline completion + streak calculation
      manager.enqueue('toggleCompletion', {
        habitId: mockHabitId('habit_1'),
        date: '2026-01-30',
        toCompleted: true,
      });

      const ops = manager.getState().operations;
      const pendingOps: PendingToggleOperation[] = ops.map((op) => ({
        date: op.payload.date,
        toCompleted: op.payload.toCompleted,
      }));

      const streak = calculateOfflineStreak(
        serverTracking,
        pendingOps,
        '2026-01-30'
      );

      const totalTime = performance.now() - startTime;

      expect(totalTime).toBeLessThan(200);
    });
  });
});
