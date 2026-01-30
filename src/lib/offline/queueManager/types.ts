/**
 * Offline Queue Manager Types
 *
 * Types for the queue manager that orchestrates offline operations.
 */

import type {
  OfflineOperation,
  OfflineQueueState,
  OfflineQueueStats,
  QueueEventCallback,
  QueueOperationOptions,
  QueueOperationResult,
  ToggleCompletionPayload,
} from '../queue';

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
  /** Add a toggle completion operation to the queue */
  enqueue(
    type: 'toggleCompletion',
    payload: ToggleCompletionPayload,
    options?: QueueOperationOptions
  ): QueueOperationResult;

  /** Get the next pending operation (FIFO) */
  peek(): OfflineOperation | undefined;

  /** Remove and return the next pending operation */
  dequeue(): OfflineOperation | undefined;

  /** Remove a specific operation by ID */
  remove(operationId: string): boolean;

  /** Clear all operations from the queue */
  clear(): void;

  // Status updates (implemented in status.ts - T007)
  /** Mark an operation as syncing */
  markSyncing(operationId: string): boolean;
  /** Mark an operation as completed */
  markCompleted(operationId: string): boolean;
  /** Mark an operation as failed */
  markFailed(operationId: string, error: string, category?: string): boolean;
  /** Reset an operation to pending for retry */
  markPending(operationId: string): boolean;

  // Persistence
  /** Restore queue from storage */
  restore(): Promise<void>;
  /** Persist current queue to storage */
  persist(): Promise<void>;

  // Event subscription
  /** Subscribe to queue events */
  subscribe(callback: QueueEventCallback): () => void;
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
  ToggleCompletionPayload,
} from '../queue';
