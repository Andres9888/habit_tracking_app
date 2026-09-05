import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { getUserTimezone } from '../../../utils/timezone';
import type { PauseHabitPayload } from '../../offline/queue';
import { optimisticStore } from '../store';
import { useOfflineMutation } from './useOfflineMutation';

// Hoisted to module scope: inline arrows here would give `execute` — and every
// mutation derived from it — a fresh identity on every render, because
// useOfflineMutation lists these in its useCallback deps.
const confirmOptimistic = (operationId: string): void =>
  optimisticStore.confirm(operationId);

const failOptimistic = (operationId: string, error: Error): void =>
  optimisticStore.fail(operationId, error);

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
    confirmOptimistic,
    failOptimistic,
    isOnline,
  });

  return useCallback(
    async (payload: PauseHabitPayload): Promise<void> => {
      await execute(payload);
    },
    [execute]
  );
}
