/**
 * Auth Handler Singleton Tests
 */

import { getAuthHandler, hasAuthHandler, resetAuthHandler } from '../singleton';
import type { AuthHandlerDeps } from '../types';

describe('Auth Handler Singleton', () => {
  afterEach(() => {
    resetAuthHandler();
  });

  describe('getAuthHandler', () => {
    it('returns the same instance on subsequent calls', () => {
      const deps: AuthHandlerDeps = { isAuthenticated: () => true };
      const first = getAuthHandler(deps);
      const second = getAuthHandler(deps);
      expect(first).toBe(second);
    });

    it('creates instance with default deps if none provided', () => {
      const handler = getAuthHandler();
      expect(handler).toBeDefined();
      expect(handler.getState().status).toBe('authenticated');
    });

    it('ignores deps on subsequent calls', () => {
      const deps1: AuthHandlerDeps = { isAuthenticated: () => true };
      const deps2: AuthHandlerDeps = { isAuthenticated: () => false };
      const first = getAuthHandler(deps1);
      const second = getAuthHandler(deps2);
      expect(first).toBe(second);
    });
  });

  describe('resetAuthHandler', () => {
    it('clears the singleton instance', () => {
      const deps: AuthHandlerDeps = { isAuthenticated: () => true };
      const first = getAuthHandler(deps);
      resetAuthHandler();
      const second = getAuthHandler(deps);
      expect(first).not.toBe(second);
    });

    it('resets state of existing instance', () => {
      const deps: AuthHandlerDeps = { isAuthenticated: () => true };
      const handler = getAuthHandler(deps);

      // Modify state
      handler.handleAuthError({
        category: 'auth',
        isRetryable: false,
        message: 'Unauthorized',
        original: new Error('Unauthorized'),
        statusCode: 401,
      });
      expect(handler.getState().status).toBe('expired');

      resetAuthHandler();
      const newHandler = getAuthHandler(deps);
      expect(newHandler.getState().status).toBe('authenticated');
    });

    it('handles reset when no instance exists', () => {
      expect(() => resetAuthHandler()).not.toThrow();
    });
  });

  describe('hasAuthHandler', () => {
    it('returns false when not initialized', () => {
      expect(hasAuthHandler()).toBe(false);
    });

    it('returns true after initialization', () => {
      getAuthHandler();
      expect(hasAuthHandler()).toBe(true);
    });

    it('returns false after reset', () => {
      getAuthHandler();
      resetAuthHandler();
      expect(hasAuthHandler()).toBe(false);
    });
  });
});
