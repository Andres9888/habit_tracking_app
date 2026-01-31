/**
 * useAuthHandler Hook Types
 */

import type { AuthEventListener, AuthHandlerConfig, AuthStatus } from './types';

/**
 * Options for useAuthHandler hook
 */
export interface UseAuthHandlerOptions {
  /** Configuration for the auth handler */
  config?: AuthHandlerConfig;
  /** Callback when auth expires */
  onAuthExpired?: AuthEventListener;
  /** Callback when auth is restored */
  onAuthRestored?: AuthEventListener;
  /** Callback when user action is required */
  onAuthRequired?: AuthEventListener;
  /** Whether the hook is enabled */
  enabled?: boolean;
}

/**
 * Return value from useAuthHandler hook
 */
export interface UseAuthHandlerReturn {
  /** Current auth status */
  status: AuthStatus;
  /** Whether sync is paused due to auth */
  isSyncPaused: boolean;
  /** Number of operations blocked by auth issues */
  blockedOperationCount: number;
  /** Notify that user has re-authenticated */
  notifyAuthRestored: () => void;
  /** Attempt to refresh the auth token */
  attemptRefresh: () => Promise<boolean>;
}
