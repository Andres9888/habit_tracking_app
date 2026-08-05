/**
 * Offline Queue Manager Types
 *
 * Types for the queue manager that orchestrates offline operations.
 */

import type {
  OfflineOperation,
  OfflineOperationType,
  OfflineQueueState,
  OfflineQueueStats,
  QueueEventCallback,
  QueueOperationOptions,
  QueueOperationResult,
} from '../queue';
import type { ErrorCategory } from '../types';
import type { BatchStatusResult } from './optimized/types';

/**
 * Configuration for the OfflineQueueManager
 */
export interface OfflineQueueManagerConfig {
  /** Auto-restore queue from storage on creation (default: false) */
  autoRestore?: boolean;
  /** Auto-persist queue changes to storage (default: true) */
  autoPersist?: boolean;
}

/**
 * Public API for the OfflineQueueManager
 */
export interface OfflineQueueManagerAPI {
  // State accessors
  /** Get the current queue state snapshot */
  getState(): OfflineQueueState;
  /** Get queue statistics */
  getStats(): OfflineQueueStats;

  // Operations (implemented in operations.ts - T006)
  /** Add an operation to the queue */
  enqueue<T extends OfflineOperationType>(
    type: T,
    payload: OfflineOperation<T>['payload'],
    options?: QueueOperationOptions
  ): QueueOperationResult;

  /** Get the next pending operation (FIFO) */
  peek(): OfflineOperation | undefined;

  /** Remove and return the next pending operation */
  dequeue(): OfflineOperation | undefined;

  /** Remove a specific operation by ID */
  remove(operationId: string): boolean;

  /** Clear all operations from the queue */
  clear(options?: { persist?: boolean }): void;

  // Status updates (implemented in status.ts - T007)
  /** Mark an operation as syncing */
  markSyncing(operationId: string): boolean;
  /** Mark an operation as completed */
  markCompleted(operationId: string): boolean;
  /** Mark an operation as failed */
  markFailed(
    operationId: string,
    error: string,
    category?: ErrorCategory,
    options?: { final?: boolean }
  ): boolean;
  /** Reset an operation to pending for retry */
  markPending(operationId: string): boolean;
  /**
   * Reset a failed operation for a fresh retry: sets status to pending,
   * clears retryCount and lastError so it isn't immediately re-exhausted.
   */
  resetForRetry(operationId: string): boolean;

  // Batch operations (optimized for 500+ operations - FR-011)
  /** Mark multiple operations as completed in a single update */
  markCompletedBatch(operationIds: string[]): BatchStatusResult;
  /** Mark multiple operations as failed in a single update */
  markFailedBatch(
    operationIds: string[],
    error: string,
    category?: ErrorCategory
  ): BatchStatusResult;
  /** Mark multiple operations as syncing in a single update */
  markSyncingBatch(operationIds: string[]): BatchStatusResult;
  /** Get multiple pending operations (FIFO order) */
  peekBatch(count: number): OfflineOperation[];
  /** Remove multiple operations by ID in a single update */
  removeBatch(operationIds: string[]): BatchStatusResult;

  // Persistence
  /** Restore queue from storage */
  restore(): Promise<void>;
  /** Persist current queue to storage */
  persist(): Promise<void>;

  // Event subscription
  /** Subscribe to queue events */
  subscribe(callback: QueueEventCallback): () => void;

  // State subscription (for React useSyncExternalStore)
  /** Subscribe to state changes (for React integration) */
  subscribeToState(callback: QueueStateListener): () => void;
}

/**
 * Internal state listener type
 */
export type QueueStateListener = () => void;

// Re-export types used by this module
export type {
  OfflineOperation,
  OfflineOperationType,
  OfflineQueueState,
  OfflineQueueStats,
  QueueEvent,
  QueueEventCallback,
  QueueOperationOptions,
  QueueOperationResult,
  ReorderHabitsPayload,
  ToggleCompletionPayload,
} from '../queue';
