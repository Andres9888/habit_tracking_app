/**
 * Auth Handler
 *
 * Handles authentication expiry during offline sync operations.
 * Implements edge case: "Auth expiry while offline: Store locally, prompt re-auth on sync"
 */

import type {
  AuthEventData,
  AuthEventListener,
  AuthEventType,
  AuthHandlerConfig,
  AuthHandlerDeps,
  AuthHandlerState,
} from './types';
import { DEFAULT_AUTH_CONFIG } from './types';
import { createAuthEvent, createInitialState } from './helpers';
import type { AuthHandlerAPI } from './authHandler.types';
import {
  createAttemptRefresh,
  createHandleAuthError,
  createNotifyAuthRestored,
} from './handlerMethods';

// Re-export type
export type { AuthHandlerAPI } from './authHandler.types';

type EmitFn = (type: AuthEventType, data?: AuthEventData) => void;

/**
 * Create an AuthHandler instance
 */
export function createAuthHandler(
  deps: AuthHandlerDeps,
  config: AuthHandlerConfig = {}
): AuthHandlerAPI {
  const cfg = { ...DEFAULT_AUTH_CONFIG, ...config };
  let state = createInitialState();
  const listeners = new Set<AuthEventListener>();

  const emit: EmitFn = (type, data) => {
    const event = createAuthEvent(type, data);
    for (const listener of listeners) listener(event);
  };

  const updateState = (updates: Partial<AuthHandlerState>) => {
    state = { ...state, ...updates };
  };

  const getState = () => ({ ...state });

  return {
    attemptRefresh: createAttemptRefresh(deps, cfg, updateState, emit),
    getState,
    handleAuthError: createHandleAuthError(
      deps,
      cfg,
      getState,
      updateState,
      emit
    ),
    isSyncPaused: () => state.isSyncPaused,
    notifyAuthRestored: createNotifyAuthRestored(deps, cfg, updateState, emit),
    recordBlockedOperation: () => {
      updateState({ blockedOperationCount: state.blockedOperationCount + 1 });
    },
    reset: () => {
      state = createInitialState();
    },
    subscribe: (listener: AuthEventListener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
