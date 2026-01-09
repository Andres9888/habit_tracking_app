/**
 * Queue operations (enqueue, dequeue, markFailed)
 */

import { useCallback } from 'react';
import {
  loadQueueIndex,
  saveQueueIndex,
  loadQueueItem,
  saveQueueItem,
  removeQueueItem,
  loadAllQueueItems,
} from './storage';
import { generateSubmissionId, calculateQueueStats } from './utils';
import type { OfflineSubmissionType, QueuedSubmission } from './types';
import type { UseQueueOperationsProps } from './useQueueOperations.types';

export function useQueueOperations({
  maxQueueSize,
  maxRetries,
  isMountedRef,
  setQueueCount,
  onItemProcessed,
  onItemFailed,
  onQueueChange,
}: UseQueueOperationsProps) {
  const enqueue = useCallback(
    async <T>(
      type: OfflineSubmissionType,
      payload: T,
      options?: { habitId?: string; description?: string }
    ): Promise<string> => {
      const ids = await loadQueueIndex();
      if (ids.length >= maxQueueSize) {
        throw new Error(
          `Queue is full (${maxQueueSize} items). Please wait for items to sync.`
        );
      }
      const id = generateSubmissionId();
      const item: QueuedSubmission<T> = {
        description: options?.description,
        habitId: options?.habitId,
        id,
        payload,
        queuedAt: Date.now(),
        retryCount: 0,
        type,
      };
      await saveQueueItem(item as QueuedSubmission);
      ids.push(id);
      await saveQueueIndex(ids);
      if (isMountedRef.current) {
        setQueueCount(ids.length);
        if (onQueueChange) {
          onQueueChange(calculateQueueStats(await loadAllQueueItems()));
        }
      }
      return id;
    },
    [maxQueueSize, isMountedRef, setQueueCount, onQueueChange]
  );

  const dequeue = useCallback(
    async (id: string): Promise<void> => {
      const ids = await loadQueueIndex();
      const newIds = ids.filter((i) => i !== id);
      const item = await loadQueueItem(id);
      await removeQueueItem(id);
      await saveQueueIndex(newIds);
      if (isMountedRef.current) {
        setQueueCount(newIds.length);
        if (item) onItemProcessed?.(item);
        if (onQueueChange) {
          onQueueChange(calculateQueueStats(await loadAllQueueItems()));
        }
      }
    },
    [isMountedRef, setQueueCount, onItemProcessed, onQueueChange]
  );

  const markFailed = useCallback(
    async (id: string, error: string): Promise<void> => {
      const item = await loadQueueItem(id);
      if (!item) return;
      const newRetryCount = item.retryCount + 1;
      if (newRetryCount >= maxRetries) {
        await dequeue(id);
        onItemFailed?.(item, new Error(error));
        return;
      }
      await saveQueueItem({
        ...item,
        lastError: error,
        lastRetryAt: Date.now(),
        retryCount: newRetryCount,
      });
      if (onQueueChange) {
        onQueueChange(calculateQueueStats(await loadAllQueueItems()));
      }
    },
    [maxRetries, dequeue, onItemFailed, onQueueChange]
  );

  return { dequeue, enqueue, markFailed };
}
