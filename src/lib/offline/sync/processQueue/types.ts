/**
 * Process Queue Types
 *
 * Types for FIFO queue processing during offline sync operations.
 * Implements FR-005 (FIFO processing order).
 */

import type { OfflineOperation } from '../../queue';
import type { OfflineQueueManagerAPI } from '../../queueManager';
import type { OfflineSyncManager } from '../../syncManager';
import type { ToggleSyncExecutor } from '../types';

/**
 * Result of processing a single operation
 */
export interface ProcessOperationResult {
  /** ID of the processed operation */
  operationId: string;
  /** Whether the operation was successfully synced */
  success: boolean;
  /** Whether the operation should be retried later */
  shouldRetry: boolean;
  /** Error message if failed */
  error?: string;
  /** Duration of the operation in milliseconds */
  durationMs: number;
}

/**
 * Aggregated result of processing multiple operations
 */
export interface ProcessQueueResult {
  /** Total operations processed in this batch */
  total: number;
  /** Successfully synced operations */
  succeeded: number;
  /** Operations that failed permanently (exhausted retries) */
  failed: number;
  /** Operations skipped (not ready for retry yet or circuit open) */
  skipped: number;
  /** Individual results for each operation */
  results: ProcessOperationResult[];
  /** Total processing duration in milliseconds */
  totalDurationMs: number;
  /** Whether all operations were successful */
  allSucceeded: boolean;
  /** Whether there are more operations to process */
  hasMore: boolean;
}

/**
 * Progress callback for queue processing
 */
export type QueueProgressCallback = (
  processed: number,
  total: number,
  currentOp: OfflineOperation
) => void;

/**
 * Configuration for queue processing
 */
export interface ProcessQueueConfig {
  /** Maximum operations to process in one batch (default: 50) */
  batchSize?: number;
  /** Whether to stop on first failure (default: false) */
  stopOnFirstFailure?: boolean;
  /** Progress callback called after each operation */
  onProgress?: QueueProgressCallback;
  /** Callback when an operation succeeds */
  onSuccess?: (op: OfflineOperation) => void;
  /** Callback when an operation fails */
  onFailure?: (op: OfflineOperation, error: string) => void;
  /** Callback when an operation is skipped */
  onSkipped?: (op: OfflineOperation, reason: string) => void;
}

/**
 * Dependencies for queue processor
 */
export interface QueueProcessorDeps {
  /** Queue manager for reading/updating operations */
  queueManager: OfflineQueueManagerAPI;
  /** Sync manager for executing sync with circuit breaker */
  syncManager: OfflineSyncManager;
  /** Executor function for syncing toggle operations */
  executor: ToggleSyncExecutor;
}

/**
 * Context passed during queue processing
 */
export interface ProcessingContext {
  /** Current batch index (0-based) */
  batchIndex: number;
  /** Total operations in this batch */
  batchSize: number;
  /** Start timestamp of the batch processing */
  startedAt: number;
  /** Running count of successful operations */
  successCount: number;
  /** Running count of failed operations */
  failedCount: number;
  /** Running count of skipped operations */
  skippedCount: number;
}

/**
 * Options for single operation processing
 */
export interface ProcessSingleOptions {
  /** Context for tracking batch progress */
  context: ProcessingContext;
  /** Callbacks for operation lifecycle */
  callbacks?: {
    onSuccess?: (op: OfflineOperation) => void;
    onFailure?: (op: OfflineOperation, error: string) => void;
    onSkipped?: (op: OfflineOperation, reason: string) => void;
  };
}
