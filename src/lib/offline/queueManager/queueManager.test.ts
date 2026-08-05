/**
 * OfflineQueueManager Tests
 *
 * Tests for the offline queue manager including FIFO operations,
 * status tracking, persistence, and event emission.
 */

import {
  createOfflineQueueManager,
  getOfflineQueueManager,
  resetOfflineQueueManager,
} from './index';
import type { OfflineQueueManagerAPI } from './types';
import {
  loadQueueState,
  saveQueueState,
  clearQueueState,
} from '../persistence';
import type { QueueEvent } from '../queue';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('OfflineQueueManager', () => {
  let manager: OfflineQueueManagerAPI;

  beforeEach(() => {
    jest.clearAllMocks();
    resetOfflineQueueManager();
    manager = createOfflineQueueManager({ autoPersist: false });
  });

  describe('createOfflineQueueManager', () => {
    it('creates a manager with empty initial state', () => {
      const state = manager.getState();
      expect(state.operations).toEqual([]);
      expect(state.version).toBe(1);
    });

    it('creates manager with proper timestamps', () => {
      const state = manager.getState();
      expect(state.createdAt).toBeGreaterThan(0);
      expect(state.updatedAt).toBeGreaterThan(0);
    });
  });

  describe('singleton management', () => {
    it('returns same instance from getOfflineQueueManager', () => {
      const instance1 = getOfflineQueueManager();
      const instance2 = getOfflineQueueManager();
      expect(instance1).toBe(instance2);
    });

    it('creates new instance after resetOfflineQueueManager', () => {
      const instance1 = getOfflineQueueManager();
      resetOfflineQueueManager();
      const instance2 = getOfflineQueueManager();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('enqueue', () => {
    const samplePayload = {
      habitId: 'habit_123' as unknown,
      date: '2026-01-30',
      toCompleted: true,
    };

    it('adds operation to queue', () => {
      const result = manager.enqueue('toggleCompletion', samplePayload);

      expect(result.success).toBe(true);
      expect(result.operationId).toBeDefined();
      expect(manager.getState().operations).toHaveLength(1);
    });

    it('generates unique operation IDs', () => {
      const result1 = manager.enqueue('toggleCompletion', {
        ...samplePayload,
        date: '2026-01-29',
      });
      const result2 = manager.enqueue('toggleCompletion', {
        ...samplePayload,
        date: '2026-01-30',
      });

      expect(result1.operationId).not.toBe(result2.operationId);
    });

    it('replaces duplicate operations by default', () => {
      const result1 = manager.enqueue('toggleCompletion', {
        ...samplePayload,
        toCompleted: true,
      });
      const result2 = manager.enqueue('toggleCompletion', {
        ...samplePayload,
        toCompleted: false,
      });

      expect(result2.replaced).toBe(true);
      expect(result2.operationId).toBe(result1.operationId);
      expect(manager.getState().operations).toHaveLength(1);
      expect(manager.getState().operations[0].payload.toCompleted).toBe(false);
    });

    it('allows duplicates when option set', () => {
      manager.enqueue('toggleCompletion', samplePayload);
      manager.enqueue('toggleCompletion', samplePayload, {
        allowDuplicate: true,
      });

      expect(manager.getState().operations).toHaveLength(2);
    });

    it('creates operation with pending status', () => {
      manager.enqueue('toggleCompletion', samplePayload);

      expect(manager.getState().operations[0].status).toBe('pending');
    });

    it('creates operation with zero retry count', () => {
      manager.enqueue('toggleCompletion', samplePayload);

      expect(manager.getState().operations[0].retryCount).toBe(0);
    });
  });

  describe('peek', () => {
    it('returns undefined for empty queue', () => {
      expect(manager.peek()).toBeUndefined();
    });

    it('returns first pending operation', () => {
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      manager.enqueue('toggleCompletion', {
        habitId: 'h2' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const peeked = manager.peek();
      expect(peeked?.payload.habitId).toBe('h1');
      expect(manager.getState().operations).toHaveLength(2); // Does not remove
    });

    it('skips non-pending operations', () => {
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      manager.enqueue('toggleCompletion', {
        habitId: 'h2' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      // Mark first as syncing
      const state = manager.getState();
      manager.markSyncing(state.operations[0].id);

      const peeked = manager.peek();
      expect(peeked?.payload.habitId).toBe('h2');
    });
  });

  describe('dequeue', () => {
    it('returns undefined for empty queue', () => {
      expect(manager.dequeue()).toBeUndefined();
    });

    it('removes and returns first pending operation', () => {
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      manager.enqueue('toggleCompletion', {
        habitId: 'h2' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const dequeued = manager.dequeue();
      expect(dequeued?.payload.habitId).toBe('h1');
      expect(manager.getState().operations).toHaveLength(1);
      expect(manager.getState().operations[0].payload.habitId).toBe('h2');
    });
  });

  describe('remove', () => {
    it('returns false for non-existent operation', () => {
      expect(manager.remove('non-existent')).toBe(false);
    });

    it('removes operation by ID', () => {
      const result = manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      expect(manager.remove(result.operationId!)).toBe(true);
      expect(manager.getState().operations).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('removes all operations', () => {
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      manager.enqueue('toggleCompletion', {
        habitId: 'h2' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      manager.clear();

      expect(manager.getState().operations).toHaveLength(0);
    });

    it('can clear memory without persisting the empty queue', () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const persistedManager = createOfflineQueueManager({ autoPersist: true });
      const events: QueueEvent[] = [];
      persistedManager.subscribe((event) => events.push(event));
      persistedManager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      AsyncStorage.setItem.mockClear();

      persistedManager.clear({ persist: false });

      expect(persistedManager.getState().operations).toHaveLength(0);
      expect(events.at(-1)?.type).toBe('queue:cleared');
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('status transitions', () => {
    const samplePayload = {
      habitId: 'habit_123' as unknown,
      date: '2026-01-30',
      toCompleted: true,
    };

    it('markSyncing transitions to syncing', () => {
      const result = manager.enqueue('toggleCompletion', samplePayload);

      expect(manager.markSyncing(result.operationId!)).toBe(true);
      expect(manager.getState().operations[0].status).toBe('syncing');
      expect(manager.getState().operations[0].lastAttemptAt).toBeDefined();
    });

    it('markCompleted removes operation from queue', () => {
      const result = manager.enqueue('toggleCompletion', samplePayload);

      expect(manager.markCompleted(result.operationId!)).toBe(true);
      expect(manager.getState().operations).toHaveLength(0);
      expect(manager.getState().lastSyncCompletedAt).toBeDefined();
    });

    it('markFailed transitions to failed and increments retry', () => {
      const result = manager.enqueue('toggleCompletion', samplePayload);

      expect(
        manager.markFailed(result.operationId!, 'Network error', 'network')
      ).toBe(true);

      const op = manager.getState().operations[0];
      expect(op.status).toBe('failed');
      expect(op.retryCount).toBe(1);
      expect(op.lastError).toBe('Network error');
      expect(op.lastErrorCategory).toBe('network');
    });

    it('markPending resets to pending', () => {
      const result = manager.enqueue('toggleCompletion', samplePayload);
      manager.markSyncing(result.operationId!);

      expect(manager.markPending(result.operationId!)).toBe(true);
      expect(manager.getState().operations[0].status).toBe('pending');
    });

    it('returns false for non-existent operation', () => {
      expect(manager.markSyncing('non-existent')).toBe(false);
      expect(manager.markCompleted('non-existent')).toBe(false);
      expect(manager.markFailed('non-existent', 'error')).toBe(false);
      expect(manager.markPending('non-existent')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('returns empty stats for empty queue', () => {
      const stats = manager.getStats();

      expect(stats.totalCount).toBe(0);
      expect(stats.pendingCount).toBe(0);
      expect(stats.syncingCount).toBe(0);
      expect(stats.failedCount).toBe(0);
      expect(stats.isHealthy).toBe(true);
    });

    it('calculates correct counts by status', () => {
      // Add 3 operations
      const r1 = manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      const r2 = manager.enqueue('toggleCompletion', {
        habitId: 'h2' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      manager.enqueue('toggleCompletion', {
        habitId: 'h3' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      // Mark different statuses
      manager.markSyncing(r1.operationId!);
      manager.markFailed(r2.operationId!, 'error');

      const stats = manager.getStats();
      expect(stats.totalCount).toBe(3);
      expect(stats.pendingCount).toBe(1);
      expect(stats.syncingCount).toBe(1);
      expect(stats.failedCount).toBe(1);
      expect(stats.isHealthy).toBe(false); // has failed
    });

    it('tracks oldest pending operation', () => {
      const beforeFirst = Date.now();
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const stats = manager.getStats();
      expect(stats.oldestPendingAt).toBeGreaterThanOrEqual(beforeFirst);
    });
  });

  describe('event emission', () => {
    it('emits operation:added on enqueue', () => {
      const events: QueueEvent[] = [];
      manager.subscribe((e) => events.push(e));

      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('operation:added');
      expect(events[0].operation).toBeDefined();
    });

    it('emits operation:updated on replace', () => {
      const events: QueueEvent[] = [];
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      manager.subscribe((e) => events.push(e));
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: false,
      });

      expect(events[0].type).toBe('operation:updated');
    });

    it('emits operation:removed on dequeue', () => {
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const events: QueueEvent[] = [];
      manager.subscribe((e) => events.push(e));
      manager.dequeue();

      expect(events[0].type).toBe('operation:removed');
    });

    it('emits operation:synced on markCompleted', () => {
      const result = manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const events: QueueEvent[] = [];
      manager.subscribe((e) => events.push(e));
      manager.markCompleted(result.operationId!);

      expect(events[0].type).toBe('operation:synced');
    });

    it('emits operation:failed on markFailed', () => {
      const result = manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const events: QueueEvent[] = [];
      manager.subscribe((e) => events.push(e));
      manager.markFailed(result.operationId!, 'error');

      expect(events[0].type).toBe('operation:failed');
    });

    it('emits operation:failed-final for terminal markFailed', () => {
      const result = manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const events: QueueEvent[] = [];
      manager.subscribe((e) => events.push(e));
      manager.markFailed(result.operationId!, 'error', undefined, {
        final: true,
      });

      expect(events[0].type).toBe('operation:failed-final');
    });

    it('emits queue:cleared on clear', () => {
      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });

      const events: QueueEvent[] = [];
      manager.subscribe((e) => events.push(e));
      manager.clear();

      expect(events[0].type).toBe('queue:cleared');
    });

    it('unsubscribe stops event delivery', () => {
      const events: QueueEvent[] = [];
      const unsub = manager.subscribe((e) => events.push(e));

      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      expect(events).toHaveLength(1);

      unsub();
      manager.enqueue('toggleCompletion', {
        habitId: 'h2' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      expect(events).toHaveLength(1); // No new events
    });
  });

  describe('persistence', () => {
    it('restore loads state from storage', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const savedState = JSON.stringify({
        version: 1,
        operations: [
          {
            id: 'op_1',
            type: 'toggleCompletion',
            payload: { habitId: 'h1', date: '2026-01-30', toCompleted: true },
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // In tests secure storage falls back to AsyncStorage. Each storage read
      // first checks a legacy key during migration, then reads the scoped key.
      AsyncStorage.getItem
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(savedState);

      const events: QueueEvent[] = [];
      manager.subscribe((e) => events.push(e));
      await manager.restore();

      expect(manager.getState().operations).toHaveLength(1);
      expect(events.some((e) => e.type === 'queue:restored')).toBe(true);
    });

    it('persist saves state to storage', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');

      manager.enqueue('toggleCompletion', {
        habitId: 'h1' as unknown,
        date: '2026-01-30',
        toCompleted: true,
      });
      await manager.persist();

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
