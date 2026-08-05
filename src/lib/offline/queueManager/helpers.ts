/**
 * Queue Manager Helpers
 *
 * Utility functions for queue operations.
 */

import type {
  OfflineOperation,
  OfflineQueueState,
  OfflineQueueStats,
} from './types';
import { QUEUE_THRESHOLDS } from '../queue';

/**
 * Generate a unique operation ID
 * Format: op_{timestamp}_{random}
 */
export function generateOperationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `op_${timestamp}_${random}`;
}

/**
 * Generate a deduplication key for toggle operations
 */
export function getToggleDedupeKey(habitId: string, date: string): string {
  return `toggle:${habitId}:${date}`;
}

/**
 * Calculate queue statistics from state
 */
export function calculateStats(state: OfflineQueueState): OfflineQueueStats {
  const { operations } = state;
  const totalCount = operations.length;

  let pendingCount = 0;
  let syncingCount = 0;
  let failedCount = 0;
  let oldestPendingAt: number | undefined;

  for (const op of operations) {
    switch (op.status) {
      case 'pending': {
        pendingCount++;
        if (!oldestPendingAt || op.createdAt < oldestPendingAt) {
          oldestPendingAt = op.createdAt;
        }
        break;
      }
      case 'syncing': {
        syncingCount++;
        break;
      }
      case 'failed': {
        failedCount++;
        break;
      }
    }
  }

  const isHealthy =
    totalCount < QUEUE_THRESHOLDS.WARNING_SIZE && failedCount === 0;
  let warning: string | undefined;

  if (totalCount >= QUEUE_THRESHOLDS.MAX_SIZE) {
    warning = `Queue at capacity (${totalCount}/${QUEUE_THRESHOLDS.MAX_SIZE})`;
  } else if (totalCount >= QUEUE_THRESHOLDS.WARNING_SIZE) {
    warning = `Queue growing large (${totalCount} operations)`;
  } else if (failedCount > 0) {
    warning = `${failedCount} failed operation(s) in queue`;
  }

  return {
    failedCount,
    isHealthy,
    oldestPendingAt,
    pendingCount,
    syncingCount,
    totalCount,
    warning,
  };
}

/**
 * Find an operation by ID
 */
export function findOperation(
  operations: OfflineOperation[],
  operationId: string
): OfflineOperation | undefined {
  return operations.find((op) => op.id === operationId);
}

/**
 * Find operation index by ID
 */
export function findOperationIndex(
  operations: OfflineOperation[],
  operationId: string
): number {
  return operations.findIndex((op) => op.id === operationId);
}
