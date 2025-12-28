/**
 * useOfflineQueue Hook
 * Offline queue for submissions when network unavailable
 *
 * Part of Edge Case handling: Data Loss Prevention
 *
 * Features:
 * - AsyncStorage-based queue persistence
 * - Automatic retry when network restored
 * - Support for all motivation system submission types
 * - Exponential backoff for failed retries
 * - Queue size limits and stale item cleanup
 *
 * Storage Key Pattern: `offline-queue:<id>`
 * Queue Index Key: `offline-queue-index`
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Submission types supported by the offline queue
 */
export type OfflineSubmissionType =
  | 'reflection'
  | 'letter'
  | 'voiceNote'
  | 'visionBoardImage'
  | 'affirmation'
  | 'habitUpdate';

/**
 * Base structure for all queued submissions
 */
export interface QueuedSubmission<T = unknown> {
  /** Unique identifier for this submission */
  id: string;
  /** Type of submission */
  type: OfflineSubmissionType;
  /** The payload to submit */
  payload: T;
  /** Timestamp when queued */
  queuedAt: number;
  /** Number of retry attempts */
  retryCount: number;
  /** Last error message if any */
  lastError?: string;
  /** Timestamp of last retry attempt */
  lastRetryAt?: number;
  /** Related habit ID for display purposes */
  habitId?: string;
  /** Human-readable description for UI */
  description?: string;
}

/**
 * Payload types for each submission type
 */
export interface ReflectionPayload {
  habitId: string;
  date: string;
  emoji: 'frustrated' | 'neutral' | 'happy' | 'fire';
  note?: string;
}

export interface LetterPayload {
  habitId: string;
  content: string;
  unlockDays: number;
  title?: string;
}

export interface VoiceNotePayload {
  habitId: string;
  audioUrl: string;
  duration: number;
  label?: string;
  isDay1?: boolean;
}

export interface VisionBoardImagePayload {
  habitId: string;
  storageId: string;
  caption?: string;
  order?: number;
}

export interface AffirmationPayload {
  habitId: string;
  text: string;
  type?: 'identity' | 'motivational' | 'instructional';
}

export interface HabitUpdatePayload {
  habitId: string;
  updates: Record<string, unknown>;
}

/**
 * Queue statistics
 */
export interface QueueStats {
  /** Total items in queue */
  totalItems: number;
  /** Items pending first attempt */
  pendingItems: number;
  /** Items that have failed at least once */
  failedItems: number;
  /** Items by type */
  byType: Record<OfflineSubmissionType, number>;
  /** Oldest item timestamp */
  oldestItemAt?: number;
}

/**
 * Options for the offline queue hook
 */
export interface UseOfflineQueueOptions {
  /** Maximum number of items in queue (default: 50) */
  maxQueueSize?: number;
  /** Maximum age of items in ms before cleanup (default: 7 days) */
  maxItemAgeMs?: number;
  /** Maximum retry attempts before giving up (default: 5) */
  maxRetries?: number;
  /** Base delay for exponential backoff in ms (default: 1000) */
  baseRetryDelayMs?: number;
  /** Callback when an item is successfully processed */
  onItemProcessed?: (item: QueuedSubmission) => void;
  /** Callback when an item fails permanently */
  onItemFailed?: (item: QueuedSubmission, error: Error) => void;
  /** Callback when queue changes */
  onQueueChange?: (stats: QueueStats) => void;
}

/**
 * Return value from the hook
 */
export interface UseOfflineQueueReturn {
  /** Add an item to the queue */
  enqueue: <T>(
    type: OfflineSubmissionType,
    payload: T,
    options?: {
      habitId?: string;
      description?: string;
    }
  ) => Promise<string>;
  /** Remove an item from the queue (after successful submission) */
  dequeue: (id: string) => Promise<void>;
  /** Mark an item as failed with error */
  markFailed: (id: string, error: string) => Promise<void>;
  /** Get all items in the queue */
  getQueue: () => Promise<QueuedSubmission[]>;
  /** Get items ready for retry */
  getRetryableItems: () => Promise<QueuedSubmission[]>;
  /** Get a specific item */
  getItem: (id: string) => Promise<QueuedSubmission | null>;
  /** Clear all items from the queue */
  clearQueue: () => Promise<void>;
  /** Remove stale items from the queue */
  cleanupStaleItems: () => Promise<number>;
  /** Get queue statistics */
  getStats: () => Promise<QueueStats>;
  /** Current queue count */
  queueCount: number;
  /** Whether queue has items */
  hasQueuedItems: boolean;
  /** Whether the queue is loading */
  isLoading: boolean;
}

