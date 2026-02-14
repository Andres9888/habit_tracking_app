/**
 * useSyncOrchestrator Hook
 *
 * React hook for integrating the sync orchestrator with components.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNetworkStatus } from '../../../contexts/NetworkStatusContext';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
import { getOfflineQueueManager } from '../queueManager';
import { getSyncOrchestrator } from './singleton';
import type { SyncOrchestratorState, SyncProgressCallback } from './types';
import type {
  UseSyncOrchestratorOptions,
  UseSyncOrchestratorReturn,
} from './useSyncOrchestrator.types';

export function useSyncOrchestrator(
  options: UseSyncOrchestratorOptions = {}
): UseSyncOrchestratorReturn {
  const { config, autoStart = true, onSyncComplete, onSyncError } = options;
  const { isOnline, onOnline } = useNetworkStatus();
  const toggleMutation = useToggleHabitWithTimezone();

  const orchestratorRef = useRef(getSyncOrchestrator(config));
  const orchestrator = orchestratorRef.current;

  const [state, setState] = useState<SyncOrchestratorState>(
    orchestrator.getState()
  );
  const [hasPendingOperations, setHasPendingOperations] = useState(false);

  useEffect(() => {
    orchestrator.setExecutor(async (payload) => {
      await toggleMutation({ date: payload.date, habitId: payload.habitId });
    });
  }, [orchestrator, toggleMutation]);

  useEffect(() => {
    const unsubscribe = orchestrator.subscribe((event) => {
      setState(orchestrator.getState());
      if (event.type === 'sync:completed' && event.data?.result) {
        onSyncComplete?.(event.data.result);
      }
      if (event.type === 'sync:error' && event.data?.error) {
        onSyncError?.(event.data.error);
      }
    });
    return unsubscribe;
  }, [orchestrator, onSyncComplete, onSyncError]);

  useEffect(() => {
    if (autoStart) orchestrator.start(onOnline);
    return () => orchestrator.stop();
  }, [orchestrator, autoStart, onOnline]);

  useEffect(() => {
    const queueManager = getOfflineQueueManager();
    const checkPending = () => {
      const stats = queueManager.getStats();
      setHasPendingOperations(stats.pendingCount > 0);
    };
    checkPending();
    const unsubscribe = queueManager.subscribe(checkPending);
    return unsubscribe;
  }, []);

  const triggerSync = useCallback(
    (onProgress?: SyncProgressCallback) => orchestrator.sync(onProgress),
    [orchestrator]
  );
  const start = useCallback(
    () => orchestrator.start(onOnline),
    [orchestrator, onOnline]
  );
  const stop = useCallback(() => orchestrator.stop(), [orchestrator]);
  const subscribe = useCallback(
    (listener: Parameters<typeof orchestrator.subscribe>[0]) =>
      orchestrator.subscribe(listener),
    [orchestrator]
  );

  return useMemo(
    () => ({
      hasPendingOperations,
      isOnline,
      start,
      state,
      stop,
      subscribe,
      triggerSync,
    }),
    [hasPendingOperations, isOnline, start, state, stop, subscribe, triggerSync]
  );
}

export { resetSyncOrchestrator } from './singleton';
export {
  type UseSyncOrchestratorOptions,
  type UseSyncOrchestratorReturn,
} from './useSyncOrchestrator.types';
