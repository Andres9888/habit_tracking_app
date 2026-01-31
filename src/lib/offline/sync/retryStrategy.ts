/**
 * Sync Retry Strategy
 *
 * Provides exponential backoff retry strategy specifically configured for
 * offline sync operations. Implements FR-006 (exponential backoff).
 *
 * This module wraps the core retryStrategy utilities with sync-specific
 * configurations optimized for network recovery and batch sync operations.
 */

import type { ClassifiedError, RetryContext, RetryStrategy } from '../types';
import {
  calculateDelay as coreCalculateDelay,
  createRetryContext,
  updateRetryContext,
  shouldRetry as coreShouldRetry,
  getTimeUntilRetry,
  selectStrategy,
} from '../retryStrategy';

/**
 * Sync-optimized retry strategy
 *
 * Tuned for offline sync operations with:
 * - Moderate base delay (2s) for network recovery
 * - 2x multiplier for exponential growth
 * - 5 max retries giving ~62s total retry window
 * - 20% jitter to distribute retry load
 * - 30s max delay per retry
 */
export const SYNC_RETRY_STRATEGY: RetryStrategy = {
  backoffMultiplier: 2,
  baseDelayMs: 2000,
  exponential: true,
  jitterFactor: 0.2,
  maxDelayMs: 30_000,
  maxRetries: 5,
};

/**
 * Fast retry strategy for transient network errors
 *
 * Used when connectivity just returned and initial failures
 * are likely due to DNS/connection warm-up.
 */
export const FAST_SYNC_RETRY_STRATEGY: RetryStrategy = {
  backoffMultiplier: 1.5,
  baseDelayMs: 500,
  exponential: true,
  jitterFactor: 0.1,
  maxDelayMs: 10_000,
  maxRetries: 3,
};

/**
 * Rate-limited retry strategy
 *
 * Used when server returns rate limit errors (429).
 * Longer delays to respect server back-pressure.
 */
export const RATE_LIMITED_RETRY_STRATEGY: RetryStrategy = {
  backoffMultiplier: 3,
  baseDelayMs: 5000,
  exponential: true,
  jitterFactor: 0.3,
  maxDelayMs: 120_000,
  maxRetries: 5,
};

/**
 * Calculate the next retry delay for a sync operation
 *
 * @param attemptCount - Number of previous attempts (0-indexed)
 * @param strategy - Retry strategy to use (defaults to SYNC_RETRY_STRATEGY)
 * @param errorSuggestedDelay - Optional delay suggested by the error (e.g., Retry-After header)
 * @returns Delay in milliseconds before next retry attempt
 */
export function calculateSyncRetryDelay(
  attemptCount: number,
  strategy: RetryStrategy = SYNC_RETRY_STRATEGY,
  errorSuggestedDelay?: number
): number {
  return coreCalculateDelay(attemptCount, strategy, errorSuggestedDelay);
}

/**
 * Select appropriate retry strategy based on error category
 *
 * @param error - Classified error from sync operation
 * @returns Appropriate retry strategy for the error type
 */
export function selectSyncRetryStrategy(
  error?: ClassifiedError
): RetryStrategy {
  if (!error) return SYNC_RETRY_STRATEGY;

  switch (error.category) {
    case 'rateLimit': {
      return RATE_LIMITED_RETRY_STRATEGY;
    }
    case 'network':
    case 'timeout': {
      return FAST_SYNC_RETRY_STRATEGY;
    }
    default: {
      return selectStrategy(SYNC_RETRY_STRATEGY, error);
    }
  }
}

/**
 * Check if a sync operation should be retried
 *
 * @param context - Current retry context
 * @param error - Classified error from last attempt
 * @returns true if retry should be attempted
 */
export function shouldRetrySyncOperation(
  context: RetryContext,
  error?: ClassifiedError
): boolean {
  if (context.exhausted) return false;
  if (error && !error.isRetryable) return false;
  return coreShouldRetry(context);
}

/**
 * Create retry context for a sync operation
 *
 * @param previousAttempts - Number of previous sync attempts
 * @returns Fresh retry context initialized with attempt count
 */
export function createSyncRetryContext(previousAttempts = 0): RetryContext {
  const context = createRetryContext();
  return {
    ...context,
    attemptCount: previousAttempts,
    exhausted: previousAttempts >= SYNC_RETRY_STRATEGY.maxRetries,
  };
}

/**
 * Update retry context after a failed sync attempt
 *
 * @param context - Current retry context
 * @param error - Classified error from the attempt
 * @param strategy - Retry strategy to use (auto-selected if not provided)
 * @returns Updated retry context
 */
export function updateSyncRetryContext(
  context: RetryContext,
  error: ClassifiedError,
  strategy?: RetryStrategy
): RetryContext {
  const effectiveStrategy = strategy ?? selectSyncRetryStrategy(error);
  return updateRetryContext(context, error, effectiveStrategy);
}

/**
 * Get remaining time until retry is allowed
 *
 * @param context - Current retry context
 * @returns Milliseconds until retry, 0 if can retry now, Infinity if exhausted
 */
export function getTimeUntilSyncRetry(context: RetryContext): number {
  if (context.exhausted) return Infinity;
  return getTimeUntilRetry(context);
}

// Re-export core types for convenience

// Re-export core utilities for advanced use cases

export { DEFAULT_RETRY_STRATEGY } from '../retryStrategy';
export {
  type RetryContext,
  type RetryStrategy,
  type ClassifiedError,
} from '../types';
