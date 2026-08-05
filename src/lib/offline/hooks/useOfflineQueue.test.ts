/**
 * useOfflineQueue Hook Tests
 *
 * Tests for the React hook that provides access to the offline queue.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useOfflineQueue } from './useOfflineQueue';
import {
  createOfflineQueueManager,
  resetOfflineQueueManager,
} from '../queueManager';
import type { QueueEvent } from '../queue';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('useOfflineQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetOfflineQueueManager();
  });

  describe('initial state', () => {
    it('returns empty operations array initially', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      expect(result.current.operations).toEqual([]);
    });

    it('returns isEmpty as true for empty queue', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      expect(result.current.isEmpty).toBe(true);
    });

    it('returns hasPendingOperations as false for empty queue', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      expect(result.current.hasPendingOperations).toBe(false);
    });

    it('returns healthy stats for empty queue', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      expect(result.current.stats.totalCount).toBe(0);
      expect(result.current.stats.isHealthy).toBe(true);
    });
  });

  describe('enqueue', () => {
    const samplePayload = {
      habitId: 'habit_123' as unknown,
      date: '2026-01-30',
      toCompleted: true,
    };

    it('adds operation to queue', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      act(() => {
        result.current.enqueue(samplePayload);
      });

      expect(result.current.operations).toHaveLength(1);
      expect(result.current.isEmpty).toBe(false);
    });

    it('returns success result', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let enqueueResult: ReturnType<typeof result.current.enqueue>;
      act(() => {
        enqueueResult = result.current.enqueue(samplePayload);
      });

      expect(enqueueResult!.success).toBe(true);
      expect(enqueueResult!.operationId).toBeDefined();
    });

    it('updates hasPendingOperations to true', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      act(() => {
        result.current.enqueue(samplePayload);
      });

      expect(result.current.hasPendingOperations).toBe(true);
    });

    it('updates stats correctly', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      act(() => {
        result.current.enqueue(samplePayload);
      });

      expect(result.current.stats.totalCount).toBe(1);
      expect(result.current.stats.pendingCount).toBe(1);
    });

    it('replaces duplicate operations by default', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      act(() => {
        result.current.enqueue({ ...samplePayload, toCompleted: true });
        result.current.enqueue({ ...samplePayload, toCompleted: false });
      });

      expect(result.current.operations).toHaveLength(1);
      expect(result.current.operations[0].payload.toCompleted).toBe(false);
    });

    it('allows duplicates when option set', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      act(() => {
        result.current.enqueue(samplePayload);
        result.current.enqueue(samplePayload, { allowDuplicate: true });
      });

      expect(result.current.operations).toHaveLength(2);
    });
  });

  describe('markCompleted', () => {
    const samplePayload = {
      habitId: 'habit_123' as unknown,
      date: '2026-01-30',
      toCompleted: true,
    };

    it('removes operation from queue', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let operationId: string;
      act(() => {
        const enqueueResult = result.current.enqueue(samplePayload);
        operationId = enqueueResult.operationId!;
      });

      act(() => {
        result.current.markCompleted(operationId);
      });

      expect(result.current.operations).toHaveLength(0);
      expect(result.current.isEmpty).toBe(true);
    });

    it('returns true for existing operation', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let operationId: string;
      act(() => {
        const enqueueResult = result.current.enqueue(samplePayload);
        operationId = enqueueResult.operationId!;
      });

      let markResult: boolean;
      act(() => {
        markResult = result.current.markCompleted(operationId);
      });

      expect(markResult!).toBe(true);
    });

    it('returns false for non-existent operation', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let markResult: boolean;
      act(() => {
        markResult = result.current.markCompleted('non-existent');
      });

      expect(markResult!).toBe(false);
    });

    it('updates hasPendingOperations to false when queue empties', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let operationId: string;
      act(() => {
        const enqueueResult = result.current.enqueue(samplePayload);
        operationId = enqueueResult.operationId!;
      });

      expect(result.current.hasPendingOperations).toBe(true);

      act(() => {
        result.current.markCompleted(operationId);
      });

      expect(result.current.hasPendingOperations).toBe(false);
    });
  });

  describe('markFailed', () => {
    const samplePayload = {
      habitId: 'habit_123' as unknown,
      date: '2026-01-30',
      toCompleted: true,
    };

    it('updates operation status to failed', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let operationId: string;
      act(() => {
        const enqueueResult = result.current.enqueue(samplePayload);
        operationId = enqueueResult.operationId!;
      });

      act(() => {
        result.current.markFailed(operationId, 'Network error', 'network');
      });

      expect(result.current.operations[0].status).toBe('failed');
      expect(result.current.operations[0].lastError).toBe('Network error');
      expect(result.current.operations[0].lastErrorCategory).toBe('network');
    });

    it('increments retry count', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let operationId: string;
      act(() => {
        const enqueueResult = result.current.enqueue(samplePayload);
        operationId = enqueueResult.operationId!;
      });

      act(() => {
        result.current.markFailed(operationId, 'Error');
      });

      expect(result.current.operations[0].retryCount).toBe(1);
    });

    it('updates stats to reflect failed operation', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      let operationId: string;
      act(() => {
        const enqueueResult = result.current.enqueue(samplePayload);
        operationId = enqueueResult.operationId!;
      });

      act(() => {
        result.current.markFailed(operationId, 'Error');
      });

      expect(result.current.stats.failedCount).toBe(1);
      expect(result.current.stats.isHealthy).toBe(false);
    });
  });

  describe('clear', () => {
    it('removes all operations', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      act(() => {
        result.current.enqueue({
          habitId: 'h1' as unknown,
          date: '2026-01-30',
          toCompleted: true,
        });
        result.current.enqueue({
          habitId: 'h2' as unknown,
          date: '2026-01-30',
          toCompleted: true,
        });
      });

      expect(result.current.operations).toHaveLength(2);

      act(() => {
        result.current.clear();
      });

      expect(result.current.operations).toHaveLength(0);
      expect(result.current.isEmpty).toBe(true);
    });

    it('resets hasPendingOperations', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      act(() => {
        result.current.enqueue({
          habitId: 'h1' as unknown,
          date: '2026-01-30',
          toCompleted: true,
        });
      });

      expect(result.current.hasPendingOperations).toBe(true);

      act(() => {
        result.current.clear();
      });

      expect(result.current.hasPendingOperations).toBe(false);
    });
  });

  describe('subscribe', () => {
    const samplePayload = {
      habitId: 'habit_123' as unknown,
      date: '2026-01-30',
      toCompleted: true,
    };

    it('receives events on enqueue', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));
      const events: QueueEvent[] = [];

      act(() => {
        result.current.subscribe((e) => events.push(e));
      });

      act(() => {
        result.current.enqueue(samplePayload);
      });

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('operation:added');
    });

    it('receives events on markCompleted', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));
      const events: QueueEvent[] = [];

      let operationId: string;
      act(() => {
        const enqueueResult = result.current.enqueue(samplePayload);
        operationId = enqueueResult.operationId!;
      });

      act(() => {
        result.current.subscribe((e) => events.push(e));
      });

      act(() => {
        result.current.markCompleted(operationId);
      });

      expect(events.some((e) => e.type === 'operation:synced')).toBe(true);
    });

    it('unsubscribes correctly', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));
      const events: QueueEvent[] = [];

      let unsub: () => void;
      act(() => {
        unsub = result.current.subscribe((e) => events.push(e));
      });

      act(() => {
        result.current.enqueue(samplePayload);
      });
      expect(events).toHaveLength(1);

      act(() => {
        unsub();
      });

      act(() => {
        result.current.enqueue({
          ...samplePayload,
          habitId: 'h2' as unknown,
        });
      });

      expect(events).toHaveLength(1); // No new events
    });
  });

  describe('reactivity', () => {
    it('re-renders when operations change', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      const initialOperations = result.current.operations;

      act(() => {
        result.current.enqueue({
          habitId: 'h1' as unknown,
          date: '2026-01-30',
          toCompleted: true,
        });
      });

      expect(result.current.operations).not.toBe(initialOperations);
      expect(result.current.operations).toHaveLength(1);
    });

    it('reflects external changes to manager', () => {
      const manager = createOfflineQueueManager({ autoPersist: false });
      const { result } = renderHook(() => useOfflineQueue({ manager }));

      // Directly modify the manager outside of the hook
      act(() => {
        manager.enqueue('toggleCompletion', {
          habitId: 'h1' as unknown,
          date: '2026-01-30',
          toCompleted: true,
        });
      });

      expect(result.current.operations).toHaveLength(1);
    });
  });

  describe('uses default singleton when no manager provided', () => {
    it('works without custom manager', () => {
      const { result } = renderHook(() => useOfflineQueue());

      expect(result.current.operations).toBeDefined();
      expect(result.current.stats).toBeDefined();
    });
  });
});
