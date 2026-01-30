/**
 * Auth Handler Types
 *
 * Types for handling authentication expiry during offline sync.
 * Implements edge case: "Auth expiry while offline: Store locally, prompt re-auth on sync"
 */

/**
 * Auth status states for sync operations
 */
export type AuthStatus =
  | 'authenticated' // Token valid, sync can proceed
  | 'expired' // Token expired, needs re-auth
  | 'refreshing' // Token refresh in progress
  | 'unauthenticated'; // No auth, user signed out

/**
 * Auth event types for sync coordination
 */
export type AuthEventType =
  | 'auth:expired' // Auth token expired during sync
  | 'auth:refreshed' // Auth successfully refreshed
  | 'auth:refresh_failed' // Token refresh failed
  | 'auth:required' // User action required (re-login)
  | 'auth:restored'; // Auth restored after user action

/**
 * Auth event payload
 */
export interface AuthEvent {
  /** Event type */
  type: AuthEventType;
  /** Event timestamp */
  timestamp: number;
  /** Additional event data */
  data?: AuthEventData;
}

/**
 * Auth event data
 */
export interface AuthEventData {
  /** Reason for the event */
  reason?: string;
  /** Number of pending operations blocked by auth */
  pendingOperationCount?: number;
  /** Whether user action is required */
  requiresUserAction?: boolean;
  /** Suggested action for the user */
  suggestedAction?: 'relogin' | 'refresh' | 'none';
  /** HTTP status code if applicable */
  statusCode?: number;
}

/**
 * Auth event listener callback
 */
export type AuthEventListener = (event: AuthEvent) => void;

/**
 * Auth handler state
 */
export interface AuthHandlerState {
  /** Current auth status */
  status: AuthStatus;
  /** Timestamp of last successful auth */
  lastAuthenticatedAt?: number;
  /** Timestamp when auth expired */
  expiredAt?: number;
  /** Number of consecutive auth failures */
  authFailureCount: number;
  /** Number of operations blocked due to auth */
  blockedOperationCount: number;
  /** Whether sync is paused due to auth */
  isSyncPaused: boolean;
}

/**
 * Auth handler configuration
 */
export interface AuthHandlerConfig {
  /** Max consecutive auth failures before requiring user action */
  maxAuthFailures?: number;
  /** Delay before notifying user (ms) - allows auto-refresh to try */
  notificationDelayMs?: number;
  /** Whether to automatically pause sync on auth error */
  autoPauseSyncOnAuthError?: boolean;
  /** Whether to automatically resume sync after re-auth */
  autoResumeSyncOnReauth?: boolean;
}

/** Default auth handler configuration */
export const DEFAULT_AUTH_CONFIG: Required<AuthHandlerConfig> = {
  autoPauseSyncOnAuthError: true,
  autoResumeSyncOnReauth: true,
  maxAuthFailures: 3,
  notificationDelayMs: 2000,
};

/**
 * Deps for auth handler
 */
export interface AuthHandlerDeps {
  /** Check if user is currently authenticated */
  isAuthenticated: () => boolean;
  /** Attempt to refresh the auth token */
  refreshToken?: () => Promise<boolean>;
  /** Callback when sync should pause */
  onPauseSync?: () => void;
  /** Callback when sync can resume */
  onResumeSync?: () => void;
}
