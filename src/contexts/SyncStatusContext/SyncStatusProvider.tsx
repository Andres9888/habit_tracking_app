import React, { useCallback, useEffect, useMemo } from 'react';
import { useSyncOrchestrator } from '../../lib/offline/sync/useSyncOrchestrator';
import { SyncStatusContext } from './context';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';
import type { SyncStatusContextValue, SyncStatusProviderProps } from './types';
import { buildSyncStatus } from './SyncStatusProvider.helpers';
import { useSyncCallbackRegistry } from './useSyncCallbackRegistry';

export function SyncStatusProvider({
  children,
  autoStart = true,
  onStatusChange,
}: SyncStatusProviderProps): React.ReactElement {
  const callbacks = useSyncCallbackRegistry();

  const { state, pendingOperationCount, triggerSync, subscribe } =
    useSyncOrchestrator({
      autoStart,
      onSyncComplete: callbacks.handleSyncComplete,
      onSyncError: callbacks.handleSyncError,
    });

  const status = useMemo(
    () => buildSyncStatus(state, pendingOperationCount, callbacks.lastError),
    [callbacks.lastError, pendingOperationCount, state]
  );

  useEffect(() => {
    const unsub = subscribe((event) => {
      if (event.type === 'sync:started') {
        callbacks.notifySyncStart();
      }
    });
    return unsub;
  }, [callbacks.notifySyncStart, subscribe]);

  useEffect(() => onStatusChange?.(status), [status, onStatusChange]);

  const wrappedTriggerSync = useCallback(
    (): Promise<SyncOrchestratorResult> => triggerSync(),
    [triggerSync]
  );

  const value: SyncStatusContextValue = useMemo(
    () => ({
      onSyncComplete: callbacks.onSyncComplete,
      onSyncError: callbacks.onSyncError,
      onSyncStart: callbacks.onSyncStart,
      status,
      triggerSync: wrappedTriggerSync,
    }),
    [
      callbacks.onSyncComplete,
      callbacks.onSyncError,
      callbacks.onSyncStart,
      status,
      wrappedTriggerSync,
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
