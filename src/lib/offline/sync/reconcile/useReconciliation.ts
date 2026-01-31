/**
 * useReconciliation Hook
 *
 * React hook for integrating state reconciliation with components.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStateReconciler } from './singleton';
import type { ReconciliationEvent, ReconciliationState } from './types';
import type {
  UseReconciliationOptions,
  UseReconciliationReturn,
} from './useReconciliation.types';

function createEventHandler(
  reconciler: ReturnType<typeof getStateReconciler>,
  setState: (state: ReconciliationState) => void,
  options: UseReconciliationOptions
) {
  return (event: ReconciliationEvent) => {
    setState(reconciler.getState());
    if (event.type === 'reconcile:completed' && event.data?.result) {
      options.onReconciled?.(event.data.result);
    }
    if (event.type === 'reconcile:habit_synced' && event.data?.habit) {
      const { habitId, syncedDates } = event.data.habit;
      options.onHabitSynced?.(habitId, syncedDates);
    }
  };
}

/**
 * Hook for managing state reconciliation after sync operations
 */
export function useReconciliation(
  options: UseReconciliationOptions = {}
): UseReconciliationReturn {
  const reconciler = useMemo(
    () => getStateReconciler(options.config),
    [options.config]
  );
  const [state, setState] = useState<ReconciliationState>(
    reconciler.getState()
  );

  useEffect(() => {
    const handler = createEventHandler(reconciler, setState, options);
    return reconciler.subscribe(handler);
  }, [reconciler, options]);

  const reconcile = useCallback(
    (ops: Parameters<typeof reconciler.reconcile>[0]) =>
      reconciler.reconcile(ops),
    [reconciler]
  );
  const scheduleReconcile = useCallback(
    (ops: Parameters<typeof reconciler.reconcile>[0]) =>
      reconciler.scheduleReconcile(ops),
    [reconciler]
  );
  const isHabitSynced = useCallback(
    (id: string) => reconciler.isHabitSynced(id),
    [reconciler]
  );
  const getHabitSyncTimestamp = useCallback(
    (id: string) => reconciler.getHabitSyncTimestamp(id),
    [reconciler]
  );
  const clearSyncTimestamps = useCallback(
    () => reconciler.clearSyncTimestamps(),
    [reconciler]
  );

  return useMemo(
    () => ({
      clearSyncTimestamps,
      getHabitSyncTimestamp,
      isHabitSynced,
      isReconciling: state.isReconciling,
      lastResult: state.lastResult,
      reconcile,
      scheduleReconcile,
      state,
    }),
    [
      clearSyncTimestamps,
      getHabitSyncTimestamp,
      isHabitSynced,
      reconcile,
      scheduleReconcile,
      state,
    ]
  );
}
