/**
 * Execute Sync - Core Sync Execution
 *
 * Handles the actual sync execution for offline operations.
 */

import type { OfflineOperation } from '../../queue';
import type { SyncItem } from '../../syncManager';
import type {
  ProcessOperationResult,
  QueueProcessorDeps,
  ProcessSingleOptions,
} from './types';
import type { ErrorCategory } from '../../types';

/** Convert an offline operation to a sync item */
export function operationToSyncItem(
  operation: OfflineOperation
): SyncItem<OfflineOperation> {
  return {
    id: operation.id,
    payload: operation,
    retryContext: { attemptCount: operation.retryCount, exhausted: false },
    type: operation.type,
  };
}

/** Execute sync for an operation */
export async function executeSync(
  operation: OfflineOperation,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions,
  startTime: number
): Promise<ProcessOperationResult> {
  const { queueManager, syncManager, executor } = deps;
  const { callbacks } = options;

  queueManager.markSyncing(operation.id);
  const syncItem = operationToSyncItem(operation);

  try {
    const result = await syncManager.syncItem(syncItem, async (item) => {
      await executor(item.payload);
    });

    if (result.success) {
      queueManager.markCompleted(operation.id);
      callbacks?.onSuccess?.(operation);
      return {
        conflictResolution: 'sync',
        durationMs: Date.now() - startTime,
        operationId: operation.id,
        shouldRetry: false,
        success: true,
      };
    }

    return handleSyncFailure(result, operation, deps, options, startTime);
  } catch (error) {
    return handleSyncError(error, operation, deps, options, startTime);
  }
}

function handleSyncFailure(
  result: {
    item: { retryContext: { exhausted: boolean } };
    error?: { message?: string; category?: ErrorCategory };
  },
  operation: OfflineOperation,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions,
  startTime: number
): ProcessOperationResult {
  const { queueManager } = deps;
  const { callbacks } = options;
  const exhausted = result.item.retryContext.exhausted;
  const errorMsg = result.error?.message ?? 'Sync failed';
  queueManager.markFailed(operation.id, errorMsg, result.error?.category, {
    final: exhausted,
  });

  if (exhausted) {
    callbacks?.onFailure?.(operation, errorMsg);
  } else {
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

function handleSyncError(
  error: unknown,
  operation: OfflineOperation,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions,
  startTime: number
): ProcessOperationResult {
  const { queueManager } = deps;
  const { callbacks } = options;
  const errorMsg = error instanceof Error ? error.message : String(error);

  queueManager.markFailed(operation.id, errorMsg, 'unknown');
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
