/**
 * Single Operation Processing
 *
 * Orchestrates processing a single offline operation.
 * Implements US4 (Graceful Conflict Resolution) integration.
 */

import type { OfflineOperation } from '../../queue';
import type {
  ProcessOperationResult,
  QueueProcessorDeps,
  ProcessSingleOptions,
} from './types';
import { checkAndResolveConflict } from './conflictCheck';
import { executeSync } from './executeSync';

// Re-export for backward compatibility
export { operationToSyncItem } from './executeSync';

/** Check if an operation should be skipped */
export function shouldSkipOperation(
  operation: OfflineOperation,
  deps: QueueProcessorDeps
): { skip: boolean; reason?: string } {
  if (operation.status !== 'pending') {
    return { reason: `status is ${operation.status}`, skip: true };
  }
  if (!deps.syncManager.canSync()) {
    return { reason: 'circuit breaker open', skip: true };
  }
  return { skip: false };
}

function buildSkipResult(
  opId: string,
  reason: string,
  start: number
): ProcessOperationResult {
  return {
    durationMs: Date.now() - start,
    error: reason,
    operationId: opId,
    shouldRetry: true,
    success: false,
  };
}

function buildConflictSkipResult(
  opId: string,
  start: number
): ProcessOperationResult {
  return {
    conflictResolution: 'skip',
    durationMs: Date.now() - start,
    operationId: opId,
    shouldRetry: false,
    skippedDueToConflict: true,
    success: true,
  };
}

/** Process a single operation with the sync manager */
export async function processSingleOperation(
  operation: OfflineOperation,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions
): Promise<ProcessOperationResult> {
  const startTime = Date.now();
  const { callbacks } = options;

  const skipCheck = shouldSkipOperation(operation, deps);
  if (skipCheck.skip) {
    callbacks?.onSkipped?.(operation, skipCheck.reason ?? 'unknown');
    return buildSkipResult(operation.id, skipCheck.reason ?? '', startTime);
  }

  if (operation.type === 'toggleCompletion') {
    const conflictResult = await checkAndResolveConflict(
      operation as OfflineOperation<'toggleCompletion'>,
      deps,
      options
    );
    if (!conflictResult.shouldSync) {
      deps.queueManager.markCompleted(operation.id);
      callbacks?.onConflictSkip?.(operation, conflictResult.reason);
      return buildConflictSkipResult(operation.id, startTime);
    }
  }

  return executeSync(operation, deps, options, startTime);
}
