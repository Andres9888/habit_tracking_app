import { useMemo, useRef, useState, useCallback } from 'react';
import { useNetworkStatus } from '../../../contexts/NetworkStatusContext/hooks';
import { getSyncOrchestrator } from './singleton';
import type { SyncOrchestratorState, SyncProgressCallback } from './types';
import type {
  UseSyncOrchestratorOptions,
  UseSyncOrchestratorReturn,
} from './useSyncOrchestrator.types';
import { useSyncOrchestratorEffects } from './useSyncOrchestrator.effects';
import { useSyncExecutor } from './useSyncExecutor';

export function useSyncOrchestrator(
  options: UseSyncOrchestratorOptions = {}
): UseSyncOrchestratorReturn {
  const { config, autoStart = true, onSyncComplete, onSyncError } = options;
  const { isOnline, onOnline } = useNetworkStatus();
  const orchestratorRef = useRef(getSyncOrchestrator(config));
  const orchestrator = orchestratorRef.current;
  const executor = useSyncExecutor();

  const [state, setState] = useState<SyncOrchestratorState>(
    orchestrator.getState()
  );
  const [hasPendingOperations, setHasPendingOperations] = useState(false);
  const [pendingOperationCount, setPendingOperationCount] = useState(0);

  useSyncOrchestratorEffects({
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
  });

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
