import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { getUserTimezone } from '../../../utils/timezone';
import type { PauseHabitPayload } from '../../offline/queue';
import { optimisticStore } from '../store';
import { useOfflineMutation } from './useOfflineMutation';

export function useOfflinePauseHabit() {
  const mutation = useMutation(api.habits.pause);
  const isOnline = useIsOnline();
  const serverMutation = useCallback(
    ({ habitId }: PauseHabitPayload) =>
      mutation({ habitId, timezone: getUserTimezone() }),
    [mutation]
  );
  const applyOptimistic = useCallback(
    (operationId: string, payload: PauseHabitPayload) => {
      optimisticStore.addPauseWithId(operationId, {
        habitId: payload.habitId,
        habitName: payload.habitName ?? 'Habit',
        toPaused: true,
      });
    },
    []
  );
  const execute = useOfflineMutation('pauseHabit', serverMutation, {
    applyOptimistic,
    confirmOptimistic: (operationId) => optimisticStore.confirm(operationId),
    failOptimistic: (operationId, error) =>
      optimisticStore.fail(operationId, error),
    isOnline,
  });

  return useCallback(
    async (payload: PauseHabitPayload): Promise<void> => {
      await execute(payload);
    },
    [execute]
  );
}
