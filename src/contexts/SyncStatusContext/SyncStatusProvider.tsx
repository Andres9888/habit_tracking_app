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

import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';
import type { SyncStatusContextValue, SyncStatusProviderProps } from './types';
import {
  buildSyncStatus,
  type SyncStartCallback,
  type SyncCompleteCallback,
  type SyncErrorCallback,
} from './helpers';
import { SyncStatusContext } from './context';
import { useSyncOrchestrator } from '../../lib/offline/sync/useSyncOrchestrator';

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

  const { state, hasPendingOperations, triggerSync, subscribe } =
    useSyncOrchestrator({
      autoStart,
      onSyncComplete: handleSyncComplete,
      onSyncError: handleSyncError,
    });

  const status = useMemo(
    () => buildSyncStatus(state, hasPendingOperations, lastError),
    [state, hasPendingOperations, lastError]
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

  const value: SyncStatusContextValue = useMemo(
    () => ({
      onSyncComplete,
      onSyncError,
      onSyncStart,
      status,
      triggerSync: wrappedTriggerSync,
    }),
    [status, wrappedTriggerSync, onSyncStart, onSyncComplete, onSyncError]
  );

  return (
    <SyncStatusContext.Provider value={value}>
      {children}
    </SyncStatusContext.Provider>
  );
}

export { SyncStatusContext } from './context';
export default SyncStatusProvider;
