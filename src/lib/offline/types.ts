/**
 * Offline Support Types
 *
 * Core type definitions for offline support functionality:
 * - Error classification for intelligent retry decisions
 * - Circuit breaker pattern for service protection
 * - Retry strategies with exponential backoff
 * - Sync status for UI display
 *
 * For offline queue types, see ./queue/index.ts
 *
 * @module offline/types
 * @category Offline Support
 */

/**
 * Error classification categories for offline retry logic
 */
export type ErrorCategory =
  | 'network' // Network connectivity issues - always retryable
  | 'timeout' // Request timeout - retryable with backoff
  | 'server' // Server error (5xx) - retryable with backoff
  | 'rateLimit' // Rate limited - retryable with longer delay
  | 'auth' // Authentication error - not retryable, user action needed
  | 'validation' // Validation error - not retryable, data issue
  | 'notFound' // Resource not found - not retryable
  | 'conflict' // Conflict error - may need resolution
  | 'unknown'; // Unknown error - retryable with caution

/**
 * Classified error with metadata
 */
export interface ClassifiedError {
  /** Original error */
  original: Error;
  /** Error category */
  category: ErrorCategory;
  /** Whether this error should be retried */
  isRetryable: boolean;
  /** Suggested retry delay override (ms), if any */
  suggestedDelay?: number;
  /** Human-readable error message */
  message: string;
  /** HTTP status code, if applicable */
  statusCode?: number;
}

/**
 * Circuit breaker state
 */
export type CircuitState = 'closed' | 'open' | 'half-open';

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  /** Number of failures before opening circuit */
  failureThreshold: number;
  /** Time in ms before attempting to close circuit */
  resetTimeoutMs: number;
  /** Number of successes in half-open state to close circuit */
  successThreshold: number;
  /** Optional: specific error categories that trigger circuit */
  triggerCategories?: ErrorCategory[];
}

/**
 * Circuit breaker status
 */
export interface CircuitBreakerStatus {
  /** Current circuit state */
  state: CircuitState;
  /** Number of consecutive failures */
  failureCount: number;
  /** Number of consecutive successes (in half-open) */
  successCount: number;
  /** Timestamp when circuit opened */
  openedAt?: number;
  /** Timestamp of last failure */
  lastFailureAt?: number;
}

/**
 * Retry strategy configuration
 */
export interface RetryStrategy {
  /** Maximum number of retries */
  maxRetries: number;
  /** Base delay in milliseconds */
  baseDelayMs: number;
  /** Maximum delay cap in milliseconds */
  maxDelayMs: number;
  /** Jitter factor (0-1) */
  jitterFactor: number;
  /** Whether to use exponential backoff */
  exponential: boolean;
  /** Multiplier for exponential backoff */
  backoffMultiplier: number;
}

/**
 * Retry context for a specific item
 */
export interface RetryContext {
  /** Number of attempts made */
  attemptCount: number;
  /** Last error encountered */
  lastError?: ClassifiedError;
  /** Next retry timestamp */
  nextRetryAt?: number;
  /** Whether max retries exceeded */
  exhausted: boolean;
}

/**
 * Sync status for UI display
 */
export interface SyncStatus {
  /** Whether sync is currently in progress */
  isSyncing: boolean;
  /** Number of items pending sync */
  pendingCount: number;
  /** Number of items that failed sync */
  failedCount: number;
  /** Number of items successfully synced this session */
  syncedCount: number;
  /** Last successful sync timestamp */
  lastSyncAt?: number;
  /** Current sync progress (0-1) */
  progress: number;
  /** Circuit breaker status */
  circuitStatus: CircuitBreakerStatus;
}

/**
 * Sync event types
 */
export type SyncEventType =
  | 'sync:start'
  | 'sync:complete'
  | 'sync:error'
  | 'sync:item:success'
  | 'sync:item:failed'
  | 'sync:item:skipped'
  | 'circuit:open'
  | 'circuit:close'
  | 'circuit:half-open';

/**
 * Sync event payload
 */
export interface SyncEvent {
  type: SyncEventType;
  timestamp: number;
  data?: Record<string, unknown>;
}
