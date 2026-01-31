/**
 * Auth Handler Tests
 */

import type { ClassifiedError } from '../../../types';
import { createAuthHandler, type AuthHandlerAPI } from '../authHandler';
import type { AuthEvent, AuthHandlerConfig, AuthHandlerDeps } from '../types';

// Helper to create classified error
function createAuthError(statusCode = 401): ClassifiedError {
  return {
    category: 'auth',
    isRetryable: false,
    message: 'Unauthorized',
    original: new Error('Unauthorized'),
    statusCode,
  };
}

function createNetworkError(): ClassifiedError {
  return {
    category: 'network',
    isRetryable: true,
    message: 'Network error',
    original: new Error('Network error'),
  };
}

describe('createAuthHandler', () => {
  let authHandler: AuthHandlerAPI;
  let mockDeps: AuthHandlerDeps;
  let events: AuthEvent[];

  beforeEach(() => {
    events = [];
    mockDeps = {
      isAuthenticated: jest.fn(() => true),
      onPauseSync: jest.fn(),
      onResumeSync: jest.fn(),
      refreshToken: jest.fn(async () => true),
    };
    authHandler = createAuthHandler(mockDeps);
    authHandler.subscribe((event) => events.push(event));
  });

  describe('getState', () => {
    it('returns initial state', () => {
      const state = authHandler.getState();
      expect(state.status).toBe('authenticated');
      expect(state.authFailureCount).toBe(0);
      expect(state.blockedOperationCount).toBe(0);
      expect(state.isSyncPaused).toBe(false);
    });
  });

  describe('handleAuthError', () => {
    it('updates state to expired on auth error', () => {
      authHandler.handleAuthError(createAuthError());
      const state = authHandler.getState();
      expect(state.status).toBe('expired');
      expect(state.authFailureCount).toBe(1);
    });

    it('increments failure count on repeated errors', () => {
      authHandler.handleAuthError(createAuthError());
      authHandler.handleAuthError(createAuthError());
      authHandler.handleAuthError(createAuthError());
      expect(authHandler.getState().authFailureCount).toBe(3);
    });

    it('emits auth:expired event', () => {
      authHandler.handleAuthError(createAuthError());
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('auth:expired');
    });

    it('includes status code in event data', () => {
      authHandler.handleAuthError(createAuthError(403));
      expect(events[0].data?.statusCode).toBe(403);
    });

    it('pauses sync by default', () => {
      authHandler.handleAuthError(createAuthError());
      expect(authHandler.getState().isSyncPaused).toBe(true);
      expect(mockDeps.onPauseSync).toHaveBeenCalled();
    });

    it('ignores non-auth errors', () => {
      authHandler.handleAuthError(createNetworkError());
      const state = authHandler.getState();
      expect(state.status).toBe('authenticated');
      expect(state.authFailureCount).toBe(0);
      expect(events).toHaveLength(0);
    });

    it('emits auth:required after max failures', async () => {
      jest.useFakeTimers();
      authHandler.handleAuthError(createAuthError());
      authHandler.handleAuthError(createAuthError());
      authHandler.handleAuthError(createAuthError()); // 3rd failure

      await jest.advanceTimersByTimeAsync(2000);
      const requiredEvent = events.find((e) => e.type === 'auth:required');
      expect(requiredEvent).toBeDefined();
      expect(requiredEvent?.data?.suggestedAction).toBe('relogin');
      jest.useRealTimers();
    });
  });

  describe('recordBlockedOperation', () => {
    it('increments blocked operation count', () => {
      authHandler.recordBlockedOperation();
      authHandler.recordBlockedOperation();
      expect(authHandler.getState().blockedOperationCount).toBe(2);
    });
  });

  describe('notifyAuthRestored', () => {
    it('resets state to authenticated', () => {
      authHandler.handleAuthError(createAuthError());
      authHandler.recordBlockedOperation();
      authHandler.notifyAuthRestored();

      const state = authHandler.getState();
      expect(state.status).toBe('authenticated');
      expect(state.authFailureCount).toBe(0);
      expect(state.blockedOperationCount).toBe(0);
      expect(state.isSyncPaused).toBe(false);
    });

    it('emits auth:restored event', () => {
      authHandler.handleAuthError(createAuthError());
      events = [];
      authHandler.notifyAuthRestored();

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('auth:restored');
    });

    it('calls onResumeSync callback', () => {
      authHandler.handleAuthError(createAuthError());
      authHandler.notifyAuthRestored();
      expect(mockDeps.onResumeSync).toHaveBeenCalled();
    });
  });

  describe('attemptRefresh', () => {
    it('returns true on successful refresh', async () => {
      (mockDeps.refreshToken as jest.Mock).mockResolvedValue(true);
      const result = await authHandler.attemptRefresh();
      expect(result).toBe(true);
    });

    it('updates state to authenticated on success', async () => {
      authHandler.handleAuthError(createAuthError());
      (mockDeps.refreshToken as jest.Mock).mockResolvedValue(true);

      await authHandler.attemptRefresh();
      expect(authHandler.getState().status).toBe('authenticated');
    });

    it('emits auth:refreshed on success', async () => {
      (mockDeps.refreshToken as jest.Mock).mockResolvedValue(true);
      events = [];
      await authHandler.attemptRefresh();

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('auth:refreshed');
    });

    it('returns false on failed refresh', async () => {
      (mockDeps.refreshToken as jest.Mock).mockResolvedValue(false);
      const result = await authHandler.attemptRefresh();
      expect(result).toBe(false);
    });

    it('emits auth:refresh_failed on failure', async () => {
      (mockDeps.refreshToken as jest.Mock).mockResolvedValue(false);
      events = [];
      await authHandler.attemptRefresh();

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('auth:refresh_failed');
    });

    it('handles refresh token throwing error', async () => {
      (mockDeps.refreshToken as jest.Mock).mockRejectedValue(
        new Error('Refresh failed')
      );
      events = [];
      const result = await authHandler.attemptRefresh();

      expect(result).toBe(false);
      expect(events[0].type).toBe('auth:refresh_failed');
    });

    it('returns false if no refreshToken function provided', async () => {
      const handlerWithoutRefresh = createAuthHandler({
        isAuthenticated: () => true,
      });
      const result = await handlerWithoutRefresh.attemptRefresh();
      expect(result).toBe(false);
    });

    it('resumes sync after successful refresh', async () => {
      authHandler.handleAuthError(createAuthError());
      (mockDeps.refreshToken as jest.Mock).mockResolvedValue(true);

      await authHandler.attemptRefresh();
      expect(mockDeps.onResumeSync).toHaveBeenCalled();
    });
  });

  describe('isSyncPaused', () => {
    it('returns false initially', () => {
      expect(authHandler.isSyncPaused()).toBe(false);
    });

    it('returns true after auth error', () => {
      authHandler.handleAuthError(createAuthError());
      expect(authHandler.isSyncPaused()).toBe(true);
    });

    it('returns false after auth restored', () => {
      authHandler.handleAuthError(createAuthError());
      authHandler.notifyAuthRestored();
      expect(authHandler.isSyncPaused()).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('returns unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = authHandler.subscribe(listener);
      expect(typeof unsubscribe).toBe('function');
    });

    it('stops receiving events after unsubscribe', () => {
      const listener = jest.fn();
      const unsubscribe = authHandler.subscribe(listener);
      unsubscribe();

      authHandler.handleAuthError(createAuthError());
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('resets state to initial values', () => {
      authHandler.handleAuthError(createAuthError());
      authHandler.recordBlockedOperation();
      authHandler.reset();

      const state = authHandler.getState();
      expect(state.status).toBe('authenticated');
      expect(state.authFailureCount).toBe(0);
      expect(state.blockedOperationCount).toBe(0);
    });
  });

  describe('configuration', () => {
    it('respects custom maxAuthFailures', async () => {
      jest.useFakeTimers();
      const handler = createAuthHandler(mockDeps, { maxAuthFailures: 1 });
      const configEvents: AuthEvent[] = [];
      handler.subscribe((e) => configEvents.push(e));

      handler.handleAuthError(createAuthError()); // 1st failure = max
      await jest.advanceTimersByTimeAsync(2000);

      const requiredEvent = configEvents.find(
        (e) => e.type === 'auth:required'
      );
      expect(requiredEvent).toBeDefined();
      jest.useRealTimers();
    });

    it('respects autoPauseSyncOnAuthError = false', () => {
      const handler = createAuthHandler(mockDeps, {
        autoPauseSyncOnAuthError: false,
      });
      handler.handleAuthError(createAuthError());

      expect(handler.getState().isSyncPaused).toBe(false);
      expect(mockDeps.onPauseSync).not.toHaveBeenCalled();
    });

    it('respects autoResumeSyncOnReauth = false', async () => {
      const handler = createAuthHandler(mockDeps, {
        autoResumeSyncOnReauth: false,
      });
      handler.handleAuthError(createAuthError());
      (mockDeps.refreshToken as jest.Mock).mockResolvedValue(true);

      await handler.attemptRefresh();
      expect(mockDeps.onResumeSync).not.toHaveBeenCalled();
    });
  });
});
