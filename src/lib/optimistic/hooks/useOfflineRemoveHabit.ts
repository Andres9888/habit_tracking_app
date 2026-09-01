import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import type { RemoveHabitPayload } from '../../offline/queue';
import { optimisticStore } from '../store';
import { useOfflineMutation } from './useOfflineMutation';

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
    confirmOptimistic: (operationId) => optimisticStore.confirm(operationId),
    failOptimistic: (operationId, error) =>
      optimisticStore.fail(operationId, error),
    isOnline,
  });

  return useCallback(
    async (payload: RemoveHabitPayload): Promise<void> => {
      await execute(payload);
    },
    [execute]
  );
}
