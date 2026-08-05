/**
 * Offline Queue Hook Types
 *
 * Types for the useOfflineQueue React hook that provides
 * access to the offline queue manager's state and operations.
 */

import type {
  OfflineOperation,
  OfflineQueueStats,
  QueueEvent,
  QueueOperationOptions,
  QueueOperationResult,
  ToggleCompletionPayload,
} from '../queue';
import type { ErrorCategory } from '../types';

/**
 * Return type for the useOfflineQueue hook
 */
export interface UseOfflineQueueReturn {
  // State
  /** Current list of operations in the queue */
  operations: OfflineOperation[];
  /** Queue statistics (counts, health status) */
  stats: OfflineQueueStats;
  /** Whether the queue has any pending or syncing operations */
  hasPendingOperations: boolean;
  /** Whether the queue is currently empty */
  isEmpty: boolean;

  // Actions
  /** Add a toggle completion operation to the queue */
  enqueue: (
    payload: ToggleCompletionPayload,
    options?: QueueOperationOptions
  ) => QueueOperationResult;
  /** Mark an operation as completed (removes from queue) */
  markCompleted: (operationId: string) => boolean;
  /** Mark an operation as failed */
  markFailed: (
    operationId: string,
    error: string,
    category?: ErrorCategory
  ) => boolean;
  /** Clear all operations from the queue */
  clear: () => void;

  // Events
  /** Subscribe to queue events */
  subscribe: (callback: (event: QueueEvent) => void) => () => void;
}

/**
 * Options for the useOfflineQueue hook
 */
export interface UseOfflineQueueOptions {
  /** Custom queue manager instance (defaults to singleton) */
  manager?: {
    getState: () => { operations: OfflineOperation[] };
    getStats: () => OfflineQueueStats;
    subscribeToState: (callback: () => void) => () => void;
    subscribe: (callback: (event: QueueEvent) => void) => () => void;
    enqueue: (
      type: 'toggleCompletion',
      payload: ToggleCompletionPayload,
      options?: QueueOperationOptions
    ) => QueueOperationResult;
    markCompleted: (operationId: string) => boolean;
    markFailed: (
      operationId: string,
      error: string,
      category?: ErrorCategory
    ) => boolean;
    clear: () => void;
  };
}
