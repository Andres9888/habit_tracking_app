import { useCallback, useRef, useState } from 'react';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';

type SyncStartCallback = () => void;
type SyncCompleteCallback = (result: SyncOrchestratorResult) => void;
type SyncErrorCallback = (error: Error) => void;

export function useSyncCallbackRegistry() {
  const startCallbacks = useRef(new Set<SyncStartCallback>());
  const completeCallbacks = useRef(new Set<SyncCompleteCallback>());
  const errorCallbacks = useRef(new Set<SyncErrorCallback>());
  const [lastError, setLastError] = useState<Error>();

  const handleSyncComplete = useCallback((result: SyncOrchestratorResult) => {
    setLastError(undefined);
    for (const callback of completeCallbacks.current) callback(result);
  }, []);
  const handleSyncError = useCallback((error: Error) => {
    setLastError(error);
    for (const callback of errorCallbacks.current) callback(error);
  }, []);
  const notifySyncStart = useCallback(() => {
    for (const callback of startCallbacks.current) callback();
  }, []);
  const onSyncStart = useCallback((callback: SyncStartCallback) => {
    startCallbacks.current.add(callback);
    return () => startCallbacks.current.delete(callback);
  }, []);
  const onSyncComplete = useCallback((callback: SyncCompleteCallback) => {
    completeCallbacks.current.add(callback);
    return () => completeCallbacks.current.delete(callback);
  }, []);
  const onSyncError = useCallback((callback: SyncErrorCallback) => {
    errorCallbacks.current.add(callback);
    return () => errorCallbacks.current.delete(callback);
  }, []);

  return {
    handleSyncComplete,
    handleSyncError,
    lastError,
    notifySyncStart,
    onSyncComplete,
    onSyncError,
    onSyncStart,
  };
}
