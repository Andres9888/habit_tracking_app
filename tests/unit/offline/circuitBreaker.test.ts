/**
 * Circuit Breaker Tests
 */

import {
  CircuitBreaker,
  createCircuitBreaker,
} from '~/lib/offline/circuitBreaker';
import type { ClassifiedError } from '~/lib/offline/types';

describe('CircuitBreaker', () => {
  const createTestError = (
    category: ClassifiedError['category'],
    isRetryable = true
  ): ClassifiedError => ({
    category,
    isRetryable,
    message: 'Test error',
    original: new Error('Test error'),
  });

  describe('initial state', () => {
    it('starts in closed state', () => {
      const cb = new CircuitBreaker();
      expect(cb.getStatus().state).toBe('closed');
      expect(cb.canExecute()).toBe(true);
      expect(cb.getStatus().failureCount).toBe(0);
    });
  });

  describe('failure recording', () => {
    it('opens circuit after threshold failures', () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });
      cb.recordFailure(createTestError('network'));
      cb.recordFailure(createTestError('network'));
      cb.recordFailure(createTestError('network'));
      expect(cb.getStatus().state).toBe('open');
      expect(cb.canExecute()).toBe(false);
    });

    it('ignores errors outside trigger categories', () => {
      const cb = new CircuitBreaker({
        failureThreshold: 1,
        triggerCategories: ['network'],
      });
      cb.recordFailure(createTestError('validation'));
      expect(cb.getStatus().state).toBe('closed');
    });
  });

  describe('success recording', () => {
    it('resets failure count on success in closed state', () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });
      cb.recordFailure(createTestError('network'));
      cb.recordFailure(createTestError('network'));
      cb.recordSuccess();
      expect(cb.getStatus().failureCount).toBe(0);
    });
  });

  describe('half-open state', () => {
    it('transitions to half-open after reset timeout', () => {
      jest.useFakeTimers();
      const cb = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeoutMs: 1000,
      });
      cb.recordFailure(createTestError('network'));
      expect(cb.canExecute()).toBe(false);
      jest.advanceTimersByTime(1001);
      expect(cb.canExecute()).toBe(true);
      expect(cb.getStatus().state).toBe('half-open');
      jest.useRealTimers();
    });

    it('closes on success in half-open state', () => {
      jest.useFakeTimers();
      const cb = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeoutMs: 1000,
        successThreshold: 2,
      });
      cb.recordFailure(createTestError('network'));
      jest.advanceTimersByTime(1001);
      cb.canExecute();
      cb.recordSuccess();
      cb.recordSuccess();
      expect(cb.getStatus().state).toBe('closed');
      jest.useRealTimers();
    });
  });

  describe('reset', () => {
    it('forces circuit to closed state', () => {
      const cb = new CircuitBreaker({ failureThreshold: 1 });
      cb.recordFailure(createTestError('network'));
      expect(cb.getStatus().state).toBe('open');
      cb.reset();
      expect(cb.getStatus().state).toBe('closed');
      expect(cb.canExecute()).toBe(true);
    });
  });

  describe('subscribe', () => {
    it('notifies listeners on state change', () => {
      const cb = new CircuitBreaker({ failureThreshold: 1 });
      const listener = jest.fn();
      cb.subscribe(listener);
      cb.recordFailure(createTestError('network'));
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'open' })
      );
    });

    it('allows unsubscribing', () => {
      const cb = new CircuitBreaker({ failureThreshold: 1 });
      const listener = jest.fn();
      const unsubscribe = cb.subscribe(listener);
      unsubscribe();
      cb.recordFailure(createTestError('network'));
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('createCircuitBreaker', () => {
    it('creates instance with custom config', () => {
      const cb = createCircuitBreaker({ failureThreshold: 10 });
      for (let i = 0; i < 5; i++) cb.recordFailure(createTestError('network'));
      expect(cb.getStatus().state).toBe('closed');
    });
  });
});
