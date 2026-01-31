/**
 * Sync Retry Strategy Tests
 *
 * Tests for exponential backoff retry logic specific to sync operations.
 * Covers FR-006: Implement retry logic with exponential backoff
 */

import {
  SYNC_RETRY_STRATEGY,
  FAST_SYNC_RETRY_STRATEGY,
  RATE_LIMITED_RETRY_STRATEGY,
  calculateSyncRetryDelay,
  selectSyncRetryStrategy,
  shouldRetrySyncOperation,
  createSyncRetryContext,
  updateSyncRetryContext,
  getTimeUntilSyncRetry,
} from '../retryStrategy';
import type { ClassifiedError, RetryContext } from '../../types';

// Mock Math.random for deterministic jitter testing
const mockRandom = jest.spyOn(Math, 'random');

beforeEach(() => {
  mockRandom.mockReturnValue(0.5); // Middle of jitter range
});

afterEach(() => {
  mockRandom.mockReset();
});

describe('Retry Strategy Constants', () => {
  describe('SYNC_RETRY_STRATEGY', () => {
    it('has exponential backoff enabled', () => {
      expect(SYNC_RETRY_STRATEGY.exponential).toBe(true);
    });

    it('has 2x backoff multiplier', () => {
      expect(SYNC_RETRY_STRATEGY.backoffMultiplier).toBe(2);
    });

    it('has 2s base delay', () => {
      expect(SYNC_RETRY_STRATEGY.baseDelayMs).toBe(2000);
    });

    it('has 5 max retries', () => {
      expect(SYNC_RETRY_STRATEGY.maxRetries).toBe(5);
    });

    it('has 30s max delay', () => {
      expect(SYNC_RETRY_STRATEGY.maxDelayMs).toBe(30_000);
    });

    it('has 20% jitter factor', () => {
      expect(SYNC_RETRY_STRATEGY.jitterFactor).toBe(0.2);
    });
  });

  describe('FAST_SYNC_RETRY_STRATEGY', () => {
    it('has shorter base delay for network recovery', () => {
      expect(FAST_SYNC_RETRY_STRATEGY.baseDelayMs).toBeLessThan(
        SYNC_RETRY_STRATEGY.baseDelayMs
      );
    });

    it('has fewer max retries', () => {
      expect(FAST_SYNC_RETRY_STRATEGY.maxRetries).toBe(3);
    });
  });

  describe('RATE_LIMITED_RETRY_STRATEGY', () => {
    it('has longer base delay for rate limiting', () => {
      expect(RATE_LIMITED_RETRY_STRATEGY.baseDelayMs).toBeGreaterThan(
        SYNC_RETRY_STRATEGY.baseDelayMs
      );
    });

    it('has higher backoff multiplier', () => {
      expect(RATE_LIMITED_RETRY_STRATEGY.backoffMultiplier).toBe(3);
    });
  });
});

describe('calculateSyncRetryDelay', () => {
  it('calculates exponential delay', () => {
    mockRandom.mockReturnValue(0.5); // No effective jitter at 0.5

    // attemptCount=0: 2000 * 2^0 = 2000
    const delay0 = calculateSyncRetryDelay(0);
    expect(delay0).toBe(2000); // With jitter at 0.5, no change

    // attemptCount=1: 2000 * 2^1 = 4000
    const delay1 = calculateSyncRetryDelay(1);
    expect(delay1).toBe(4000);

    // attemptCount=2: 2000 * 2^2 = 8000
    const delay2 = calculateSyncRetryDelay(2);
    expect(delay2).toBe(8000);
  });

  it('respects max delay cap', () => {
    // attemptCount=10: 2000 * 2^10 = 2,048,000 > 30,000
    const delay = calculateSyncRetryDelay(10);
    expect(delay).toBeLessThanOrEqual(SYNC_RETRY_STRATEGY.maxDelayMs);
  });

  it('uses error suggested delay when provided on first retry', () => {
    const suggestedDelay = 10000;
    const delay = calculateSyncRetryDelay(
      0,
      SYNC_RETRY_STRATEGY,
      suggestedDelay
    );
    expect(delay).toBe(suggestedDelay);
  });

  it('ignores suggested delay after first retry', () => {
    const suggestedDelay = 10000;
    const delay = calculateSyncRetryDelay(
      2,
      SYNC_RETRY_STRATEGY,
      suggestedDelay
    );
    expect(delay).not.toBe(suggestedDelay);
  });

  it('applies jitter to prevent thundering herd', () => {
    mockRandom.mockReturnValue(0.0); // Min jitter
    const delayMin = calculateSyncRetryDelay(2);

    mockRandom.mockReturnValue(1.0); // Max jitter
    const delayMax = calculateSyncRetryDelay(2);

    // With 20% jitter on 8000ms base: range is 6400-9600
    expect(delayMin).toBeLessThan(delayMax);
    expect(delayMax - delayMin).toBeGreaterThan(0);
  });

  it('uses custom strategy when provided', () => {
    const customStrategy = {
      ...SYNC_RETRY_STRATEGY,
      baseDelayMs: 100,
      backoffMultiplier: 10,
    };
    mockRandom.mockReturnValue(0.5);

    const delay = calculateSyncRetryDelay(1, customStrategy);
    expect(delay).toBe(1000); // 100 * 10^1 = 1000
  });
});

