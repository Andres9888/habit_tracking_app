/**
 * Utility functions for the offline queue system
 */

import { QUEUE_ITEM_PREFIX, DEFAULT_BASE_RETRY_DELAY_MS } from './constants';
import type {
  QueuedSubmission,
  QueueStats,
  OfflineSubmissionType,
} from './types';

/** Generate a unique ID for a submission */
export function generateSubmissionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Get storage key for an item */
export function getItemKey(id: string): string {
  return `${QUEUE_ITEM_PREFIX}${id}`;
}

/** Calculate retry delay with exponential backoff */
export function calculateRetryDelay(
  retryCount: number,
  baseDelayMs: number = DEFAULT_BASE_RETRY_DELAY_MS
): number {
  const delay = baseDelayMs * Math.pow(2, retryCount);
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.floor(delay + jitter);
}

/** Calculate queue statistics from items */
export function calculateQueueStats(items: QueuedSubmission[]): QueueStats {
  const byType: Record<OfflineSubmissionType, number> = {
    habitUpdate: 0,
  };

  let pendingItems = 0;
  let failedItems = 0;
  let oldestItemAt: number | undefined;

  for (const item of items) {
    byType[item.type]++;

    if (item.retryCount === 0) {
      pendingItems++;
    } else {
      failedItems++;
    }

    if (!oldestItemAt || item.queuedAt < oldestItemAt) {
      oldestItemAt = item.queuedAt;
    }
  }

  return {
    byType,
    failedItems,
    oldestItemAt,
    pendingItems,
    totalItems: items.length,
  };
}

/** Create empty queue stats */
export function createEmptyQueueStats(): QueueStats {
  return {
    byType: {
      habitUpdate: 0,
    },
    failedItems: 0,
    pendingItems: 0,
    totalItems: 0,
  };
}
