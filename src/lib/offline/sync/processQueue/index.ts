/**
 * Process Queue Module
 *
 * FIFO queue processing for offline sync operations.
 * Implements FR-005 (FIFO processing order).
 */

// Core processing functions
export { processQueue, DEFAULT_BATCH_SIZE } from './processQueue';
export { processQueueUntilEmpty } from './processQueueUntilEmpty';

// Single operation processing
export {
  processSingleOperation,
  operationToSyncItem,
  shouldSkipOperation,
} from './processSingleOperation';

// Conflict check (US4)
export {
  checkAndResolveConflict,
  type ConflictCheckResult,
} from './conflictCheck';

// Sync execution
export { executeSync } from './executeSync';

// Helpers
export { createEmptyResult, aggregateResults } from './helpers';

// Types
export type {
  ProcessOperationResult,
  ProcessQueueResult,
  ProcessQueueConfig,
  QueueProgressCallback,
  QueueProcessorDeps,
  ProcessingContext,
  ProcessSingleOptions,
} from './types';
