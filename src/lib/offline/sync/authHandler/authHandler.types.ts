/**
 * Auth Handler API Types
 */

import type { ClassifiedError } from '../../types';
import type { AuthEventListener, AuthHandlerState } from './types';

/**
 * Auth Handler API
 */
export interface AuthHandlerAPI {
  /** Get current state */
  getState: () => AuthHandlerState;
  /** Handle an auth error from sync */
  handleAuthError: (error: ClassifiedError) => void;
  /** Record a blocked operation */
  recordBlockedOperation: () => void;
  /** Notify that auth has been restored (user re-logged in) */
  notifyAuthRestored: () => void;
  /** Attempt to refresh the token */
  attemptRefresh: () => Promise<boolean>;
  /** Check if sync is paused due to auth */
  isSyncPaused: () => boolean;
  /** Subscribe to auth events */
  subscribe: (listener: AuthEventListener) => () => void;
  /** Reset state (for testing) */
  reset: () => void;
}
