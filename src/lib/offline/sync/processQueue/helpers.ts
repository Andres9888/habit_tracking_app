/**
 * Process Queue Helpers
 *
 * Utility functions for queue processing result aggregation.
 */

import type { ProcessQueueResult, ProcessOperationResult } from './types';

/**
 * Create an empty result for when there's nothing to process
 */
export function createEmptyResult(): ProcessQueueResult {
  return {
    allSucceeded: true,
    conflictSkipped: 0,
    failed: 0,
    hasMore: false,
    results: [],
    skipped: 0,
    succeeded: 0,
    total: 0,
    totalDurationMs: 0,
  };
}

/**
 * Aggregate results from individual operation processing
 */
export function aggregateResults(
  results: ProcessOperationResult[],
  totalOperationsInQueue: number,
  batchSize: number,
  startTime: number
): ProcessQueueResult {
  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success && !r.shouldRetry).length;
  const skipped = results.filter((r) => !r.success && r.shouldRetry).length;
  const conflictSkipped = results.filter((r) => r.skippedDueToConflict).length;

  return {
    allSucceeded: succeeded === results.length && results.length > 0,
    conflictSkipped,
    failed,
    hasMore: totalOperationsInQueue > batchSize,
    results,
    skipped,
    succeeded,
    total: results.length,
    totalDurationMs: Date.now() - startTime,
  };
}
