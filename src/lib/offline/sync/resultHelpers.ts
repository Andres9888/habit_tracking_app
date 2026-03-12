/**
 * Sync Orchestrator Result Helpers
 *
 * Helper functions for creating and processing sync results.
 */

import type { OfflineQueueManagerAPI } from '../queueManager';
import type { SyncItem } from '../syncManager';
import type { OfflineOperation } from '../queue';
import type { SyncOrchestratorResult } from './types';

/**
 * Create a sync result object
 */
export function createSyncResult(
  initiated: boolean,
  processed: number,
  succeeded: number,
  failed: number,
  skipped: number
): SyncOrchestratorResult {
  return { failed, initiated, processed, skipped, succeeded };
}

/**
 * Create an error result object
 */
export function createErrorResult(error: Error): SyncOrchestratorResult {
  return {
    error,
    failed: 0,
    initiated: false,
    processed: 0,
    skipped: 0,
    succeeded: 0,
  };
}

/**
 * Process batch results and update queue manager status
 */
export function processBatchResults(
  queueManager: OfflineQueueManagerAPI,
  successful: SyncItem<OfflineOperation>[],
  failed: SyncItem<OfflineOperation>[],
  skipped: SyncItem<OfflineOperation>[]
): void {
  for (const item of successful) {
    queueManager.markCompleted(item.id);
  }

  for (const item of failed) {
    const errorMsg = item.retryContext.lastError?.message ?? 'Sync failed';
    const category = item.retryContext.lastError?.category;
    queueManager.markFailed(item.id, errorMsg, category);
  }

  for (const item of skipped) {
    queueManager.markPending(item.id);
  }
}

/**
 * Create an item executor from an offline operation executor
 */
export function createItemExecutor(
  executor: (operation: OfflineOperation) => Promise<void>
) {
  return async (item: SyncItem<OfflineOperation>): Promise<void> => {
    await executor(item.payload);
  };
}
