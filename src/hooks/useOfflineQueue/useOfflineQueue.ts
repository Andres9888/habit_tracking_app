/**
 * useOfflineQueue Hook
 * Offline queue for submissions when network unavailable
 */

import { useState, useEffect, useRef } from 'react';
import {
  DEFAULT_MAX_QUEUE_SIZE,
  DEFAULT_MAX_ITEM_AGE_MS,
  DEFAULT_MAX_RETRIES,
  DEFAULT_BASE_RETRY_DELAY_MS,
} from './constants';
import { loadAllQueueItems } from './storage';
import { calculateQueueStats } from './utils';
import { useQueueOperations } from './useQueueOperations';
import { useQueueQueries } from './useQueueQueries';
import type { UseOfflineQueueOptions, UseOfflineQueueReturn } from './types';

/**
 * Hook for managing an offline-first queue for deferred operations.
 * Stores operations in AsyncStorage when offline, retries with exponential backoff.
 *
 * @description
 * Use this hook to build resilient offline-first features:
 * - Queue mutations when network is unavailable
 * - Automatic retry with exponential backoff
 * - Persistent storage survives app restarts
 * - Age-based cleanup of stale items
 * - Configurable queue size limits
 * - Statistics and monitoring callbacks
 *
 * Queue lifecycle:
 * 1. enqueue() - Add operation to queue
 * 2. Auto retry on network reconnect
 * 3. Success → dequeue() + onItemProcessed callback
 * 4. Failure after max retries → onItemFailed callback
 * 5. Stale items (older than maxItemAgeMs) → auto cleanup
 *
 * Retry strategy:
 * - Exponential backoff: baseDelay * 2^attemptCount
 * - Default: 1s, 2s, 4s, 8s, 16s...
 * - Max retries: Configurable (default: 5)
 *
 * @param options - Configuration options
 * @param options.maxQueueSize - Maximum items in queue (default: 100)
 * @param options.maxItemAgeMs - Max age before cleanup (default: 7 days)
 * @param options.maxRetries - Max retry attempts per item (default: 5)
 * @param options.baseRetryDelayMs - Base delay for exponential backoff (default: 1000)
 * @param options.onItemProcessed - Callback when item succeeds
 * @param options.onItemFailed - Callback when item exhausts retries
 * @param options.onQueueChange - Callback when queue stats change
 * @returns Object with queue operations and queries
 *
 * @example
 * ```tsx
 * function OfflineHabitToggle({ habitId }) {
 *   const {
 *     enqueue,
 *     queueCount,
 *     processRetryableItems
 *   } = useOfflineQueue({
 *     maxRetries: 3,
 *     onItemProcessed: (item) => {
 *       toast.success('Synced!');
 *     },
 *     onItemFailed: (item, error) => {
 *       toast.error('Failed to sync after 3 retries');
 *     }
 *   });
 *
 *   const toggleHabit = async () => {
 *     try {
 *       if (isOnline) {
 *         await mutation({ habitId });
 *       } else {
 *         await enqueue({
 *           type: 'TOGGLE_HABIT',
 *           payload: { habitId },
 *           timestamp: Date.now()
 *         });
 *         toast.info('Will sync when back online');
 *       }
 *     } catch (error) {
 *       await enqueue(...); // Fallback to queue on error
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Button onPress={toggleHabit}>Toggle</Button>
 *       {queueCount > 0 && <Text>{queueCount} pending</Text>}
 *     </View>
 *   );
 * }
 * ```
 */
export function useOfflineQueue({
  maxQueueSize = DEFAULT_MAX_QUEUE_SIZE,
  maxItemAgeMs = DEFAULT_MAX_ITEM_AGE_MS,
  maxRetries = DEFAULT_MAX_RETRIES,
  baseRetryDelayMs = DEFAULT_BASE_RETRY_DELAY_MS,
  onItemProcessed,
  onItemFailed,
  onQueueChange,
}: UseOfflineQueueOptions = {}): UseOfflineQueueReturn {
  const [queueCount, setQueueCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const items = await loadAllQueueItems();
        if (isMountedRef.current) {
          setQueueCount(items.length);
          setIsLoading(false);
          onQueueChange?.(calculateQueueStats(items));
        }
      } catch {
        if (isMountedRef.current) setIsLoading(false);
      }
    };
    void loadQueue();
    return () => {
      isMountedRef.current = false;
    };
  }, [onQueueChange]);

  const { enqueue, dequeue, markFailed } = useQueueOperations({
    isMountedRef,
    maxQueueSize,
    maxRetries,
    onItemFailed,
    onItemProcessed,
    onQueueChange,
    setQueueCount,
  });

  const {
    getQueue,
    getRetryableItems,
    getItem,
    clearQueue,
    cleanupStaleItems,
    getStats,
  } = useQueueQueries({
    baseRetryDelayMs,
    dequeue,
    isMountedRef,
    maxItemAgeMs,
    onQueueChange,
    setQueueCount,
  });

  return {
    cleanupStaleItems,
    clearQueue,
    dequeue,
    enqueue,
    getItem,
    getQueue,
    getRetryableItems,
    getStats,
    hasQueuedItems: queueCount > 0,
    isLoading,
    markFailed,
    queueCount,
  };
}

export default useOfflineQueue;
