/**
 * Auth Handler Module
 *
 * Handles authentication expiry during offline sync operations.
 * Implements edge case: "Auth expiry while offline: Store locally, prompt re-auth on sync"
 *
 * Features:
 * - Detects auth errors (401/403) during sync attempts
 * - Pauses sync automatically when auth expires
 * - Emits events for UI to prompt re-authentication
 * - Tracks number of blocked operations
 * - Auto-resumes sync after successful re-auth
 *
 * @example
 * ```ts
 * // In a component
 * const { status, isSyncPaused, blockedOperationCount, notifyAuthRestored } = useAuthHandler({
 *   onAuthRequired: (event) => {
 *     // Show re-login prompt
 *     Alert.alert('Session Expired', 'Please sign in again to sync your changes.');
 *   },
 * });
 *
 * // In sync processing
 * const authHandler = getAuthHandler();
 * if (isAuthError(error)) {
 *   authHandler.handleAuthError(classifyError(error));
 * }
 * ```
 */

// Core
export { createAuthHandler, type AuthHandlerAPI } from './authHandler';

// Singleton
export { getAuthHandler, hasAuthHandler, resetAuthHandler } from './singleton';

// React hook
export { useAuthHandler } from './useAuthHandler';

// Helpers
export {
  createAuthEvent,
  createInitialState,
  getAuthDisplayMessage,
  getSuggestedAction,
  isAuthError,
  isTokenExpiredError,
  requiresUserAction,
  shouldPauseSync,
} from './helpers';

// Types
export type {
  AuthEvent,
  AuthEventData,
  AuthEventListener,
  AuthEventType,
  AuthHandlerConfig,
  AuthHandlerDeps,
  AuthHandlerState,
  AuthStatus,
} from './types';

export { DEFAULT_AUTH_CONFIG } from './types';

export type {
  UseAuthHandlerOptions,
  UseAuthHandlerReturn,
} from './useAuthHandler.types';
