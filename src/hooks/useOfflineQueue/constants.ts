/**
 * Constants for the offline queue system
 */

/** Storage key for the queue index */
export const QUEUE_INDEX_KEY = 'offline-queue-index';

/** Storage key prefix for individual queue items */
export const QUEUE_ITEM_PREFIX = 'offline-queue:';

/** Default maximum number of items in queue */
export const DEFAULT_MAX_QUEUE_SIZE = 50;

/** Default maximum age of items in ms (7 days) */
export const DEFAULT_MAX_ITEM_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Default maximum retry attempts */
export const DEFAULT_MAX_RETRIES = 5;

/** Default base delay for exponential backoff in ms */
export const DEFAULT_BASE_RETRY_DELAY_MS = 1000;
