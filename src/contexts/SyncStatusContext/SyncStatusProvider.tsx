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
import { SyncStatusContext } from './context';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';
import type { SyncStatusContextValue, SyncStatusProviderProps } from './types';
import {
  buildSyncStatus,
  type SyncStartCallback,
  type SyncCompleteCallback,
  type SyncErrorCallback,
} from './helpers';

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
