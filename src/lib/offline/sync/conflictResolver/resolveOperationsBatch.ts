/**
 * Resolve Operations Batch
 *
 * Batch resolution of offline operations using batch server state checker.
 */

import type { OfflineOperation } from '../../queue';
import {
  buildBatchResult,
  buildResolutionResult,
  createEmptyBatchResult,
} from './helpers';
import { buildResultsFromStates, handleBatchError } from './batchHelpers';
import { DEFAULT_CONFLICT_RESOLVER_CONFIG } from './resolveOperation';
import type {
  BatchCompletionStateChecker,
  BatchConflictResolutionResult,
  ConflictEventListener,
  ConflictResolverConfig,
} from './types';

/** Resolve multiple operations using a batch server state checker */
export async function resolveOperationsBatch(
  operations: OfflineOperation<'toggleCompletion'>[],
  batchChecker: BatchCompletionStateChecker,
  config: ConflictResolverConfig = {},
  onEvent?: ConflictEventListener
): Promise<BatchConflictResolutionResult> {
  if (operations.length === 0) {
    return createEmptyBatchResult();
  }

  const mergedConfig = { ...DEFAULT_CONFLICT_RESOLVER_CONFIG, ...config };

  if (!mergedConfig.checkServerStateBeforeSync) {
    return createAllSyncResult(operations);
  }

  return executeBatch(
    operations,
    batchChecker,
    mergedConfig.serverCheckTimeoutMs,
    onEvent
  );
}

function createAllSyncResult(
  operations: OfflineOperation<'toggleCompletion'>[]
): BatchConflictResolutionResult {
  const results = operations.map((op) =>
    buildResolutionResult(
      op.id,
      op.payload,
      undefined,
      'sync',
      'Server state check disabled - proceeding with sync'
    )
  );
  return buildBatchResult(results);
}

async function executeBatch(
  operations: OfflineOperation<'toggleCompletion'>[],
  batchChecker: BatchCompletionStateChecker,
  timeoutMs: number,
  onEvent?: ConflictEventListener
): Promise<BatchConflictResolutionResult> {
  try {
    const items = operations.map((op) => ({
      date: op.payload.date,
      habitId: op.payload.habitId,
    }));

    const serverStates = await Promise.race([
      batchChecker(items),
      new Promise<Map<string, boolean>>((_, reject) => {
        setTimeout(
          () => reject(new Error('Batch server state check timed out')),
          timeoutMs
        );
      }),
    ]);

    return buildResultsFromStates(operations, serverStates, onEvent);
  } catch (error) {
    return handleBatchError(operations, error, onEvent);
  }
}
