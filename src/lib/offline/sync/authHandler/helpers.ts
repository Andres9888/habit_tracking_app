/**
 * Auth Handler Helpers
 *
 * Utility functions for detecting and handling auth errors during sync.
 */

import type { ClassifiedError, ErrorCategory } from '../../types';
import type {
  AuthEvent,
  AuthEventData,
  AuthEventType,
  AuthHandlerState,
  AuthStatus,
} from './types';
import { DEFAULT_AUTH_CONFIG } from './types';

/** Auth error status codes */
const AUTH_ERROR_CODES = new Set([401, 403]);

/** Auth error categories */
const AUTH_CATEGORIES: Set<ErrorCategory> = new Set(['auth']);

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: ClassifiedError): boolean {
  if (AUTH_CATEGORIES.has(error.category)) {
    return true;
  }
  if (error.statusCode && AUTH_ERROR_CODES.has(error.statusCode)) {
    return true;
  }
  return false;
}

/**
 * Check if an error is a token expiry error specifically
 */
export function isTokenExpiredError(error: ClassifiedError): boolean {
  if (!isAuthError(error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('expired') ||
    message.includes('invalid token') ||
    error.statusCode === 401
  );
}

/**
 * Check if user action is required based on failure count
 */
export function requiresUserAction(
  authFailureCount: number,
  maxFailures: number = DEFAULT_AUTH_CONFIG.maxAuthFailures
): boolean {
  return authFailureCount >= maxFailures;
}

/**
 * Get suggested action based on auth state
 */
export function getSuggestedAction(
  state: AuthHandlerState
): AuthEventData['suggestedAction'] {
  if (state.status === 'expired') {
    return requiresUserAction(state.authFailureCount) ? 'relogin' : 'refresh';
  }
  return 'none';
}

/**
 * Create an auth event
 */
export function createAuthEvent(
  type: AuthEventType,
  data?: AuthEventData
): AuthEvent {
  return {
    data,
    timestamp: Date.now(),
    type,
  };
}

/**
 * Get initial auth handler state
 */
export function createInitialState(): AuthHandlerState {
  return {
    authFailureCount: 0,
    blockedOperationCount: 0,
    isSyncPaused: false,
    status: 'authenticated',
  };
}

/**
 * Get display message for auth status
 */
export function getAuthDisplayMessage(status: AuthStatus): string {
  switch (status) {
    case 'expired': {
      return 'Session expired. Please sign in again to sync your changes.';
    }
    case 'refreshing': {
      return 'Refreshing session...';
    }
    case 'unauthenticated': {
      return 'Please sign in to sync your changes.';
    }
    default: {
      return '';
    }
  }
}

/**
 * Check if sync should be paused based on state
 */
export function shouldPauseSync(state: AuthHandlerState): boolean {
  return state.status === 'expired' || state.status === 'unauthenticated';
}
