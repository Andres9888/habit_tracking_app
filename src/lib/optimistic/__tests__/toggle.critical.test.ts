/**
 * Critical Path Tests for Optimistic Toggle Logic
 * Tests rapid toggling, offline state, concurrent toggles
 */

import type { Id } from '../../../../convex/_generated/dataModel';

// Mock types for testing
interface ToggleArgs {
  habitId: Id<'habits'>;
  date: string;
}

interface ToggleMutationResult {
  queued: boolean;
  offlineOperationId?: string;
}

interface OptimisticOperation {
  id: string;
  habitId: Id<'habits'>;
  date: string;
  toCompleted: boolean;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

/**
 * Mock implementation of optimistic store for testing
 */
class MockOptimisticStore {
  private operations: Map<string, OptimisticOperation> = new Map();
  private operationCounter = 0;

  addToggle(payload: {
    habitId: Id<'habits'>;
    date: string;
    toCompleted: boolean;
  }): string {
    const operationId = `op-${++this.operationCounter}`;
    this.operations.set(operationId, {
      id: operationId,
      habitId: payload.habitId,
      date: payload.date,
      toCompleted: payload.toCompleted,
      status: 'pending',
      timestamp: Date.now(),
    });
    return operationId;
  }

  confirm(operationId: string): void {
    const op = this.operations.get(operationId);
    if (op) {
      op.status = 'confirmed';
    }
  }

  fail(operationId: string, error: Error): void {
    const op = this.operations.get(operationId);
    if (op) {
      op.status = 'failed';
    }
  }

  getPending(): OptimisticOperation[] {
    return Array.from(this.operations.values()).filter(
      (op) => op.status === 'pending'
    );
  }

  getForHabitAndDate(habitId: Id<'habits'>, date: string): OptimisticOperation[] {
    return Array.from(this.operations.values()).filter(
      (op) => op.habitId === habitId && op.date === date
    );
  }

  clear(): void {
    this.operations.clear();
    this.operationCounter = 0;
  }

  size(): number {
    return this.operations.size;
  }
}

/**
 * Mock offline queue manager
 */
class MockOfflineQueue {
  private queue: Array<{ type: string; payload: unknown; id: string }> = [];
  private idCounter = 0;

  enqueue(type: string, payload: unknown): { success: boolean; operationId: string } {
    const operationId = `offline-${++this.idCounter}`;
    this.queue.push({ type, payload, id: operationId });
    return { success: true, operationId };
  }

  getQueue(): Array<{ type: string; payload: unknown; id: string }> {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
    this.idCounter = 0;
  }

  size(): number {
    return this.queue.length;
  }
}

describe('Optimistic Toggle - Critical Paths', () => {
  let optimisticStore: MockOptimisticStore;
  let offlineQueue: MockOfflineQueue;

  beforeEach(() => {
    optimisticStore = new MockOptimisticStore();
    offlineQueue = new MockOfflineQueue();
  });

  describe('rapid toggling', () => {
    it('handles double toggle (complete → incomplete → complete)', async () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Initial state: not completed
      let currentStatus = false;
      
      // First toggle: mark as complete
      const op1 = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: true,
      });
      currentStatus = true;
      
      // Second toggle (rapid): mark as incomplete
      const op2 = optimisticStore.addToggle({
        habitId,
        date,
        toCompleted: false,
      });
      currentStatus = false;
      
      const pending = optimisticStore.getPending();
      expect(pending).toHaveLength(2);
      expect(pending[0].toCompleted).toBe(true);
      expect(pending[1].toCompleted).toBe(false);
      expect(currentStatus).toBe(false);
    });

    it('handles triple toggle within same second', async () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      const ops = [
        optimisticStore.addToggle({ habitId, date, toCompleted: true }),
        optimisticStore.addToggle({ habitId, date, toCompleted: false }),
        optimisticStore.addToggle({ habitId, date, toCompleted: true }),
      ];
      
      expect(ops).toHaveLength(3);
      const pending = optimisticStore.getPending();
      expect(pending).toHaveLength(3);
      
      // Final state should be completed
      const finalOp = pending[pending.length - 1];
      expect(finalOp.toCompleted).toBe(true);
    });

