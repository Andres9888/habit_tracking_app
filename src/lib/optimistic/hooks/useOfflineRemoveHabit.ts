import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import type { RemoveHabitPayload } from '../../offline/queue';
import { optimisticStore } from '../store';
import { useOfflineMutation } from './useOfflineMutation';

// Hoisted to module scope: inline arrows here would give `execute` — and every
// mutation derived from it — a fresh identity on every render, because
// useOfflineMutation lists these in its useCallback deps.
const confirmOptimistic = (operationId: string): void =>
  optimisticStore.confirm(operationId);

const failOptimistic = (operationId: string, error: Error): void =>
  optimisticStore.fail(operationId, error);

export function useOfflineRemoveHabit() {
  const mutation = useMutation(api.habits.remove);
  const isOnline = useIsOnline();
  const serverMutation = useCallback(
    ({ habitId }: RemoveHabitPayload) => mutation({ habitId }),
    [mutation]
  );
  const applyOptimistic = useCallback(
    (operationId: string, payload: RemoveHabitPayload) => {
      // The active list renders removal and archival identically: hide the row.
      optimisticStore.addArchiveWithId(operationId, {
        habitId: payload.habitId,
        habitName: payload.habitName ?? 'Habit',
        toArchived: true,
      });
    },
    []
  );
  const execute = useOfflineMutation('removeHabit', serverMutation, {
    applyOptimistic,
    confirmOptimistic,
    failOptimistic,
    isOnline,
  });

  return useCallback(
    async (payload: RemoveHabitPayload): Promise<void> => {
      await execute(payload);
    },
    [execute]
  );
}
