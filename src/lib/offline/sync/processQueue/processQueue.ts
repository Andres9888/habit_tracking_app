/**
 * Process Queue - FIFO Queue Processing
 *
 * Processes the offline queue in FIFO order, executing sync operations
 * sequentially with proper status tracking and error handling.
 *
 * Implements FR-005 (FIFO processing order) and FR-012 (non-blocking).
 */

import { getOperationsForSync } from '../helpers';
import type {
  ProcessQueueConfig,
  ProcessQueueResult,
  QueueProcessorDeps,
  ProcessingContext,
  ProcessOperationResult,
} from './types';
import { processSingleOperation } from './processSingleOperation';
import { createEmptyResult, aggregateResults } from './helpers';

/** Default batch size for queue processing */
export const DEFAULT_BATCH_SIZE = 50;

function createProcessingContext(batchSize: number): ProcessingContext {
  return {
    batchIndex: 0,
    batchSize,
    failedCount: 0,
    skippedCount: 0,
    startedAt: Date.now(),
    successCount: 0,
  };
}

function updateContext(
  ctx: ProcessingContext,
  result: ProcessOperationResult
): void {
  if (result.success) ctx.successCount++;
  else if (result.shouldRetry) ctx.skippedCount++;
  else ctx.failedCount++;
}

/**
 * Process the offline queue in FIFO order
 *
 * @param deps - Queue manager, sync manager, and executor
 * @param config - Processing configuration (includes US4 conflict options)
 * @returns Aggregated result of processing
 */
export async function processQueue(
  deps: QueueProcessorDeps,
  config: ProcessQueueConfig = {}
): Promise<ProcessQueueResult> {
  const {
    batchSize = DEFAULT_BATCH_SIZE,
    stopOnFirstFailure = false,
    onProgress,
    onSuccess,
    onFailure,
    onSkipped,
    conflictConfig,
    onConflict,
    onConflictSkip,
  } = config;

  const { queueManager } = deps;
  const startTime = Date.now();
  const allOperations = queueManager.getState().operations;
  const pendingOperations = getOperationsForSync(allOperations, batchSize);

  if (pendingOperations.length === 0) return createEmptyResult();

  const context = createProcessingContext(pendingOperations.length);
  const results: ProcessOperationResult[] = [];

  for (let i = 0; i < pendingOperations.length; i++) {
    const operation = pendingOperations[i];
    context.batchIndex = i;
    onProgress?.(i, pendingOperations.length, operation);

    const result = await processSingleOperation(operation, deps, {
      callbacks: {
        onConflict,
        onConflictSkip,
        onFailure,
        onSkipped,
        onSuccess,
      },
      conflictConfig,
      context,
    });

    results.push(result);
    updateContext(context, result);
    if (stopOnFirstFailure && !result.success) break;
  }

  const lastOp = pendingOperations.at(-1);
  if (lastOp) {
    onProgress?.(pendingOperations.length, pendingOperations.length, lastOp);
  }

  const totalPendingCount = allOperations.filter(
    (op) => op.status === 'pending'
  ).length;

  return aggregateResults(results, totalPendingCount, batchSize, startTime);
}
