/**
 * Sync Execution Logic
 *
 * Handles the core sync cycle execution.
 */

import type { OfflineOperation } from '../../queue';
import type { OfflineQueueManagerAPI } from '../../queueManager';
import { OfflineSyncManager } from '../../syncManager';
import type {
  SyncOrchestratorResult,
  SyncOrchestratorState,
  SyncProgressCallback,
  SyncExecutor,
} from '../types';
import { operationsToSyncItems } from '../helpers';
import {
  createSyncResult,
  createErrorResult,
  processBatchResults,
  createItemExecutor,
} from '../resultHelpers';

interface ExecuteSyncParams {
  operations: OfflineOperation[];
  queueManager: OfflineQueueManagerAPI;
  syncManager: OfflineSyncManager;
  executor: SyncExecutor;
  state: SyncOrchestratorState;
  onProgress?: SyncProgressCallback;
}

export async function executeSyncCycle(
  params: ExecuteSyncParams
): Promise<SyncOrchestratorResult> {
  const { operations, queueManager, syncManager, executor, state, onProgress } =
    params;

  state.isSyncing = true;
  state.lastSyncAttemptAt = Date.now();

  try {
    for (const op of operations) queueManager.markSyncing(op.id);
    const syncItems = operationsToSyncItems(operations);
    const batchResult = await syncManager.processBatch(
      syncItems,
      createItemExecutor(executor),
      onProgress
    );
    processBatchResults(
      queueManager,
      batchResult.successful,
      batchResult.failed,
      batchResult.skipped
    );
    const result = createSyncResult(
      true,
      operations.length,
      batchResult.successful.length,
      batchResult.failed.length,
      batchResult.skipped.length
    );
    if (result.succeeded > 0) state.lastSuccessfulSyncAt = Date.now();
    state.lastResult = result;
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const result = createErrorResult(err);
    state.lastResult = result;
    throw err;
  } finally {
    state.isSyncing = false;
  }
}