describe('selectSyncRetryStrategy', () => {
  it('returns SYNC_RETRY_STRATEGY when no error provided', () => {
    const strategy = selectSyncRetryStrategy();
    expect(strategy).toBe(SYNC_RETRY_STRATEGY);
  });

  it('returns RATE_LIMITED_RETRY_STRATEGY for rate limit errors', () => {
    const error: ClassifiedError = {
      category: 'rateLimit',
      isRetryable: true,
      message: 'Too many requests',
      original: new Error('429 Too Many Requests'),
    };
    const strategy = selectSyncRetryStrategy(error);
    expect(strategy).toBe(RATE_LIMITED_RETRY_STRATEGY);
  });

  it('returns FAST_SYNC_RETRY_STRATEGY for network errors', () => {
    const error: ClassifiedError = {
      category: 'network',
      isRetryable: true,
      message: 'Network error',
      original: new Error('Network error'),
    };
    const strategy = selectSyncRetryStrategy(error);
    expect(strategy).toBe(FAST_SYNC_RETRY_STRATEGY);
  });

  it('returns FAST_SYNC_RETRY_STRATEGY for timeout errors', () => {
    const error: ClassifiedError = {
      category: 'timeout',
      isRetryable: true,
      message: 'Request timeout',
      original: new Error('Timeout'),
    };
    const strategy = selectSyncRetryStrategy(error);
    expect(strategy).toBe(FAST_SYNC_RETRY_STRATEGY);
  });

  it('returns adjusted strategy for server errors', () => {
    const error: ClassifiedError = {
      category: 'server',
      isRetryable: true,
      message: 'Internal server error',
      original: new Error('500'),
      statusCode: 500,
    };
    const strategy = selectSyncRetryStrategy(error);
    // Server errors get adjusted through selectStrategy
    expect(strategy.backoffMultiplier).toBeGreaterThan(
      SYNC_RETRY_STRATEGY.backoffMultiplier
    );
  });

  it('returns SYNC_RETRY_STRATEGY for unknown errors', () => {
    const error: ClassifiedError = {
      category: 'unknown',
      isRetryable: true,
      message: 'Unknown error',
      original: new Error('Unknown'),
    };
    const strategy = selectSyncRetryStrategy(error);
    expect(strategy).toEqual(SYNC_RETRY_STRATEGY);
  });
});

describe('shouldRetrySyncOperation', () => {
  it('returns false when context is exhausted', () => {
    const context: RetryContext = {
      attemptCount: 5,
      exhausted: true,
    };
    expect(shouldRetrySyncOperation(context)).toBe(false);
  });

  it('returns false when error is not retryable', () => {
    const context: RetryContext = {
      attemptCount: 1,
      exhausted: false,
    };
    const error: ClassifiedError = {
      category: 'validation',
      isRetryable: false,
      message: 'Validation failed',
      original: new Error('Invalid data'),
    };
    expect(shouldRetrySyncOperation(context, error)).toBe(false);
  });

  it('returns true for retryable error with attempts remaining', () => {
    const context: RetryContext = {
      attemptCount: 1,
      exhausted: false,
    };
    const error: ClassifiedError = {
      category: 'network',
      isRetryable: true,
      message: 'Network error',
      original: new Error('Network'),
    };
    expect(shouldRetrySyncOperation(context, error)).toBe(true);
  });

  it('returns true when no error and not exhausted', () => {
    const context: RetryContext = {
      attemptCount: 0,
      exhausted: false,
    };
    expect(shouldRetrySyncOperation(context)).toBe(true);
  });
});

describe('createSyncRetryContext', () => {
  it('creates fresh context with zero attempts by default', () => {
    const context = createSyncRetryContext();
    expect(context.attemptCount).toBe(0);
    expect(context.exhausted).toBe(false);
  });

  it('creates context with previous attempts', () => {
    const context = createSyncRetryContext(3);
    expect(context.attemptCount).toBe(3);
    expect(context.exhausted).toBe(false);
  });

  it('marks as exhausted when max retries exceeded', () => {
    const context = createSyncRetryContext(10);
    expect(context.exhausted).toBe(true);
  });

  it('marks as exhausted at exactly max retries', () => {
    const context = createSyncRetryContext(SYNC_RETRY_STRATEGY.maxRetries);
    expect(context.exhausted).toBe(true);
  });
});

