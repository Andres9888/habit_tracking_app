import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { NetworkStatusContextValue } from '../../../contexts/NetworkStatusContext/types';
import { getOfflineQueueManager } from '../queueManager';
import type { SyncOrchestrator } from './SyncOrchestrator';
import type { SyncExecutor, SyncOrchestratorState } from './types';
import type { UseSyncOrchestratorOptions } from './useSyncOrchestrator.types';

interface SyncOrchestratorEffectsArgs {
  autoStart: boolean;
  executor: SyncExecutor;
  isOnline: boolean;
  onOnline: NetworkStatusContextValue['onOnline'];
  onSyncComplete: UseSyncOrchestratorOptions['onSyncComplete'];
  onSyncError: UseSyncOrchestratorOptions['onSyncError'];
  orchestrator: SyncOrchestrator;
  setHasPendingOperations: Dispatch<SetStateAction<boolean>>;
  setPendingOperationCount: Dispatch<SetStateAction<number>>;
  setState: Dispatch<SetStateAction<SyncOrchestratorState>>;
}

export function useSyncOrchestratorEffects({
  autoStart,
  executor,
  isOnline,
  onOnline,
  onSyncComplete,
  onSyncError,
  orchestrator,
  setHasPendingOperations,
  setPendingOperationCount,
  setState,
}: SyncOrchestratorEffectsArgs): void {
  useEffect(() => {
    orchestrator.setExecutor(executor);
  }, [executor, orchestrator]);

  useEffect(
    () =>
      orchestrator.subscribe((event) => {
        setState(orchestrator.getState());
        if (event.type === 'sync:completed' && event.data?.result) {
          onSyncComplete?.(event.data.result);
        }
        if (event.type === 'sync:error' && event.data?.error) {
          onSyncError?.(event.data.error);
        }
      }),
    [onSyncComplete, onSyncError, orchestrator, setState]
  );

  useEffect(() => {
    if (autoStart) orchestrator.start(onOnline);
    return () => orchestrator.stop();
  }, [autoStart, onOnline, orchestrator]);

  useEffect(() => {
    if (!autoStart || !isOnline) return;
    const queueManager = getOfflineQueueManager();
    const scheduleIfPending = () => {
      if (queueManager.getStats().pendingCount > 0) {
        orchestrator.scheduleSync();
      }
    };
    scheduleIfPending();
    return queueManager.subscribe((event) => {
      if (event.type === 'queue:restored') scheduleIfPending();
    });
  }, [autoStart, isOnline, orchestrator]);

  useEffect(() => {
    const queueManager = getOfflineQueueManager();
    const checkPending = () => {
      const pendingCount = queueManager.getStats().pendingCount;
      setHasPendingOperations(pendingCount > 0);
      setPendingOperationCount(pendingCount);
    };
    checkPending();
    return queueManager.subscribe(checkPending);
  }, [setHasPendingOperations, setPendingOperationCount]);
}
