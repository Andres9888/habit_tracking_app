/**
 * Offline Queue Manager
 *
 * Manages the offline operation queue for habit completions.
 * Implements FR-001 (store completions locally), FR-003 (persist across restarts),
 * FR-005 (FIFO processing), and FR-011 (handle 500+ operations).
 *
 * @see docs/offline-habit-sync.md
 */

export { createOfflineQueueManager } from './createManager';
export { getOfflineQueueManager, resetOfflineQueueManager } from './singleton';
export { generateOperationId } from './helpers';
export {
  buildOperationIndex,
  findOperationIndexOptimized,
  hasDuplicateOptimized,
} from './optimized';

export type {
  OfflineQueueManagerAPI,
  OfflineQueueManagerConfig,
} from './types';
export type { BatchStatusResult, OperationIndex } from './optimized';
