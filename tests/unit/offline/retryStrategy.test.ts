/**
 * Retry Strategy Tests
 */

import {
  calculateDelay,
  createRetryContext,
  updateRetryContext,
  shouldRetry as shouldRetryContext,
  getTimeUntilRetry,
  executeWithRetry,
  selectStrategy,
  DEFAULT_RETRY_STRATEGY,
} from '~/lib/offline/retryStrategy';
import type { ClassifiedError } from '~/lib/offline/types';

describe('retryStrategy', () => {
  const createTestError = (
    category: ClassifiedError['category'],
    isRetryable = true,
    suggestedDelay?: number
  ): ClassifiedError => ({
    category,
    isRetryable,
    message: 'Test error',
    original: new Error('Test error'),
    suggestedDelay,
  });

  describe('calculateDelay', () => {
    it('calculates exponential backoff', () => {
      const strategy = Object.assign({}, DEFAULT_RETRY_STRATEGY, {
        jitterFactor: 0,
      });
      expect(calculateDelay(0, strategy)).toBe(1000);
      expect(calculateDelay(1, strategy)).toBe(2000);
      expect(calculateDelay(2, strategy)).toBe(4000);
    });

    it('caps at max delay', () => {
      const strategy = {
        ...DEFAULT_RETRY_STRATEGY,
        jitterFactor: 0,
        maxDelayMs: 5000,
      };
      expect(calculateDelay(10, strategy)).toBe(5000);
    });

    it('uses error suggested delay for first retry', () => {
      const strategy = Object.assign({}, DEFAULT_RETRY_STRATEGY, {
        jitterFactor: 0,
      });
      expect(calculateDelay(0, strategy, 30000)).toBe(30000);
    });
  });

  describe('createRetryContext', () => {
    it('creates initial context', () => {
      const context = createRetryContext();
      expect(context.attemptCount).toBe(0);
      expect(context.exhausted).toBe(false);
    });
  });

  describe('updateRetryContext', () => {
    it('increments attempt count', () => {
      let context = createRetryContext();
      context = updateRetryContext(context, createTestError('network'));
      expect(context.attemptCount).toBe(1);
    });

    it('marks exhausted after max retries', () => {
      const strategy = { ...DEFAULT_RETRY_STRATEGY, maxRetries: 2 };
      let context = createRetryContext();
      context = updateRetryContext(
        context,
        createTestError('network'),
        strategy
      );
      expect(context.exhausted).toBe(false);
      context = updateRetryContext(
        context,
        createTestError('network'),
        strategy
      );
      expect(context.exhausted).toBe(true);
    });

    it('immediately exhausts for non-retryable errors', () => {
      let context = createRetryContext();
      context = updateRetryContext(context, createTestError('auth', false));
      expect(context.exhausted).toBe(true);
    });
  });

  describe('shouldRetryContext', () => {
    it('returns true for fresh context', () => {
      expect(shouldRetryContext(createRetryContext())).toBe(true);
    });

    it('returns false for exhausted context', () => {
      expect(
        shouldRetryContext({ ...createRetryContext(), exhausted: true })
      ).toBe(false);
    });
  });

  describe('getTimeUntilRetry', () => {
    it('returns 0 for exhausted context', () => {
      expect(
        getTimeUntilRetry({ ...createRetryContext(), exhausted: true })
      ).toBe(0);
    });

    it('returns remaining time', () => {
      const now = Date.now();
      const context = { ...createRetryContext(), nextRetryAt: now + 5000 };
      expect(getTimeUntilRetry(context, now)).toBe(5000);
    });
  });

  describe('executeWithRetry', () => {
    it('returns result on success', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await executeWithRetry(fn, () =>
        createTestError('network')
      );
      expect(result).toBe('success');
    });

    it('retries on retryable error', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');
      const result = await executeWithRetry(
        fn,
        () => createTestError('network'),
        { ...DEFAULT_RETRY_STRATEGY, baseDelayMs: 1 }
      );
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('throws immediately for non-retryable errors', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Auth error'));
      await expect(
        executeWithRetry(fn, () => createTestError('auth', false))
      ).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectStrategy', () => {
    it('adjusts for rate limit errors', () => {
      const result = selectStrategy(
        DEFAULT_RETRY_STRATEGY,
        createTestError('rateLimit')
      );
      expect(result.baseDelayMs).toBeGreaterThanOrEqual(5000);
    });

    it('adjusts for server errors', () => {
      const result = selectStrategy(
        DEFAULT_RETRY_STRATEGY,
        createTestError('server')
      );
      expect(result.backoffMultiplier).toBe(2.5);
    });
  });
});