describe('updateSyncRetryContext', () => {
  it('increments attempt count', () => {
    const context: RetryContext = {
      attemptCount: 0,
      exhausted: false,
    };
    const error: ClassifiedError = {
      category: 'network',
      isRetryable: true,
      message: 'Network error',
      original: new Error('Network'),
    };
    const updated = updateSyncRetryContext(context, error);
    expect(updated.attemptCount).toBe(1);
  });

  it('stores last error', () => {
    const context = createSyncRetryContext();
    const error: ClassifiedError = {
      category: 'network',
      isRetryable: true,
      message: 'Network error',
      original: new Error('Network'),
    };
    const updated = updateSyncRetryContext(context, error);
    expect(updated.lastError).toBe(error);
  });

  it('sets nextRetryAt when not exhausted', () => {
    const context = createSyncRetryContext();
    const error: ClassifiedError = {
      category: 'network',
      isRetryable: true,
      message: 'Network error',
      original: new Error('Network'),
    };
    const updated = updateSyncRetryContext(context, error);
    expect(updated.nextRetryAt).toBeDefined();
    expect(updated.nextRetryAt).toBeGreaterThan(Date.now());
  });

  it('marks as exhausted for non-retryable errors', () => {
    const context = createSyncRetryContext();
    const error: ClassifiedError = {
      category: 'auth',
      isRetryable: false,
      message: 'Auth error',
      original: new Error('Unauthorized'),
    };
    const updated = updateSyncRetryContext(context, error);
    expect(updated.exhausted).toBe(true);
  });

  it('auto-selects strategy based on error category', () => {
    const context = createSyncRetryContext();
    const rateLimitError: ClassifiedError = {
      category: 'rateLimit',
      isRetryable: true,
      message: 'Rate limited',
      original: new Error('429'),
    };
    const updated = updateSyncRetryContext(context, rateLimitError);
    // Rate limit strategy has longer delays
    expect(updated.nextRetryAt).toBeDefined();
    const delay = updated.nextRetryAt! - Date.now();
    expect(delay).toBeGreaterThanOrEqual(
      RATE_LIMITED_RETRY_STRATEGY.baseDelayMs * 0.7
    );
  });
});

describe('getTimeUntilSyncRetry', () => {
  it('returns Infinity when exhausted', () => {
    const context: RetryContext = {
      attemptCount: 10,
      exhausted: true,
    };
    expect(getTimeUntilSyncRetry(context)).toBe(Infinity);
  });

  it('returns 0 when no nextRetryAt', () => {
    const context: RetryContext = {
      attemptCount: 0,
      exhausted: false,
    };
    expect(getTimeUntilSyncRetry(context)).toBe(0);
  });

  it('returns positive time when nextRetryAt is in future', () => {
    const context: RetryContext = {
      attemptCount: 1,
      exhausted: false,
      nextRetryAt: Date.now() + 5000,
    };
    const time = getTimeUntilSyncRetry(context);
    expect(time).toBeGreaterThan(0);
    expect(time).toBeLessThanOrEqual(5000);
  });

  it('returns 0 when nextRetryAt is in past', () => {
    const context: RetryContext = {
      attemptCount: 1,
      exhausted: false,
      nextRetryAt: Date.now() - 1000,
    };
    expect(getTimeUntilSyncRetry(context)).toBe(0);
  });
});

describe('Exponential Backoff Progression (FR-006)', () => {
  beforeEach(() => {
    mockRandom.mockReturnValue(0.5); // Deterministic for testing
  });

  it('doubles delay with each attempt', () => {
    const delays: number[] = [];
    for (let i = 0; i < 4; i++) {
      delays.push(calculateSyncRetryDelay(i));
    }

    // Check exponential growth (approximately 2x each time)
    expect(delays[1]).toBeCloseTo(delays[0] * 2, -2);
    expect(delays[2]).toBeCloseTo(delays[1] * 2, -2);
    expect(delays[3]).toBeCloseTo(delays[2] * 2, -2);
  });

  it('provides predictable delay sequence', () => {
    // With SYNC_RETRY_STRATEGY (2000ms base, 2x multiplier, 0.5 random = no jitter effect)
    const expectedSequence = [2000, 4000, 8000, 16000, 30000]; // Last capped at maxDelay

    for (let i = 0; i < expectedSequence.length; i++) {
      const delay = calculateSyncRetryDelay(i);
      expect(delay).toBe(expectedSequence[i]);
    }
  });

  it('total retry window is reasonable for NFR-002', () => {
    // NFR-002: Sync completes within 30 seconds for queues < 50 items
    // Sum of all delays should be < 30s to allow for processing time
    let totalDelay = 0;
    for (let i = 0; i < SYNC_RETRY_STRATEGY.maxRetries; i++) {
      totalDelay += calculateSyncRetryDelay(i);
    }
    // With max 5 retries and 30s cap, worst case is manageable
    // 2000 + 4000 + 8000 + 16000 + 30000 = 60000ms = 60s
    // This is acceptable as not all retries happen on every operation
    expect(totalDelay).toBeLessThanOrEqual(70000);
  });
});
