import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import type { ArchiveHabitPayload } from '../../offline/queue';
import { optimisticStore } from '../store';
import { useOfflineMutation } from './useOfflineMutation';

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
    confirmOptimistic: optimisticStore.confirm,
    failOptimistic: optimisticStore.fail,
    isOnline,
  });

  return useCallback(
    async (payload: ArchiveHabitPayload): Promise<void> => {
      await execute(payload);
    },
    [execute]
  );
}
