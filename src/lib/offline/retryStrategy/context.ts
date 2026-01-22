/**
 * Retry Context Management
 */

import type { ClassifiedError, RetryContext, RetryStrategy } from '../types';
import { DEFAULT_RETRY_STRATEGY } from './config';
import { calculateDelay } from './delay';

/**
 * Create a retry context for tracking retry state
 */
export function createRetryContext(): RetryContext {
  return {
    attemptCount: 0,
    exhausted: false,
  };
}

/**
 * Update retry context after a failed attempt
 */
export function updateRetryContext(
  context: RetryContext,
  error: ClassifiedError,
  strategy: RetryStrategy = DEFAULT_RETRY_STRATEGY
): RetryContext {
  const newAttemptCount = context.attemptCount + 1;
  const exhausted = newAttemptCount >= strategy.maxRetries;

  // Non-retryable errors immediately exhaust retries
  if (!error.isRetryable) {
    return {
      attemptCount: newAttemptCount,
      exhausted: true,
      lastError: error,
    };
  }

  const delay = calculateDelay(newAttemptCount, strategy, error.suggestedDelay);

  return {
    attemptCount: newAttemptCount,
    exhausted,
    lastError: error,
    nextRetryAt: exhausted ? undefined : Date.now() + delay,
  };
}

/**
 * Check if a retry should be attempted
 */
export function shouldRetry(context: RetryContext, now = Date.now()): boolean {
  if (context.exhausted) return false;
  if (!context.nextRetryAt) return true;
  return now >= context.nextRetryAt;
}

/**
 * Get time until next retry (ms)
 */
export function getTimeUntilRetry(
  context: RetryContext,
  now = Date.now()
): number {
  if (context.exhausted || !context.nextRetryAt) return 0;
  return Math.max(0, context.nextRetryAt - now);
}
