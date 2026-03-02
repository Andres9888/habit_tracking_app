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
import { getOfflineQueueManager } from '../queueManager';
import type { OfflineQueueManagerAPI } from '../queueManager';
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
  const queueManagerRef = useRef<OfflineQueueManagerAPI | null>(null);
  const managerRef = useRef<OfflineSyncManager | null>(null);

  if (!queueManagerRef.current) {
    queueManagerRef.current = getOfflineQueueManager();
  }

  if (!managerRef.current) {
    managerRef.current = getOfflineSyncManager({
      ...config,
      getPendingCount: () =>
        queueManagerRef.current?.getStats().pendingCount ?? 0,
    });
  }

  const manager = managerRef.current;
  const queueManager = queueManagerRef.current;

  if (!manager || !queueManager) {
    throw new Error('OfflineSyncProvider failed to initialize managers');
  }

  const getStatusSnapshot = useCallback(
    () => ({
      ...manager.getStatus(),
      pendingCount: queueManager.getStats().pendingCount,
    }),
    [manager, queueManager]
  );

  const [status, setStatus] = useState<SyncStatus>(getStatusSnapshot);

  useEffect(() => {
    const refresh = () => setStatus(getStatusSnapshot());
    const unsubscribeSyncEvents = manager.subscribe(refresh);
    const unsubscribeQueueState = queueManager.subscribeToState(refresh);
    return () => {
      unsubscribeSyncEvents();
      unsubscribeQueueState();
    };
  }, [getStatusSnapshot, manager, queueManager]);
  const canSync = manager.canSync();
  const resetCircuit = useCallback(() => {
    manager.resetCircuit();
    setStatus(getStatusSnapshot());
  }, [manager, getStatusSnapshot]);
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
