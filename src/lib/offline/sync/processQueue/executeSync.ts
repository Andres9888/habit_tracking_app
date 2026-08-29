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
import { handleSyncError, handleSyncFailure } from './syncFailureHandlers';

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