// Storage keys
const QUEUE_INDEX_KEY = 'offline-queue-index';
const QUEUE_ITEM_PREFIX = 'offline-queue:';

// Default values
const DEFAULT_MAX_QUEUE_SIZE = 50;
const DEFAULT_MAX_ITEM_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_BASE_RETRY_DELAY_MS = 1000;

/**
 * Generate a unique ID for a submission
 */
export function generateSubmissionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get storage key for an item
 */
export function getItemKey(id: string): string {
  return `${QUEUE_ITEM_PREFIX}${id}`;
}

/**
 * Calculate retry delay with exponential backoff
 */
export function calculateRetryDelay(
  retryCount: number,
  baseDelayMs: number = DEFAULT_BASE_RETRY_DELAY_MS
): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
  const delay = baseDelayMs * Math.pow(2, retryCount);
  // Add jitter (±25%) to prevent thundering herd
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.floor(delay + jitter);
}

/**
 * Load the queue index from storage
 */
export async function loadQueueIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (error) {
    console.warn('Failed to load queue index:', error);
    return [];
  }
}

/**
 * Save the queue index to storage
 */
export async function saveQueueIndex(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_INDEX_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn('Failed to save queue index:', error);
    throw error;
  }
}

/**
 * Load a single item from storage
 */
export async function loadQueueItem(
  id: string
): Promise<QueuedSubmission | null> {
  try {
    const key = getItemKey(id);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as QueuedSubmission;
  } catch (error) {
    console.warn(`Failed to load queue item ${id}:`, error);
    return null;
  }
}

/**
 * Save a single item to storage
 */
export async function saveQueueItem(item: QueuedSubmission): Promise<void> {
  try {
    const key = getItemKey(item.id);
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn(`Failed to save queue item ${item.id}:`, error);
    throw error;
  }
}

/**
 * Remove a single item from storage
 */
