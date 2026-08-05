/**
 * Auth Handler Helpers Tests
 */

import type { ClassifiedError, ErrorCategory } from '../../../types';
import {
  createAuthEvent,
  createInitialState,
  getAuthDisplayMessage,
  getSuggestedAction,
  isAuthError,
  isTokenExpiredError,
  requiresUserAction,
  shouldPauseSync,
} from '../helpers';
import type { AuthHandlerState, AuthStatus } from '../types';

// Helper to create classified error
function createClassifiedError(
  category: ErrorCategory,
  message = 'Test error',
  statusCode?: number
): ClassifiedError {
  return {
    category,
    isRetryable: category !== 'auth',
    message,
    original: new Error(message),
    statusCode,
  };
}

describe('isAuthError', () => {
  it('returns true for auth category', () => {
    const error = createClassifiedError('auth');
    expect(isAuthError(error)).toBe(true);
  });

  it('returns true for 401 status code', () => {
    const error = createClassifiedError('unknown', 'Error', 401);
    expect(isAuthError(error)).toBe(true);
  });

  it('returns true for 403 status code', () => {
    const error = createClassifiedError('unknown', 'Error', 403);
    expect(isAuthError(error)).toBe(true);
  });

  it('returns false for network errors', () => {
    const error = createClassifiedError('network');
    expect(isAuthError(error)).toBe(false);
  });

  it('returns false for server errors', () => {
    const error = createClassifiedError('server', 'Server error', 500);
    expect(isAuthError(error)).toBe(false);
  });

  it('returns false for validation errors', () => {
    const error = createClassifiedError('validation', 'Validation error', 400);
    expect(isAuthError(error)).toBe(false);
  });
});

describe('isTokenExpiredError', () => {
  it('returns true for expired token message', () => {
    const error = createClassifiedError('auth', 'Token has expired');
    expect(isTokenExpiredError(error)).toBe(true);
  });

  it('returns true for invalid token message', () => {
    const error = createClassifiedError('auth', 'Invalid token provided');
    expect(isTokenExpiredError(error)).toBe(true);
  });

  it('returns true for 401 status code', () => {
    const error = createClassifiedError('auth', 'Unauthorized', 401);
    expect(isTokenExpiredError(error)).toBe(true);
  });

  it('returns false for non-auth errors', () => {
    const error = createClassifiedError('network', 'Network error');
    expect(isTokenExpiredError(error)).toBe(false);
  });

  it('returns false for 403 without expiry message', () => {
    const error = createClassifiedError('auth', 'Forbidden', 403);
    expect(isTokenExpiredError(error)).toBe(false);
  });
});

describe('requiresUserAction', () => {
  it('returns false when failure count below threshold', () => {
    expect(requiresUserAction(1, 3)).toBe(false);
    expect(requiresUserAction(2, 3)).toBe(false);
  });

  it('returns true when failure count equals threshold', () => {
    expect(requiresUserAction(3, 3)).toBe(true);
  });

  it('returns true when failure count exceeds threshold', () => {
    expect(requiresUserAction(5, 3)).toBe(true);
  });

  it('uses default threshold of 3', () => {
    expect(requiresUserAction(2)).toBe(false);
    expect(requiresUserAction(3)).toBe(true);
  });
});

describe('getSuggestedAction', () => {
  it('returns relogin for expired status with high failure count', () => {
    const state: AuthHandlerState = {
      authFailureCount: 3,
      blockedOperationCount: 0,
      isSyncPaused: false,
      status: 'expired',
    };
    expect(getSuggestedAction(state)).toBe('relogin');
  });

  it('returns refresh for expired status with low failure count', () => {
    const state: AuthHandlerState = {
      authFailureCount: 1,
      blockedOperationCount: 0,
      isSyncPaused: false,
      status: 'expired',
    };
    expect(getSuggestedAction(state)).toBe('refresh');
  });

  it('returns none for authenticated status', () => {
    const state: AuthHandlerState = {
      authFailureCount: 0,
      blockedOperationCount: 0,
      isSyncPaused: false,
      status: 'authenticated',
    };
    expect(getSuggestedAction(state)).toBe('none');
  });
});

describe('createAuthEvent', () => {
  it('creates event with type and timestamp', () => {
    const event = createAuthEvent('auth:expired');
    expect(event.type).toBe('auth:expired');
    expect(event.timestamp).toBeCloseTo(Date.now(), -2);
    expect(event.data).toBeUndefined();
  });

  it('includes provided data', () => {
    const event = createAuthEvent('auth:required', {
      pendingOperationCount: 5,
      requiresUserAction: true,
      suggestedAction: 'relogin',
    });
    expect(event.data?.pendingOperationCount).toBe(5);
    expect(event.data?.requiresUserAction).toBe(true);
    expect(event.data?.suggestedAction).toBe('relogin');
  });
});

describe('createInitialState', () => {
  it('returns default state values', () => {
    const state = createInitialState();
    expect(state.status).toBe('authenticated');
    expect(state.authFailureCount).toBe(0);
    expect(state.blockedOperationCount).toBe(0);
    expect(state.isSyncPaused).toBe(false);
  });
});

describe('getAuthDisplayMessage', () => {
  it.each<[AuthStatus, string]>([
    ['expired', 'Session expired. Please sign in again to sync your changes.'],
    ['refreshing', 'Refreshing session...'],
    ['unauthenticated', 'Please sign in to sync your changes.'],
    ['authenticated', ''],
  ])('returns correct message for %s status', (status, expected) => {
    expect(getAuthDisplayMessage(status)).toBe(expected);
  });
});

describe('shouldPauseSync', () => {
  it('returns true for expired status', () => {
    const state: AuthHandlerState = {
      authFailureCount: 1,
      blockedOperationCount: 0,
      isSyncPaused: false,
      status: 'expired',
    };
    expect(shouldPauseSync(state)).toBe(true);
  });

  it('returns true for unauthenticated status', () => {
    const state: AuthHandlerState = {
      authFailureCount: 0,
      blockedOperationCount: 0,
      isSyncPaused: false,
      status: 'unauthenticated',
    };
    expect(shouldPauseSync(state)).toBe(true);
  });

  it('returns false for authenticated status', () => {
    const state: AuthHandlerState = {
      authFailureCount: 0,
      blockedOperationCount: 0,
      isSyncPaused: false,
      status: 'authenticated',
    };
    expect(shouldPauseSync(state)).toBe(false);
  });

  it('returns false for refreshing status', () => {
    const state: AuthHandlerState = {
      authFailureCount: 0,
      blockedOperationCount: 0,
      isSyncPaused: false,
      status: 'refreshing',
    };
    expect(shouldPauseSync(state)).toBe(false);
  });
});
