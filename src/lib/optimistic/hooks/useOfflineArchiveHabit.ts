import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import type { ArchiveHabitPayload } from '../../offline/queue';
import { optimisticStore } from '../store';
import { useOfflineMutation } from './useOfflineMutation';

// Hoisted to module scope: inline arrows here would give `execute` — and every
// mutation derived from it — a fresh identity on every render, because
// useOfflineMutation lists these in its useCallback deps.
const confirmOptimistic = (operationId: string): void =>
  optimisticStore.confirm(operationId);

const failOptimistic = (operationId: string, error: Error): void =>
  optimisticStore.fail(operationId, error);

export function useOfflineArchiveHabit() {
  const mutation = useMutation(api.habits.archive);
  const isOnline = useIsOnline();
  const serverMutation = useCallback(
    ({ habitId }: ArchiveHabitPayload) => mutation({ habitId }),
    [mutation]
  );
  const applyOptimistic = useCallback(
    (operationId: string, payload: ArchiveHabitPayload) => {
      optimisticStore.addArchiveWithId(operationId, {
        habitId: payload.habitId,
        habitName: payload.habitName ?? 'Habit',
        toArchived: true,
      });
    },
    []
  );
  const execute = useOfflineMutation('archiveHabit', serverMutation, {
    applyOptimistic,
    confirmOptimistic,
    failOptimistic,
    isOnline,
  });

  return useCallback(
    async (payload: ArchiveHabitPayload): Promise<void> => {
      await execute(payload);
    },
    [execute]
  );
}
