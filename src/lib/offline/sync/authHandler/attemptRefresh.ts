/**
 * Auth Handler - Attempt Refresh & Restore Methods
 */

import type {
  AuthEventData,
  AuthEventType,
  AuthHandlerConfig,
  AuthHandlerDeps,
  AuthHandlerState,
} from './types';

type EmitFn = (type: AuthEventType, data?: AuthEventData) => void;
type UpdateStateFn = (updates: Partial<AuthHandlerState>) => void;

/** Create attemptRefresh method */
export function createAttemptRefresh(
  deps: AuthHandlerDeps,
  cfg: Required<AuthHandlerConfig>,
  updateState: UpdateStateFn,
  emit: EmitFn
): () => Promise<boolean> {
  return async () => {
    if (!deps.refreshToken) return false;
    updateState({ status: 'refreshing' });
    try {
      const success = await deps.refreshToken();
      if (success) {
        updateState({
          authFailureCount: 0,
          blockedOperationCount: 0,
          isSyncPaused: false,
          lastAuthenticatedAt: Date.now(),
          status: 'authenticated',
        });
        emit('auth:refreshed');
        if (cfg.autoResumeSyncOnReauth) deps.onResumeSync?.();
        return true;
      }
      updateState({ status: 'expired' });
      emit('auth:refresh_failed', { reason: 'Token refresh returned false' });
      return false;
    } catch {
      updateState({ status: 'expired' });
      emit('auth:refresh_failed', { reason: 'Token refresh threw error' });
      return false;
    }
  };
}

/** Create notifyAuthRestored method */
export function createNotifyAuthRestored(
  deps: AuthHandlerDeps,
  cfg: Required<AuthHandlerConfig>,
  updateState: UpdateStateFn,
  emit: EmitFn
): () => void {
  return () => {
    updateState({
      authFailureCount: 0,
      blockedOperationCount: 0,
      isSyncPaused: false,
      lastAuthenticatedAt: Date.now(),
      status: 'authenticated',
    });
    emit('auth:restored');
    if (cfg.autoResumeSyncOnReauth) deps.onResumeSync?.();
  };
}
