/**
 * Single Operation Processing
 *
 * Handles processing a single offline operation, including
 * sync execution, status updates, and error handling.
 */

import type { OfflineOperation, ToggleCompletionPayload } from '../../queue';
import type { SyncItem } from '../../syncManager';
import type {
  ProcessOperationResult,
  QueueProcessorDeps,
  ProcessSingleOptions,
} from './types';

/**
 * Convert an offline operation to a sync item
 */
export function operationToSyncItem(
  operation: OfflineOperation
): SyncItem<ToggleCompletionPayload> {
  return {
    id: operation.id,
    payload: operation.payload,
    retryContext: {
      attemptCount: operation.retryCount,
      exhausted: false,
    },
    type: operation.type,
  };
}

/**
 * Check if an operation should be skipped
 */
export function shouldSkipOperation(
  operation: OfflineOperation,
  deps: QueueProcessorDeps
): { skip: boolean; reason?: string } {
  // Only process pending operations
  if (operation.status !== 'pending') {
    return { reason: `status is ${operation.status}`, skip: true };
  }

  // Check circuit breaker
  if (!deps.syncManager.canSync()) {
    return { reason: 'circuit breaker open', skip: true };
  }

  return { skip: false };
}

/**
 * Process a single operation with the sync manager
 */
export async function processSingleOperation(
  operation: OfflineOperation,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions
): Promise<ProcessOperationResult> {
  const startTime = Date.now();
  const { queueManager, syncManager, executor } = deps;
  const { callbacks } = options;

  // Check if operation should be skipped
  const skipCheck = shouldSkipOperation(operation, deps);
  if (skipCheck.skip) {
    callbacks?.onSkipped?.(operation, skipCheck.reason ?? 'unknown');
    return {
      durationMs: Date.now() - startTime,
      error: skipCheck.reason,
      operationId: operation.id,
      shouldRetry: true, // Will be retried in next batch
      success: false,
    };
  }

  // Mark as syncing
  queueManager.markSyncing(operation.id);

  // Convert to sync item and execute
  const syncItem = operationToSyncItem(operation);

  try {
    const result = await syncManager.syncItem(syncItem, async (item) => {
      await executor(item.payload);
    });

    if (result.success) {
      // Mark completed and remove from queue
      queueManager.markCompleted(operation.id);
      callbacks?.onSuccess?.(operation);

      return {
        durationMs: Date.now() - startTime,
        operationId: operation.id,
        shouldRetry: false,
        success: true,
      };
    } else {
      // Check if retries exhausted
      const exhausted = result.item.retryContext.exhausted;
      const errorMsg = result.error?.message ?? 'Sync failed';

      if (exhausted) {
        queueManager.markFailed(operation.id, errorMsg, result.error?.category);
        callbacks?.onFailure?.(operation, errorMsg);
      } else {
        // Reset to pending for retry
        queueManager.markPending(operation.id);
      }

      return {
        durationMs: Date.now() - startTime,
        error: errorMsg,
        operationId: operation.id,
        shouldRetry: !exhausted,
        success: false,
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    // On unexpected error, mark pending for retry
    queueManager.markPending(operation.id);
    callbacks?.onFailure?.(operation, errorMsg);

    return {
      durationMs: Date.now() - startTime,
      error: errorMsg,
      operationId: operation.id,
      shouldRetry: true,
      success: false,
    };
  }
}
