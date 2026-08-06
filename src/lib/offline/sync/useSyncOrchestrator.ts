/**
 * useSyncOrchestrator Hook
 *
 * React hook for integrating the sync orchestrator with components.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useNetworkStatus } from '../../../contexts/NetworkStatusContext/hooks';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
import { getOfflineQueueManager } from '../queueManager';
import { createSyncExecutor } from './createSyncExecutor';
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
  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);
  const archiveHabit = useMutation(api.habits.archive);
  const pauseHabit = useMutation(api.habits.pause);
  const removeHabit = useMutation(api.habits.remove);

  const orchestratorRef = useRef(getSyncOrchestrator(config));
  const orchestrator = orchestratorRef.current;
  const executor = useMemo(
    () =>
      createSyncExecutor({
        archiveHabit,
        createHabit,
        pauseHabit,
        removeHabit,
        toggleHabit: toggleMutation,
        updateHabit,
      }),
    [
      archiveHabit,
      createHabit,
      pauseHabit,
      removeHabit,
      toggleMutation,
      updateHabit,
    ]
  );

  const [state, setState] = useState<SyncOrchestratorState>(
    orchestrator.getState()
  );
  const [hasPendingOperations, setHasPendingOperations] = useState(false);
  const [pendingOperationCount, setPendingOperationCount] = useState(0);

  useEffect(() => {
    orchestrator.setExecutor(executor);
  }, [executor, orchestrator]);

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
      setPendingOperationCount(stats.pendingCount);
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
      pendingOperationCount,
      isOnline,
      start,
      state,
      stop,
      subscribe,
      triggerSync,
    }),
    [
      hasPendingOperations,
      isOnline,
      pendingOperationCount,
      start,
      state,
      stop,
      subscribe,
      triggerSync,
    ]
  );
}

export { resetSyncOrchestrator } from './singleton';
export {
  type UseSyncOrchestratorOptions,
  type UseSyncOrchestratorReturn,
} from './useSyncOrchestrator.types';
