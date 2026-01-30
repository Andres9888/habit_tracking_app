/**
 * Auth Handler - Handle Auth Error Method
 */

import type { ClassifiedError } from '../../types';
import type {
  AuthEventData,
  AuthEventType,
  AuthHandlerConfig,
  AuthHandlerDeps,
  AuthHandlerState,
} from './types';
import {
  getSuggestedAction,
  isAuthError,
  requiresUserAction,
  shouldPauseSync,
} from './helpers';

type EmitFn = (type: AuthEventType, data?: AuthEventData) => void;
type UpdateStateFn = (updates: Partial<AuthHandlerState>) => void;
type GetStateFn = () => AuthHandlerState;

/** Create handleAuthError method */
export function createHandleAuthError(
  deps: AuthHandlerDeps,
  cfg: Required<AuthHandlerConfig>,
  getState: GetStateFn,
  updateState: UpdateStateFn,
  emit: EmitFn
): (error: ClassifiedError) => void {
  return (error: ClassifiedError) => {
    if (!isAuthError(error)) return;
    const state = getState();
    const failureCount = state.authFailureCount + 1;
    const shouldPause = shouldPauseSync({ ...state, status: 'expired' });

    updateState({
      authFailureCount: failureCount,
      expiredAt: Date.now(),
      isSyncPaused: cfg.autoPauseSyncOnAuthError && shouldPause,
      status: 'expired',
    });

    emit('auth:expired', {
      pendingOperationCount: state.blockedOperationCount,
      requiresUserAction: requiresUserAction(failureCount, cfg.maxAuthFailures),
      statusCode: error.statusCode,
      suggestedAction: getSuggestedAction(getState()),
    });

    if (cfg.autoPauseSyncOnAuthError) deps.onPauseSync?.();

    if (requiresUserAction(failureCount, cfg.maxAuthFailures)) {
      setTimeout(() => {
        emit('auth:required', {
          pendingOperationCount: getState().blockedOperationCount,
          requiresUserAction: true,
          suggestedAction: 'relogin',
        });
      }, cfg.notificationDelayMs);
    }
  };
}
