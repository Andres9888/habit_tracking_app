/**
 * Offline Queue State Types
 *
 * Types for the complete queue state and persistence.
 */

import type { OfflineOperation } from './types';

/**
 * Offline queue state
 *
 * Represents the complete state of the offline operation queue.
 * This structure is persisted to AsyncStorage for durability.
 */
export interface OfflineQueueState {
  /** Version number for schema migrations */
  version: number;

  /** Ordered list of operations (FIFO - first in, first out) */
  operations: OfflineOperation[];

  /** Timestamp of last successful full sync */
  lastSyncCompletedAt?: number;

  /** Timestamp of queue creation */
  createdAt: number;

  /** Timestamp of last modification */
  updatedAt: number;
}

/**
 * Current version of the offline queue schema
 * Increment when making breaking changes to the structure
 */
export const OFFLINE_QUEUE_VERSION = 1;

/**
 * Default empty queue state
 */
export const DEFAULT_QUEUE_STATE: OfflineQueueState = {
  createdAt: 0,
  operations: [],
  updatedAt: 0,
  version: OFFLINE_QUEUE_VERSION,
};

/**
 * Queue statistics for monitoring and debugging
 */
export interface OfflineQueueStats {
  /** Total operations in queue */
  totalCount: number;

  /** Operations by status */
  pendingCount: number;
  syncingCount: number;
  failedCount: number;

  /** Oldest pending operation timestamp */
  oldestPendingAt?: number;

  /** Queue health indicator */
  isHealthy: boolean;

  /** Warning if queue is getting large */
  warning?: string;
}

/**
 * Queue size thresholds for warnings/limits
 */
export const QUEUE_THRESHOLDS = {
  /** Batch size for processing operations */
  BATCH_SIZE: 10,

  /** Maximum queue size before dropping old operations */
  MAX_SIZE: 500,

  /** Warn when queue exceeds this size */
  WARNING_SIZE: 100,
} as const;
