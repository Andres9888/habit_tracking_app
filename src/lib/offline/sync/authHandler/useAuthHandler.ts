/**
 * useAuthHandler Hook
 *
 * React hook for integrating auth handler with components.
 * Provides auth status and callbacks for re-authentication.
 */

import { useAuth } from '@clerk/expo';
import { useCallback, useEffect, useSyncExternalStore } from 'react';

import type { AuthEvent, AuthHandlerState } from './types';
import type {
  UseAuthHandlerOptions,
  UseAuthHandlerReturn,
} from './useAuthHandler.types';
import { getAuthHandler } from './singleton';

/**
 * Get a snapshot of auth handler state for useSyncExternalStore
 */
function getSnapshot(getState: () => AuthHandlerState): AuthHandlerState {
  return getState();
}

/**
 * Hook for managing auth status during offline sync
 */
export function useAuthHandler(
  options: UseAuthHandlerOptions = {}
): UseAuthHandlerReturn {
  const {
    config,
    enabled = true,
    onAuthExpired,
    onAuthRequired,
    onAuthRestored,
  } = options;

  const { getToken, isSignedIn } = useAuth();

  // Create refresh function that uses Clerk's getToken
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = await getToken({ template: 'convex' });
      return token !== null;
    } catch {
      return false;
    }
  }, [getToken]);

  // Initialize auth handler with deps
  const authHandler = getAuthHandler(
    {
      isAuthenticated: () => isSignedIn ?? false,
      refreshToken,
    },
    config
  );

  // Subscribe to state changes
  const state = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        if (!enabled) return () => {};
        return authHandler.subscribe(() => onStoreChange());
      },
      [authHandler, enabled]
    ),
    () => getSnapshot(authHandler.getState),
    () => getSnapshot(authHandler.getState)
  );

  // Subscribe to specific auth events
  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: AuthEvent) => {
      if (event.type === 'auth:expired') onAuthExpired?.(event);
      if (event.type === 'auth:restored') onAuthRestored?.(event);
      if (event.type === 'auth:required') onAuthRequired?.(event);
    };

    return authHandler.subscribe(handleEvent);
  }, [enabled, authHandler, onAuthExpired, onAuthRestored, onAuthRequired]);

  // Notify when user signs back in
  useEffect(() => {
    if (isSignedIn && state.status === 'expired') {
      authHandler.notifyAuthRestored();
    }
  }, [isSignedIn, state.status, authHandler]);

  return {
    attemptRefresh: authHandler.attemptRefresh,
    blockedOperationCount: state.blockedOperationCount,
    isSyncPaused: state.isSyncPaused,
    notifyAuthRestored: authHandler.notifyAuthRestored,
    status: state.status,
  };
}

// Re-export singleton functions for direct usage

export { resetAuthHandler, getAuthHandler } from './singleton';
