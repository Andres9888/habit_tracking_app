/**
 * Process Queue Until Empty
 *
 * Iterative queue processing until empty or max iterations.
 */

import type {
  ProcessQueueConfig,
  ProcessQueueResult,
  QueueProcessorDeps,
} from './types';
import { createEmptyResult } from './helpers';
import { processQueue } from './processQueue';

/**
 * Process the entire queue until empty or max iterations reached
 *
 * Use this for background processing when you want to sync everything.
 * Each iteration processes a batch, then checks for more pending operations.
 *
 * @param deps - Queue manager, sync manager, and executor
 * @param config - Processing configuration
 * @param maxIterations - Maximum number of batch iterations (default: 10)
 * @returns Final aggregated result
 */
export async function processQueueUntilEmpty(
  deps: QueueProcessorDeps,
  config: ProcessQueueConfig = {},
  maxIterations = 10
): Promise<ProcessQueueResult> {
  let totalResult: ProcessQueueResult = createEmptyResult();
  let iterations = 0;

  while (iterations < maxIterations) {
    const batchResult = await processQueue(deps, config);

    // Merge results
    totalResult = {
      allSucceeded: totalResult.allSucceeded && batchResult.allSucceeded,
      conflictSkipped:
        (totalResult.conflictSkipped ?? 0) + (batchResult.conflictSkipped ?? 0),
      failed: totalResult.failed + batchResult.failed,
      hasMore: batchResult.hasMore,
      results: [...totalResult.results, ...batchResult.results],
      skipped: totalResult.skipped + batchResult.skipped,
      succeeded: totalResult.succeeded + batchResult.succeeded,
      total: totalResult.total + batchResult.total,
      totalDurationMs:
        totalResult.totalDurationMs + batchResult.totalDurationMs,
    };

    // Stop if no more operations to process
    if (!batchResult.hasMore || batchResult.total === 0) {
      break;
    }

    iterations++;
  }

  return totalResult;
}
