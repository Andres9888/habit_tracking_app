/* eslint-disable max-lines */
/**
 * SyncStatusProvider - Provides sync status context to the React tree
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSyncOrchestrator } from '../../lib/offline/sync/useSyncOrchestrator';
import { resetDefaultCircuitBreaker } from '../../lib/offline';
import { SyncStatusContext } from './context';
import { buildSyncStatus } from './helpers';
import {
  discardFailedOperations,
  resetFailedOperations,
} from './failedOperations';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';
import type { SyncStatusContextValue, SyncStatusProviderProps } from './types';

type SyncStartCallback = () => void;
type SyncCompleteCallback = (result: SyncOrchestratorResult) => void;
type SyncErrorCallback = (error: Error) => void;

/**
 * Provider component that manages sync orchestration state and provides
 * sync status, callbacks, and manual trigger capabilities to the app.
 *
 * Integrates with the sync orchestrator to monitor pending operations,
 * track sync progress, and notify subscribers of sync events.
 *
 * @param children - React children to render
 * @param autoStart - Whether to automatically start syncing on mount (default: true)
 * @param onStatusChange - Optional callback invoked when sync status changes
 *
 * @example
 * ```tsx
 * <SyncStatusProvider autoStart={true} onStatusChange={handleSyncChange}>
 *   <App />
 * </SyncStatusProvider>
 * ```
 */
export function SyncStatusProvider({
  children,
  autoStart = true,
  onStatusChange,
}: SyncStatusProviderProps): React.ReactElement {
  const syncStartCallbacksRef = useRef<Set<SyncStartCallback>>(new Set());
  const syncCompleteCallbacksRef = useRef<Set<SyncCompleteCallback>>(new Set());
  const syncErrorCallbacksRef = useRef<Set<SyncErrorCallback>>(new Set());
  const [lastError, setLastError] = useState<Error | undefined>();

  const handleSyncComplete = useCallback((result: SyncOrchestratorResult) => {
    setLastError(undefined);
    for (const cb of syncCompleteCallbacksRef.current) cb(result);
  }, []);

  const handleSyncError = useCallback((error: Error) => {
    setLastError(error);
    for (const cb of syncErrorCallbacksRef.current) cb(error);
  }, []);

  const {
    state,
    pendingOperationCount,
    failedOperationCount,
    triggerSync,
    subscribe,
  } = useSyncOrchestrator({
    autoStart,
    onSyncComplete: handleSyncComplete,
    onSyncError: handleSyncError,
  });

  const status = useMemo(
    () =>
      buildSyncStatus(
        state,
        pendingOperationCount,
        lastError,
        failedOperationCount
      ),
    [state, lastError, pendingOperationCount, failedOperationCount]
  );

  useEffect(() => {
    const unsub = subscribe((event) => {
      if (event.type === 'sync:started') {
        for (const cb of syncStartCallbacksRef.current) cb();
      }
    });
    return unsub;
  }, [subscribe]);

  useEffect(() => onStatusChange?.(status), [status, onStatusChange]);

  const onSyncStart = useCallback((cb: SyncStartCallback) => {
    syncStartCallbacksRef.current.add(cb);
    return () => syncStartCallbacksRef.current.delete(cb);
  }, []);

  const onSyncComplete = useCallback((cb: SyncCompleteCallback) => {
    syncCompleteCallbacksRef.current.add(cb);
    return () => syncCompleteCallbacksRef.current.delete(cb);
  }, []);

  const onSyncError = useCallback((cb: SyncErrorCallback) => {
    syncErrorCallbacksRef.current.add(cb);
    return () => syncErrorCallbacksRef.current.delete(cb);
  }, []);

  const wrappedTriggerSync = useCallback(
    (): Promise<SyncOrchestratorResult> => triggerSync(),
    [triggerSync]
  );

  const retryFailed = useCallback((): Promise<SyncOrchestratorResult> => {
    const reset = resetFailedOperations();
    if (reset === 0) return triggerSync();
    // A tripped circuit breaker would let checkPreconditions skip the sync.
    resetDefaultCircuitBreaker();
    return triggerSync();
  }, [triggerSync]);

  const discardFailed = useCallback(() => {
    discardFailedOperations();
  }, []);

  const value: SyncStatusContextValue = useMemo(
    () => ({
      discardFailed,
      onSyncComplete,
      onSyncError,
      onSyncStart,
      retryFailed,
      status,
      triggerSync: wrappedTriggerSync,
    }),
    [
      status,
      wrappedTriggerSync,
      retryFailed,
      discardFailed,
      onSyncStart,
      onSyncComplete,
      onSyncError,
    ]
  );

  if (!SyncStatusContext?.Provider) {
    if (__DEV__) {
      console.error('[SyncStatusProvider] Missing SyncStatusContext.Provider');
    }
    return <>{children}</>;
  }

  return (
    <SyncStatusContext.Provider value={value}>
      {children}
    </SyncStatusContext.Provider>
  );
}

export { SyncStatusContext } from './context';
export default SyncStatusProvider;
