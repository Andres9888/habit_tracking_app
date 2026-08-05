/**
 * useOfflineQueue - Offline queue for submissions when network unavailable
 *
 * Features:
 * - AsyncStorage-based queue persistence
 * - Automatic retry when network restored
 * - Support for habit update submissions
 * - Exponential backoff for failed retries
 * - Queue size limits and stale item cleanup
 */

// Main hook
export { useOfflineQueue, default } from './useOfflineQueue';

// Types
export type {
  OfflineSubmissionType,
  QueuedSubmission,
  HabitUpdatePayload,
  QueueStats,
  UseOfflineQueueOptions,
  UseOfflineQueueReturn,
} from './types';

// Storage operations (exported for testing)
export {
  loadQueueIndex,
  saveQueueIndex,
  loadQueueItem,
  saveQueueItem,
  removeQueueItem,
  loadAllQueueItems,
} from './storage';

// Utility functions (exported for testing and external use)
export {
  generateSubmissionId,
  getItemKey,
  calculateRetryDelay,
  calculateQueueStats,
} from './utils';

// Constants
export {
  QUEUE_INDEX_KEY,
  QUEUE_ITEM_PREFIX,
  DEFAULT_MAX_QUEUE_SIZE,
  DEFAULT_MAX_ITEM_AGE_MS,
  DEFAULT_MAX_RETRIES,
  DEFAULT_BASE_RETRY_DELAY_MS,
} from './constants';