export async function removeQueueItem(id: string): Promise<void> {
  try {
    const key = getItemKey(id);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove queue item ${id}:`, error);
  }
}

/**
 * Load all items from the queue
 */
export async function loadAllQueueItems(): Promise<QueuedSubmission[]> {
  const ids = await loadQueueIndex();
  const items: QueuedSubmission[] = [];

  for (const id of ids) {
    const item = await loadQueueItem(id);
    if (item) {
      items.push(item);
    }
  }

  // Sort by queuedAt (oldest first)
  return items.sort((a, b) => a.queuedAt - b.queuedAt);
}

/**
 * Calculate queue statistics
 */
export function calculateQueueStats(items: QueuedSubmission[]): QueueStats {
  const byType: Record<OfflineSubmissionType, number> = {
    reflection: 0,
    letter: 0,
    voiceNote: 0,
    visionBoardImage: 0,
    affirmation: 0,
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
    totalItems: items.length,
    pendingItems,
    failedItems,
    byType,
    oldestItemAt,
  };
}

/**
 * useOfflineQueue Hook
 *
 * Manages an offline queue for submissions that couldn't be sent due to
 * network unavailability. Persists to AsyncStorage and provides retry
 * functionality with exponential backoff.
 *
 * @example
 * ```tsx
 * const { enqueue, dequeue, hasQueuedItems } = useOfflineQueue({
 *   onItemProcessed: (item) => console.log('Processed:', item.id),
 *   onItemFailed: (item, error) => console.error('Failed:', item.id, error),
 * });
 *
 * // When offline, queue the submission
 * if (!isOnline) {
 *   await enqueue('reflection', { habitId, date, emoji }, {
 *     habitId,
 *     description: 'Reflection for today',
 *   });
 * }
 *
 * // When processing succeeds
 * await dequeue(item.id);
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

  // Track mounted state for async operations
  const isMountedRef = useRef(true);

  // Load queue on mount
  useEffect(() => {
    const loadQueue = async () => {
      try {
        const items = await loadAllQueueItems();
        if (isMountedRef.current) {
          setQueueCount(items.length);
          setIsLoading(false);

          if (onQueueChange) {
            onQueueChange(calculateQueueStats(items));
          }
        }
      } catch (error) {
        console.warn('Failed to load offline queue:', error);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    void loadQueue();

    return () => {
      isMountedRef.current = false;
    };
  }, [onQueueChange]);

  // Enqueue a new item
  const enqueue = useCallback(
    async <T>(
      type: OfflineSubmissionType,
      payload: T,
      options?: {
        habitId?: string;
        description?: string;
      }
    ): Promise<string> => {
      const ids = await loadQueueIndex();

      // Check queue size limit
      if (ids.length >= maxQueueSize) {
        throw new Error(
          `Queue is full (${maxQueueSize} items). Please wait for items to sync.`
        );
      }

      const id = generateSubmissionId();
      const item: QueuedSubmission<T> = {
        id,
        type,
        payload,
        queuedAt: Date.now(),
        retryCount: 0,
        habitId: options?.habitId,
        description: options?.description,
      };

      // Save item
      await saveQueueItem(item as QueuedSubmission);

      // Update index
      ids.push(id);
      await saveQueueIndex(ids);

      // Update state
      if (isMountedRef.current) {
        setQueueCount(ids.length);

        if (onQueueChange) {
          const items = await loadAllQueueItems();
          onQueueChange(calculateQueueStats(items));
        }
      }

      return id;
    },
    [maxQueueSize, onQueueChange]
  );

  // Dequeue an item (after successful processing)
  const dequeue = useCallback(
    async (id: string): Promise<void> => {
      const ids = await loadQueueIndex();
      const newIds = ids.filter((i) => i !== id);

      // Get item for callback before removal
      const item = await loadQueueItem(id);

      // Remove item
      await removeQueueItem(id);
      await saveQueueIndex(newIds);

      // Update state
      if (isMountedRef.current) {
        setQueueCount(newIds.length);

        if (item && onItemProcessed) {
          onItemProcessed(item);
        }

        if (onQueueChange) {
          const items = await loadAllQueueItems();
          onQueueChange(calculateQueueStats(items));
        }
      }
    },
    [onItemProcessed, onQueueChange]
  );

  // Mark an item as failed
  const markFailed = useCallback(
    async (id: string, error: string): Promise<void> => {
      const item = await loadQueueItem(id);
      if (!item) return;

      const newRetryCount = item.retryCount + 1;

      // Check if we've exceeded max retries
      if (newRetryCount >= maxRetries) {
        // Remove from queue and notify
        await dequeue(id);
        if (onItemFailed) {
          onItemFailed(item, new Error(error));
        }
        return;
      }

      // Update item with failure info
      const updatedItem: QueuedSubmission = {
        ...item,
        retryCount: newRetryCount,
        lastError: error,
        lastRetryAt: Date.now(),
      };

      await saveQueueItem(updatedItem);

      // Update stats
      if (onQueueChange) {
        const items = await loadAllQueueItems();
        onQueueChange(calculateQueueStats(items));
      }
    },
    [maxRetries, dequeue, onItemFailed, onQueueChange]
  );

  // Get all items in queue
  const getQueue = useCallback(async (): Promise<QueuedSubmission[]> => {
    return await loadAllQueueItems();
  }, []);

  // Get items ready for retry
  const getRetryableItems = useCallback(async (): Promise<QueuedSubmission[]> => {
    const items = await loadAllQueueItems();
    const now = Date.now();

    return items.filter((item) => {
      // If never retried, it's ready
      if (!item.lastRetryAt) return true;

      // Check if enough time has passed since last retry
      const requiredDelay = calculateRetryDelay(item.retryCount, baseRetryDelayMs);
      const timeSinceLastRetry = now - item.lastRetryAt;

      return timeSinceLastRetry >= requiredDelay;
    });
  }, [baseRetryDelayMs]);

  // Get a specific item
  const getItem = useCallback(
    async (id: string): Promise<QueuedSubmission | null> => {
      return await loadQueueItem(id);
    },
    []
  );

  // Clear all items
  const clearQueue = useCallback(async (): Promise<void> => {
    const ids = await loadQueueIndex();

    // Remove all items
    for (const id of ids) {
      await removeQueueItem(id);
    }

    // Clear index
    await saveQueueIndex([]);

    // Update state
    if (isMountedRef.current) {
      setQueueCount(0);

      if (onQueueChange) {
        onQueueChange({
          totalItems: 0,
          pendingItems: 0,
          failedItems: 0,
          byType: {
            reflection: 0,
            letter: 0,
            voiceNote: 0,
            visionBoardImage: 0,
            affirmation: 0,
            habitUpdate: 0,
          },
        });
      }
    }
  }, [onQueueChange]);

  // Cleanup stale items
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

  // Get queue statistics
  const getStats = useCallback(async (): Promise<QueueStats> => {
    const items = await loadAllQueueItems();
    return calculateQueueStats(items);
  }, []);

  return {
    enqueue,
    dequeue,
    markFailed,
    getQueue,
    getRetryableItems,
    getItem,
    clearQueue,
    cleanupStaleItems,
    getStats,
    queueCount,
    hasQueuedItems: queueCount > 0,
    isLoading,
  };
}

export default useOfflineQueue;
