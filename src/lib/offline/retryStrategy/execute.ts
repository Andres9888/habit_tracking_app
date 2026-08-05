/**
 * Retry Execution Utilities
 */

import type { ClassifiedError, RetryContext, RetryStrategy } from '../types';
import { DEFAULT_RETRY_STRATEGY } from './config';
import {
  createRetryContext,
  updateRetryContext,
  getTimeUntilRetry,
} from './context';

/**
 * Execute a function with retry logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  classifyError: (error: unknown) => ClassifiedError,
  strategy: RetryStrategy = DEFAULT_RETRY_STRATEGY,
  onRetry?: (context: RetryContext, delay: number) => void
): Promise<T> {
  let context = createRetryContext();

  while (true) {
    try {
      return await fn();
    } catch (error) {
      const classified = classifyError(error);
      context = updateRetryContext(context, classified, strategy);

      if (context.exhausted) {
        throw error;
      }

      const delay = getTimeUntilRetry(context);
      onRetry?.(context, delay);

      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }
}

/**
 * Create a retry wrapper for async functions
 */
export function withRetry<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  classifyError: (error: unknown) => ClassifiedError,
  strategy: RetryStrategy = DEFAULT_RETRY_STRATEGY
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) =>
    executeWithRetry(() => fn(...args), classifyError, strategy);
}

/**
 * Select appropriate retry strategy based on error category
 */
export function selectStrategy(
  baseStrategy: RetryStrategy,
  error?: ClassifiedError
): RetryStrategy {
  if (!error) return baseStrategy;

  switch (error.category) {
    case 'rateLimit': {
      return {
        ...baseStrategy,
        backoffMultiplier: 3,
        baseDelayMs: Math.max(baseStrategy.baseDelayMs, 5000),
      };
    }

    case 'server': {
      return {
        ...baseStrategy,
        backoffMultiplier: 2.5,
        maxRetries: Math.min(baseStrategy.maxRetries, 3),
      };
    }

    case 'timeout': {
      return {
        ...baseStrategy,
        maxRetries: baseStrategy.maxRetries + 2,
      };
    }

    default: {
      return baseStrategy;
    }
  }
}
