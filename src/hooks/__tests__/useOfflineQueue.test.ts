/**
 * useOfflineQueue Tests
 * Edge Case Handling: Offline queue for submissions when network unavailable
 *
 * Tests:
 * - Queue storage key generation
 * - Enqueue/dequeue operations
 * - Queue persistence with AsyncStorage
 * - Retry delay calculation with exponential backoff
 * - Queue statistics calculation
 * - Stale item cleanup
 * - Queue size limits
 * - Error handling
 * - Callback invocations
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useOfflineQueue,
  generateSubmissionId,
  getItemKey,
  calculateRetryDelay,
  loadQueueIndex,
  saveQueueIndex,
  loadQueueItem,
  saveQueueItem,
  removeQueueItem,
  loadAllQueueItems,
  calculateQueueStats,
  type QueuedSubmission,
  type HabitUpdatePayload,
} from '../useOfflineQueue';

jest.mock('@react-native-async-storage/async-storage');

describe('useOfflineQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
  });

  describe('generateSubmissionId', () => {
    it('generates unique IDs', () => {
      const id1 = generateSubmissionId();
      const id2 = generateSubmissionId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(10);
    });

    it('includes timestamp in ID', () => {
      const before = Date.now();
      const id = generateSubmissionId();
      const after = Date.now();

      // Extract timestamp from ID (format: timestamp-random)
      const timestamp = parseInt(id.split('-')[0], 10);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('getItemKey', () => {
    it('generates correct key format', () => {
      const key = getItemKey('123-abc');
      expect(key).toBe('offline-queue:123-abc');
    });

    it('handles complex IDs', () => {
      const key = getItemKey('1703849283947-kj38f9a2d');
      expect(key).toBe('offline-queue:1703849283947-kj38f9a2d');
    });
  });

  describe('calculateRetryDelay', () => {
    it('returns base delay for first retry', () => {
      const delay = calculateRetryDelay(0, 1000);
      // With jitter, should be within 25% of 1000ms
      expect(delay).toBeGreaterThanOrEqual(750);
      expect(delay).toBeLessThanOrEqual(1250);
    });

    it('doubles delay for each retry (exponential backoff)', () => {
      const baseDelay = 1000;

      // Retry 0: 1s (750-1250 with jitter)
      const delay0 = calculateRetryDelay(0, baseDelay);
      expect(delay0).toBeGreaterThanOrEqual(750);
      expect(delay0).toBeLessThanOrEqual(1250);

      // Retry 1: 2s (1500-2500 with jitter)
      const delay1 = calculateRetryDelay(1, baseDelay);
      expect(delay1).toBeGreaterThanOrEqual(1500);
      expect(delay1).toBeLessThanOrEqual(2500);

      // Retry 2: 4s (3000-5000 with jitter)
      const delay2 = calculateRetryDelay(2, baseDelay);
      expect(delay2).toBeGreaterThanOrEqual(3000);
      expect(delay2).toBeLessThanOrEqual(5000);

      // Retry 3: 8s (6000-10000 with jitter)
      const delay3 = calculateRetryDelay(3, baseDelay);
      expect(delay3).toBeGreaterThanOrEqual(6000);
      expect(delay3).toBeLessThanOrEqual(10000);
    });

    it('uses default base delay of 1000ms', () => {
      const delay = calculateRetryDelay(0);
      expect(delay).toBeGreaterThanOrEqual(750);
      expect(delay).toBeLessThanOrEqual(1250);
    });
  });

  describe('loadQueueIndex', () => {
    it('returns empty array when no index exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadQueueIndex();

      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offline-queue-index');
    });

    it('returns stored index', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['id1', 'id2', 'id3'])
      );

      const result = await loadQueueIndex();

      expect(result).toEqual(['id1', 'id2', 'id3']);
    });

    it('filters non-string values from stored index', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['id1', 2, null, 'id3', { id: 'x' }])
      );

      const result = await loadQueueIndex();

      expect(result).toEqual(['id1', 'id3']);
    });

    it('handles invalid JSON gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await loadQueueIndex();

      expect(result).toEqual([]);
    });
  });

  describe('saveQueueIndex', () => {
    it('saves index to AsyncStorage', async () => {
      await saveQueueIndex(['id1', 'id2']);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'offline-queue-index',
        JSON.stringify(['id1', 'id2'])
      );
    });

    it('throws on storage error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage full')
      );

      await expect(saveQueueIndex(['id1'])).rejects.toThrow(
        'Failed to save queue index'
      );
    });
  });

  describe('loadQueueItem', () => {
    it('returns null when item does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadQueueItem('test-id');

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        'offline-queue:test-id'
      );
    });

    it('returns parsed item', async () => {
      const item: QueuedSubmission = {
        id: 'test-id',
        type: 'habitUpdate',
        payload: { habitId: 'habit-1', updates: { name: 'Test' } },
        queuedAt: 1703849283947,
        retryCount: 0,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(item)
      );

      const result = await loadQueueItem('test-id');

      expect(result).toEqual(item);
    });

    it('handles invalid JSON gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid');

      const result = await loadQueueItem('test-id');

      expect(result).toBeNull();
    });

    it('returns null for invalid item shape', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ id: 'test-id', queuedAt: 1703849283947 })
      );

      const result = await loadQueueItem('test-id');

      expect(result).toBeNull();
    });

    it('returns null for invalid item type field', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          id: 'test-id',
          type: 'unknown-type',
          payload: {},
          queuedAt: 1703849283947,
          retryCount: 0,
        })
      );

      const result = await loadQueueItem('test-id');

      expect(result).toBeNull();
    });
  });

  describe('saveQueueItem', () => {
    it('saves item to AsyncStorage', async () => {
      const item: QueuedSubmission = {
        id: 'test-id',
        type: 'habitUpdate',
        payload: { habitId: 'habit-1', updates: { name: 'Test' } },
        queuedAt: 1703849283947,
        retryCount: 0,
      };

      await saveQueueItem(item);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'offline-queue:test-id',
        JSON.stringify(item)
      );
    });
  });

  describe('removeQueueItem', () => {
    it('removes item from AsyncStorage', async () => {
      await removeQueueItem('test-id');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'offline-queue:test-id'
      );
    });

    it('does not throw on removal error', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Error')
      );

      // Should not throw
      await removeQueueItem('test-id');
    });
  });

  describe('loadAllQueueItems', () => {
    it('returns empty array when no items', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const result = await loadAllQueueItems();

      expect(result).toEqual([]);
    });

    it('loads all items and sorts by queuedAt', async () => {
      const items: QueuedSubmission[] = [
        {
          id: 'id2',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 2000,
          retryCount: 0,
        },
        {
          id: 'id1',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 1000,
          retryCount: 0,
        },
        {
          id: 'id3',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 3000,
          retryCount: 0,
        },
      ];

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(['id2', 'id1', 'id3']))
        .mockResolvedValueOnce(JSON.stringify(items[0]))
        .mockResolvedValueOnce(JSON.stringify(items[1]))
        .mockResolvedValueOnce(JSON.stringify(items[2]));

      const result = await loadAllQueueItems();

      // Should be sorted by queuedAt (oldest first)
      expect(result[0].id).toBe('id1');
      expect(result[1].id).toBe('id2');
      expect(result[2].id).toBe('id3');
    });

    it('skips items that fail to load', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(['id1', 'id2']))
        .mockResolvedValueOnce(
          JSON.stringify({
            id: 'id1',
            type: 'habitUpdate',
            payload: {},
            queuedAt: 1000,
            retryCount: 0,
          })
        )
        .mockResolvedValueOnce(null); // id2 fails to load

      const result = await loadAllQueueItems();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('id1');
    });
  });

  describe('calculateQueueStats', () => {
    it('returns zero stats for empty queue', () => {
      const stats = calculateQueueStats([]);

      expect(stats).toEqual({
        totalItems: 0,
        pendingItems: 0,
        failedItems: 0,
        byType: {
          habitUpdate: 0,
        },
        oldestItemAt: undefined,
      });
    });

    it('calculates correct stats', () => {
      const items: QueuedSubmission[] = [
        {
          id: 'id1',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 1000,
          retryCount: 0, // pending
        },
        {
          id: 'id2',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 2000,
          retryCount: 1, // failed
        },
        {
          id: 'id3',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 3000,
          retryCount: 0, // pending
        },
        {
          id: 'id4',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 4000,
          retryCount: 2, // failed
        },
      ];

      const stats = calculateQueueStats(items);

      expect(stats.totalItems).toBe(4);
      expect(stats.pendingItems).toBe(2);
      expect(stats.failedItems).toBe(2);
      expect(stats.byType.habitUpdate).toBe(4);
      expect(stats.oldestItemAt).toBe(1000);
    });
  });

  describe('useOfflineQueue hook', () => {
    it('initializes with loading state', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const { result } = renderHook(() => useOfflineQueue());

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for load to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('loads queue count on mount', async () => {
      const items: QueuedSubmission[] = [
        {
          id: 'id1',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 1000,
          retryCount: 0,
        },
        {
          id: 'id2',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 2000,
          retryCount: 0,
        },
      ];

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(['id1', 'id2']))
        .mockResolvedValueOnce(JSON.stringify(items[0]))
        .mockResolvedValueOnce(JSON.stringify(items[1]));

      const { result } = renderHook(() => useOfflineQueue());

      await waitFor(() => {
        expect(result.current.queueCount).toBe(2);
        expect(result.current.hasQueuedItems).toBe(true);
      });
    });

    describe('enqueue', () => {
      it('adds item to queue', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify([])
        );

        const { result } = renderHook(() => useOfflineQueue());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        const payload: HabitUpdatePayload = {
          habitId: 'habit-1',
          updates: { name: 'Updated habit' },
        };

        let id: string;
        await act(async () => {
          id = await result.current.enqueue('habitUpdate', payload, {
            habitId: 'habit-1',
            description: 'Habit update',
          });
        });

        expect(id!).toBeDefined();
        expect(result.current.queueCount).toBe(1);
        expect(result.current.hasQueuedItems).toBe(true);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });

      it('throws when queue is full', async () => {
        // Create a queue at max capacity (50 items)
        const ids = Array.from({ length: 50 }, (_, i) => `id${i}`);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify(ids)
        );

        const { result } = renderHook(() =>
          useOfflineQueue({ maxQueueSize: 50 })
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await expect(
          result.current.enqueue('habitUpdate', {
            habitId: 'h1',
            updates: {},
          })
        ).rejects.toThrow('Queue is full');
      });

      it('calls onQueueChange callback', async () => {
        const onQueueChange = jest.fn();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify([])
        );

        const { result } = renderHook(() => useOfflineQueue({ onQueueChange }));

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.enqueue('habitUpdate', {
            habitId: 'h1',
            updates: {},
          });
        });

        expect(onQueueChange).toHaveBeenCalled();
      });
    });

    describe('dequeue', () => {
      it('removes item from queue', async () => {
        const item: QueuedSubmission = {
          id: 'id1',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 1000,
          retryCount: 0,
        };

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1']))
          .mockResolvedValueOnce(JSON.stringify(item));

        const { result } = renderHook(() => useOfflineQueue());

        await waitFor(() => {
          expect(result.current.queueCount).toBe(1);
        });

        await act(async () => {
          await result.current.dequeue('id1');
        });

        expect(result.current.queueCount).toBe(0);
        expect(result.current.hasQueuedItems).toBe(false);
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
          'offline-queue:id1'
        );
      });

      it('calls onItemProcessed callback', async () => {
        const onItemProcessed = jest.fn();
        const item: QueuedSubmission = {
          id: 'id1',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 1000,
          retryCount: 0,
        };

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1']))
          .mockResolvedValueOnce(JSON.stringify(item))
          .mockResolvedValueOnce(JSON.stringify(['id1'])) // For dequeue
          .mockResolvedValueOnce(JSON.stringify(item));

        const { result } = renderHook(() =>
          useOfflineQueue({ onItemProcessed })
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.dequeue('id1');
        });

        expect(onItemProcessed).toHaveBeenCalledWith(item);
      });
    });

    describe('markFailed', () => {
      it('increments retry count', async () => {
        const item: QueuedSubmission = {
          id: 'id1',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 1000,
          retryCount: 0,
        };

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1']))
          .mockResolvedValueOnce(JSON.stringify(item))
          .mockResolvedValueOnce(JSON.stringify(item)); // For markFailed

        const { result } = renderHook(() => useOfflineQueue());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.markFailed('id1', 'Network error');
        });

        // Should save with incremented retryCount
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'offline-queue:id1',
          expect.stringContaining('"retryCount":1')
        );
      });

      it('removes item after max retries and calls onItemFailed', async () => {
        const onItemFailed = jest.fn();
        const item: QueuedSubmission = {
          id: 'id1',
          type: 'habitUpdate',
          payload: {},
          queuedAt: 1000,
          retryCount: 4, // At 4, next failure will be 5th attempt
        };

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1']))
          .mockResolvedValueOnce(JSON.stringify(item))
          .mockResolvedValueOnce(JSON.stringify(item)) // For markFailed
          .mockResolvedValueOnce(JSON.stringify(['id1'])) // For dequeue
          .mockResolvedValueOnce(JSON.stringify(item));

        const { result } = renderHook(() =>
          useOfflineQueue({ maxRetries: 5, onItemFailed })
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.markFailed('id1', 'Final failure');
        });

        expect(onItemFailed).toHaveBeenCalledWith(item, expect.any(Error));
      });
    });

    describe('getRetryableItems', () => {
      it('returns items ready for retry', async () => {
        const now = Date.now();
        const items: QueuedSubmission[] = [
          {
            id: 'id1',
            type: 'habitUpdate',
            payload: {},
            queuedAt: now - 10000,
            retryCount: 0, // Never retried - ready
          },
          {
            id: 'id2',
            type: 'habitUpdate',
            payload: {},
            queuedAt: now - 10000,
            retryCount: 1,
            lastRetryAt: now - 5000, // 5s ago, needs 2s delay - ready
          },
          {
            id: 'id3',
            type: 'habitUpdate',
            payload: {},
            queuedAt: now - 10000,
            retryCount: 1,
            lastRetryAt: now - 500, // 0.5s ago, needs 2s delay - not ready
          },
        ];

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2', 'id3']))
          .mockResolvedValueOnce(JSON.stringify(items[0]))
          .mockResolvedValueOnce(JSON.stringify(items[1]))
          .mockResolvedValueOnce(JSON.stringify(items[2]));

        const { result } = renderHook(() => useOfflineQueue());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        // Need to reload for getRetryableItems
        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2', 'id3']))
          .mockResolvedValueOnce(JSON.stringify(items[0]))
          .mockResolvedValueOnce(JSON.stringify(items[1]))
          .mockResolvedValueOnce(JSON.stringify(items[2]));

        let retryable: QueuedSubmission[];
        await act(async () => {
          retryable = await result.current.getRetryableItems();
        });

        expect(retryable!).toHaveLength(2);
        expect(retryable![0].id).toBe('id1');
        expect(retryable![1].id).toBe('id2');
      });
    });

    describe('clearQueue', () => {
      it('removes all items from queue', async () => {
        const items: QueuedSubmission[] = [
          {
            id: 'id1',
            type: 'habitUpdate',
            payload: {},
            queuedAt: 1000,
            retryCount: 0,
          },
          {
            id: 'id2',
            type: 'habitUpdate',
            payload: {},
            queuedAt: 2000,
            retryCount: 0,
          },
        ];

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2']))
          .mockResolvedValueOnce(JSON.stringify(items[0]))
          .mockResolvedValueOnce(JSON.stringify(items[1]))
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2'])); // For clearQueue

        const { result } = renderHook(() => useOfflineQueue());

        await waitFor(() => {
          expect(result.current.queueCount).toBe(2);
        });

        await act(async () => {
          await result.current.clearQueue();
        });

        expect(result.current.queueCount).toBe(0);
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
          'offline-queue:id1'
        );
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
          'offline-queue:id2'
        );
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'offline-queue-index',
          JSON.stringify([])
        );
      });
    });

    describe('cleanupStaleItems', () => {
      it('removes items older than maxItemAgeMs', async () => {
        const now = Date.now();
        const items: QueuedSubmission[] = [
          {
            id: 'id1',
            type: 'habitUpdate',
            payload: {},
            queuedAt: now - 8 * 24 * 60 * 60 * 1000, // 8 days old - stale
            retryCount: 0,
          },
          {
            id: 'id2',
            type: 'habitUpdate',
            payload: {},
            queuedAt: now - 1000, // Just now - not stale
            retryCount: 0,
          },
        ];

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2']))
          .mockResolvedValueOnce(JSON.stringify(items[0]))
          .mockResolvedValueOnce(JSON.stringify(items[1]))
          // For cleanupStaleItems
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2']))
          .mockResolvedValueOnce(JSON.stringify(items[0]))
          .mockResolvedValueOnce(JSON.stringify(items[1]))
          // For dequeue
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2']))
          .mockResolvedValueOnce(JSON.stringify(items[0]));

        const { result } = renderHook(() =>
          useOfflineQueue({ maxItemAgeMs: 7 * 24 * 60 * 60 * 1000 })
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        let removedCount: number;
        await act(async () => {
          removedCount = await result.current.cleanupStaleItems();
        });

        expect(removedCount!).toBe(1);
      });
    });

    describe('getStats', () => {
      it('returns queue statistics', async () => {
        const items: QueuedSubmission[] = [
          {
            id: 'id1',
            type: 'habitUpdate',
            payload: {},
            queuedAt: 1000,
            retryCount: 0,
          },
          {
            id: 'id2',
            type: 'habitUpdate',
            payload: {},
            queuedAt: 2000,
            retryCount: 1,
          },
          {
            id: 'id3',
            type: 'habitUpdate',
            payload: {},
            queuedAt: 3000,
            retryCount: 0,
          },
        ];

        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2', 'id3']))
          .mockResolvedValueOnce(JSON.stringify(items[0]))
          .mockResolvedValueOnce(JSON.stringify(items[1]))
          .mockResolvedValueOnce(JSON.stringify(items[2]))
          // For getStats
          .mockResolvedValueOnce(JSON.stringify(['id1', 'id2', 'id3']))
          .mockResolvedValueOnce(JSON.stringify(items[0]))
          .mockResolvedValueOnce(JSON.stringify(items[1]))
          .mockResolvedValueOnce(JSON.stringify(items[2]));

        const { result } = renderHook(() => useOfflineQueue());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        let stats: Awaited<ReturnType<typeof result.current.getStats>>;
        await act(async () => {
          stats = await result.current.getStats();
        });

        expect(stats!.totalItems).toBe(3);
        expect(stats!.pendingItems).toBe(2);
        expect(stats!.failedItems).toBe(1);
        expect(stats!.byType.habitUpdate).toBe(3);
      });
    });
  });
});
