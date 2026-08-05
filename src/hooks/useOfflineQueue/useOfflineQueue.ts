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
