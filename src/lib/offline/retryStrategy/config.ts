/**
 * Retry Strategy Configuration
 */

import type { RetryStrategy } from '../types';

/** Default retry strategy */
export const DEFAULT_RETRY_STRATEGY: RetryStrategy = {
  backoffMultiplier: 2,
  baseDelayMs: 1000,
  exponential: true,
  jitterFactor: 0.25,
  maxDelayMs: 60_000,
  maxRetries: 5,
};

/** Aggressive retry for critical operations */
export const AGGRESSIVE_RETRY_STRATEGY: RetryStrategy = {
  backoffMultiplier: 1.5,
  baseDelayMs: 500,
  exponential: true,
  jitterFactor: 0.1,
  maxDelayMs: 30_000,
  maxRetries: 10,
};

/** Conservative retry for non-critical operations */
export const CONSERVATIVE_RETRY_STRATEGY: RetryStrategy = {
  backoffMultiplier: 3,
  baseDelayMs: 2000,
  exponential: true,
  jitterFactor: 0.3,
  maxDelayMs: 120_000,
  maxRetries: 3,
};
