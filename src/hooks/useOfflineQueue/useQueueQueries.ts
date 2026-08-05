/**
 * Queue query operations (getQueue, getRetryableItems, getItem, getStats, clearQueue, cleanupStaleItems)
 */

import { useCallback, MutableRefObject } from 'react';
import {
  loadQueueIndex,
  saveQueueIndex,
  loadQueueItem,
  removeQueueItem,
  loadAllQueueItems,
} from './storage';
import {
  calculateRetryDelay,
  calculateQueueStats,
  createEmptyQueueStats,
} from './utils';
import type { QueuedSubmission, QueueStats } from './types';

interface UseQueueQueriesProps {
  baseRetryDelayMs: number;
  maxItemAgeMs: number;
  isMountedRef: MutableRefObject<boolean>;
  setQueueCount: (count: number) => void;
  onQueueChange?: (stats: QueueStats) => void;
  dequeue: (id: string) => Promise<void>;
}

export function useQueueQueries({
  baseRetryDelayMs,
  maxItemAgeMs,
  isMountedRef,
  setQueueCount,
  onQueueChange,
  dequeue,
}: UseQueueQueriesProps) {
  const getQueue = useCallback(() => loadAllQueueItems(), []);

  const getRetryableItems = useCallback(async (): Promise<
    QueuedSubmission[]
  > => {
    const items = await loadAllQueueItems();
    const now = Date.now();
    return items.filter((item) => {
      if (!item.lastRetryAt) return true;
      return (
        now - item.lastRetryAt >=
        calculateRetryDelay(item.retryCount, baseRetryDelayMs)
      );
    });
  }, [baseRetryDelayMs]);

  const getItem = useCallback((id: string) => loadQueueItem(id), []);

  const clearQueue = useCallback(async (): Promise<void> => {
    const ids = await loadQueueIndex();
    await Promise.all(ids.map((id) => removeQueueItem(id)));
    await saveQueueIndex([]);
    if (isMountedRef.current) {
      setQueueCount(0);
      onQueueChange?.(createEmptyQueueStats());
    }
  }, [isMountedRef, setQueueCount, onQueueChange]);

  const cleanupStaleItems = useCallback(async (): Promise<number> => {
    const items = await loadAllQueueItems();
    const now = Date.now();
    let removedCount = 0;
    for (const item of items) {
      if (now - item.queuedAt > maxItemAgeMs) {
        await dequeue(item.id);
        removedCount++;
      }
    }
    return removedCount;
  }, [maxItemAgeMs, dequeue]);

  const getStats = useCallback(
    async () => calculateQueueStats(await loadAllQueueItems()),
    []
  );

  return {
    cleanupStaleItems,
    clearQueue,
    getItem,
    getQueue,
    getRetryableItems,
    getStats,
  };
}
