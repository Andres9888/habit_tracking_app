/**
 * Type definitions for the offline queue system
 */

/** Submission types supported by the offline queue */
export type OfflineSubmissionType = 'habitUpdate';

/** Base structure for all queued submissions */
export interface QueuedSubmission<T = unknown> {
  id: string;
  type: OfflineSubmissionType;
  payload: T;
  queuedAt: number;
  retryCount: number;
  lastError?: string;
  lastRetryAt?: number;
  habitId?: string;
  description?: string;
}

/** Habit update submission payload */
export interface HabitUpdatePayload {
  habitId: string;
  updates: Record<string, unknown>;
}

/** Queue statistics */
export interface QueueStats {
  totalItems: number;
  pendingItems: number;
  failedItems: number;
  byType: Record<OfflineSubmissionType, number>;
  oldestItemAt?: number;
}

/** Options for the offline queue hook */
export interface UseOfflineQueueOptions {
  maxQueueSize?: number;
  maxItemAgeMs?: number;
  maxRetries?: number;
  baseRetryDelayMs?: number;
  onItemProcessed?: (item: QueuedSubmission) => void;
  onItemFailed?: (item: QueuedSubmission, error: Error) => void;
  onQueueChange?: (stats: QueueStats) => void;
}

/** Return value from the useOfflineQueue hook */
export interface UseOfflineQueueReturn {
  enqueue: <T>(
    type: OfflineSubmissionType,
    payload: T,
    options?: { habitId?: string; description?: string }
  ) => Promise<string>;
  dequeue: (id: string) => Promise<void>;
  markFailed: (id: string, error: string) => Promise<void>;
  getQueue: () => Promise<QueuedSubmission[]>;
  getRetryableItems: () => Promise<QueuedSubmission[]>;
  getItem: (id: string) => Promise<QueuedSubmission | null>;
  clearQueue: () => Promise<void>;
  cleanupStaleItems: () => Promise<number>;
  getStats: () => Promise<QueueStats>;
  queueCount: number;
  hasQueuedItems: boolean;
  isLoading: boolean;
}