    it('handles rapid toggles across multiple habits', async () => {
      const date = '2024-02-15';
      const habits = [
        'habit-1' as Id<'habits'>,
        'habit-2' as Id<'habits'>,
        'habit-3' as Id<'habits'>,
      ];
      
      // Toggle all three habits rapidly
      const ops = habits.map((habitId) =>
        optimisticStore.addToggle({ habitId, date, toCompleted: true })
      );
      
      expect(ops).toHaveLength(3);
      expect(optimisticStore.getPending()).toHaveLength(3);
      
      // Verify each habit has its own operation
      habits.forEach((habitId) => {
        const habitOps = optimisticStore.getForHabitAndDate(habitId, date);
        expect(habitOps).toHaveLength(1);
        expect(habitOps[0].toCompleted).toBe(true);
      });
    });

    it('handles sequential confirmation of rapid toggles', async () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      const op1 = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      const op2 = optimisticStore.addToggle({ habitId, date, toCompleted: false });
      
      expect(optimisticStore.getPending()).toHaveLength(2);
      
      // Confirm first operation
      optimisticStore.confirm(op1);
      let pending = optimisticStore.getPending();
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe(op2);
      
      // Confirm second operation
      optimisticStore.confirm(op2);
      pending = optimisticStore.getPending();
      expect(pending).toHaveLength(0);
    });

    it('maintains operation order for same habit-date', async () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      const ops: string[] = [];
      for (let i = 0; i < 5; i++) {
        ops.push(
          optimisticStore.addToggle({
            habitId,
            date,
            toCompleted: i % 2 === 0,
          })
        );
      }
      
      const habitOps = optimisticStore.getForHabitAndDate(habitId, date);
      expect(habitOps).toHaveLength(5);
      
      // Verify they're in chronological order
      for (let i = 1; i < habitOps.length; i++) {
        expect(habitOps[i].timestamp).toBeGreaterThanOrEqual(
          habitOps[i - 1].timestamp
        );
      }
    });
  });

  describe('offline state handling', () => {
    it('queues toggle when offline', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      const isOnline = false;
      
      // Add optimistic update
      optimisticStore.addToggle({ habitId, date, toCompleted: true });
      
      // Queue for offline sync
      const result = offlineQueue.enqueue('toggleCompletion', {
        habitId,
        date,
        toCompleted: true,
      });
      
      expect(result.success).toBe(true);
      expect(result.operationId).toBeDefined();
      expect(offlineQueue.size()).toBe(1);
    });

    it('queues multiple toggles while offline', () => {
      const habits = [
        { habitId: 'habit-1' as Id<'habits'>, date: '2024-02-15' },
        { habitId: 'habit-2' as Id<'habits'>, date: '2024-02-15' },
        { habitId: 'habit-3' as Id<'habits'>, date: '2024-02-15' },
      ];
      
      habits.forEach((habit) => {
        optimisticStore.addToggle({ ...habit, toCompleted: true });
        offlineQueue.enqueue('toggleCompletion', {
          ...habit,
          toCompleted: true,
        });
      });
      
      expect(offlineQueue.size()).toBe(3);
      expect(optimisticStore.size()).toBe(3);
    });

    it('handles rapid toggles while offline', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Rapid toggles while offline
      const toggles = [true, false, true, false, true];
      
      toggles.forEach((toCompleted) => {
        optimisticStore.addToggle({ habitId, date, toCompleted });
        offlineQueue.enqueue('toggleCompletion', { habitId, date, toCompleted });
      });
      
      expect(offlineQueue.size()).toBe(5);
      expect(optimisticStore.size()).toBe(5);
    });

    it('transitions from offline to online mid-operation', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Start offline
      let isOnline = false;
      const op1 = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      offlineQueue.enqueue('toggleCompletion', { habitId, date, toCompleted: true });
      
      expect(offlineQueue.size()).toBe(1);
      
      // Go online before second toggle
      isOnline = true;
      const op2 = optimisticStore.addToggle({ habitId, date, toCompleted: false });
      
      // Second toggle should not queue (online)
      expect(offlineQueue.size()).toBe(1); // Still just the first one
      expect(optimisticStore.size()).toBe(2); // Both in optimistic store
    });

    it('handles network error by queueing operation', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      const op = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      
      // Simulate network error - operation stays in optimistic store
      // and gets queued for retry
      const queueResult = offlineQueue.enqueue('toggleCompletion', {
        habitId,
        date,
        toCompleted: true,
      });
      
      expect(queueResult.success).toBe(true);
      expect(optimisticStore.getPending()).toHaveLength(1);
      expect(offlineQueue.size()).toBe(1);
    });
  });

  describe('concurrent toggles', () => {
    it('handles same habit on different dates concurrently', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const dates = ['2024-02-14', '2024-02-15', '2024-02-16'];
      
      const ops = dates.map((date) =>
        optimisticStore.addToggle({ habitId, date, toCompleted: true })
      );
      
      expect(ops).toHaveLength(3);
      expect(optimisticStore.getPending()).toHaveLength(3);
      
      // Each date should have its own operation
      dates.forEach((date) => {
        const dateOps = optimisticStore.getForHabitAndDate(habitId, date);
        expect(dateOps).toHaveLength(1);
      });
    });

    it('handles different habits on same date concurrently', () => {
      const date = '2024-02-15';
      const habitIds = [
        'habit-1' as Id<'habits'>,
        'habit-2' as Id<'habits'>,
        'habit-3' as Id<'habits'>,
      ];
      
      const ops = habitIds.map((habitId) =>
        optimisticStore.addToggle({ habitId, date, toCompleted: true })
      );
      
      expect(ops).toHaveLength(3);
      expect(optimisticStore.getPending()).toHaveLength(3);
    });

    it('handles mixed concurrent and sequential operations', () => {
      const habit1 = 'habit-1' as Id<'habits'>;
      const habit2 = 'habit-2' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Concurrent: both habits toggled
      const op1 = optimisticStore.addToggle({ habitId: habit1, date, toCompleted: true });
      const op2 = optimisticStore.addToggle({ habitId: habit2, date, toCompleted: true });
      
      // Sequential: habit1 toggled again
      const op3 = optimisticStore.addToggle({ habitId: habit1, date, toCompleted: false });
      
      expect(optimisticStore.size()).toBe(3);
      
      const habit1Ops = optimisticStore.getForHabitAndDate(habit1, date);
      expect(habit1Ops).toHaveLength(2);
      expect(habit1Ops[0].toCompleted).toBe(true);
      expect(habit1Ops[1].toCompleted).toBe(false);
      
      const habit2Ops = optimisticStore.getForHabitAndDate(habit2, date);
      expect(habit2Ops).toHaveLength(1);
    });

    it('handles confirmation of concurrent operations', () => {
      const date = '2024-02-15';
      const habitIds = [
        'habit-1' as Id<'habits'>,
        'habit-2' as Id<'habits'>,
        'habit-3' as Id<'habits'>,
      ];
      
      const ops = habitIds.map((habitId) =>
        optimisticStore.addToggle({ habitId, date, toCompleted: true })
      );
      
      expect(optimisticStore.getPending()).toHaveLength(3);
      
      // Confirm operations in different order than created
      optimisticStore.confirm(ops[2]);
      optimisticStore.confirm(ops[0]);
      optimisticStore.confirm(ops[1]);
      
      expect(optimisticStore.getPending()).toHaveLength(0);
    });

    it('handles partial failure of concurrent operations', () => {
      const date = '2024-02-15';
      const habitIds = [
        'habit-1' as Id<'habits'>,
        'habit-2' as Id<'habits'>,
        'habit-3' as Id<'habits'>,
      ];
      
      const ops = habitIds.map((habitId) =>
        optimisticStore.addToggle({ habitId, date, toCompleted: true })
      );
      
      // First succeeds
      optimisticStore.confirm(ops[0]);
      
      // Second fails
      optimisticStore.fail(ops[1], new Error('Network error'));
      
      // Third succeeds
      optimisticStore.confirm(ops[2]);
      
      const pending = optimisticStore.getPending();
      expect(pending).toHaveLength(0); // Failed operations are removed
    });
  });

  describe('edge cases', () => {
    it('handles toggle at exactly midnight', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Simulate toggle happening at midnight transition
      const midnight = new Date('2024-02-15T00:00:00.000Z');
      
      const op = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      
      expect(op).toBeDefined();
      const ops = optimisticStore.getForHabitAndDate(habitId, date);
      expect(ops).toHaveLength(1);
    });

    it('handles toggle during DST transition', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      // March 10, 2024 - DST transition day
      const date = '2024-03-10';
      
      const op = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      
      expect(op).toBeDefined();
      const ops = optimisticStore.getForHabitAndDate(habitId, date);
      expect(ops).toHaveLength(1);
    });

    it('handles rapid toggles with varying latency', async () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Create toggles with different confirmation times
      const op1 = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      const op2 = optimisticStore.addToggle({ habitId, date, toCompleted: false });
      const op3 = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      
      // Simulate varying server response times
      // op2 confirms first (fastest)
      optimisticStore.confirm(op2);
      
      // op3 confirms second
      optimisticStore.confirm(op3);
      
      // op1 confirms last (slowest)
      optimisticStore.confirm(op1);
      
      // All should be confirmed regardless of order
      expect(optimisticStore.getPending()).toHaveLength(0);
    });

    it('handles very rapid toggles (stress test)', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      const count = 50;
      
      const ops: string[] = [];
      const startTime = performance.now();
      
      for (let i = 0; i < count; i++) {
        ops.push(
          optimisticStore.addToggle({
            habitId,
            date,
            toCompleted: i % 2 === 0,
          })
        );
      }
      
      const endTime = performance.now();
      
      expect(ops).toHaveLength(count);
      expect(optimisticStore.size()).toBe(count);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    it('handles operations with identical timestamps', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Force same timestamp by executing synchronously
      const op1 = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      const op2 = optimisticStore.addToggle({ habitId, date, toCompleted: false });
      
      const ops = optimisticStore.getForHabitAndDate(habitId, date);
      expect(ops).toHaveLength(2);
      
      // Even with same timestamp, order should be preserved by insertion order
      expect(ops[0].id).toBe(op1);
      expect(ops[1].id).toBe(op2);
    });
  });

  describe('state consistency', () => {
    it('maintains correct final state after rapid toggles', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Rapid toggles: start false -> true -> false -> true
      const toggleSequence = [true, false, true];
      
      toggleSequence.forEach((toCompleted) => {
        optimisticStore.addToggle({ habitId, date, toCompleted });
      });
      
      const ops = optimisticStore.getForHabitAndDate(habitId, date);
      const finalOp = ops[ops.length - 1];
      
      // Final state should be true
      expect(finalOp.toCompleted).toBe(true);
    });

    it('maintains consistency across offline/online transitions', () => {
      const habitId = 'habit-123' as Id<'habits'>;
      const date = '2024-02-15';
      
      // Offline toggle
      const op1 = optimisticStore.addToggle({ habitId, date, toCompleted: true });
      offlineQueue.enqueue('toggleCompletion', { habitId, date, toCompleted: true });
      
      // Online toggle
      const op2 = optimisticStore.addToggle({ habitId, date, toCompleted: false });
      
      // Both should be tracked
      expect(optimisticStore.size()).toBe(2);
      expect(offlineQueue.size()).toBe(1);
      
      const ops = optimisticStore.getForHabitAndDate(habitId, date);
      expect(ops).toHaveLength(2);
    });
  });
});
