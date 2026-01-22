/**
 * Offline Sync Context
 */

import React, {
  createContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  OfflineSyncManager,
  getOfflineSyncManager,
  type OfflineSyncManagerConfig,
} from '../syncManager';
import type { SyncEvent, SyncStatus } from '../types';

export interface OfflineSyncContextValue {
  status: SyncStatus;
  canSync: boolean;
  resetCircuit: () => void;
  subscribe: (listener: (event: SyncEvent) => void) => () => void;
  getManager: () => OfflineSyncManager;
}

export const OfflineSyncContext = createContext<OfflineSyncContextValue | null>(
  null
);

interface OfflineSyncProviderProps {
  children: React.ReactNode;
  config?: OfflineSyncManagerConfig;
}

export function OfflineSyncProvider({
  children,
  config,
}: OfflineSyncProviderProps) {
  const managerRef = useRef<OfflineSyncManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = getOfflineSyncManager(config);
  }
  const manager = managerRef.current;

  const [status, setStatus] = useState<SyncStatus>(manager.getStatus());

  useEffect(() => {
    const unsubscribe = manager.subscribe(() => setStatus(manager.getStatus()));
    return unsubscribe;
  }, [manager]);

  const canSync = manager.canSync();
  const resetCircuit = useCallback(() => {
    manager.resetCircuit();
    setStatus(manager.getStatus());
  }, [manager]);
  const subscribe = useCallback(
    (listener: (event: SyncEvent) => void) => manager.subscribe(listener),
    [manager]
  );
  const getManager = useCallback(() => manager, [manager]);

  const value = useMemo(
    (): OfflineSyncContextValue => ({
      canSync,
      getManager,
      resetCircuit,
      status,
      subscribe,
    }),
    [canSync, getManager, resetCircuit, status, subscribe]
  );

  return (
    <OfflineSyncContext.Provider value={value}>
      {children}
    </OfflineSyncContext.Provider>
  );
}
