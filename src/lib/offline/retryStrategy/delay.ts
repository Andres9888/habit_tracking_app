/**
 * Delay Calculation
 */

import type { RetryStrategy } from '../types';
import { DEFAULT_RETRY_STRATEGY } from './config';

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateDelay(
  attemptCount: number,
  strategy: RetryStrategy = DEFAULT_RETRY_STRATEGY,
  errorSuggestedDelay?: number
): number {
  // If error suggests a specific delay and it's the first retry, use it
  if (errorSuggestedDelay && attemptCount <= 1) {
    return errorSuggestedDelay;
  }

  const delay = strategy.exponential
    ? strategy.baseDelayMs * Math.pow(strategy.backoffMultiplier, attemptCount)
    : strategy.baseDelayMs * (attemptCount + 1);

  // Apply jitter to prevent thundering herd
  const jitterRange = delay * strategy.jitterFactor;
  const jitter = Math.random() * jitterRange * 2 - jitterRange;
  const finalDelay = delay + jitter;

  // Cap at max delay
  return Math.min(Math.floor(finalDelay), strategy.maxDelayMs);
}
