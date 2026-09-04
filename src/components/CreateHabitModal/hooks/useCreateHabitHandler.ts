import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { useUserDefaultProgressEmojis } from '../../../hooks/useProgressEmojis';
import { markFirstHabitCreated } from '../../../hooks/useStreakReminders/useStreakReminderSettings';
import type { CreateHabitPayload } from '../../../lib/offline/queue';
import { useOfflineMutation } from '../../../lib/optimistic';
import { validateHabitName } from '../../../utils/validation';
import { optimisticHabitCreationStore } from '../../../features/habits/hooks/optimisticHabitCreationStore';
import {
  buildCreateHabitPayload,
  toCreateHabitArgs,
  toOptimisticCreateInput,
} from './createHabitPayload';
import { scheduleReminder } from './useHabitReminders';
import type { CreateHabitData } from './useCreateHabitHandlers.types';

export function useCreateHabitHandler() {
  const createHabit = useMutation(api.habits.create);
  const isOnline = useIsOnline();
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const serverMutation = useCallback(
    (payload: CreateHabitPayload) => createHabit(toCreateHabitArgs(payload)),
    [createHabit]
  );
  const applyOptimistic = useCallback(
    (operationId: string, payload: CreateHabitPayload) => {
      optimisticHabitCreationStore.addWithId(
        operationId,
        toOptimisticCreateInput(payload)
      );
    },
    []
  );
  const confirmOptimistic = useCallback((operationId: string) => {
    optimisticHabitCreationStore.confirm(operationId);
  }, []);
  const failOptimistic = useCallback((operationId: string) => {
    optimisticHabitCreationStore.fail(operationId);
  }, []);
  const createWithOfflineFallback = useOfflineMutation(
    'createHabit',
    serverMutation,
    { applyOptimistic, confirmOptimistic, failOptimistic, isOnline }
  );

  /** Resolves with the server habit id, or null when the create was queued offline. */
  return useCallback(
    async (data: CreateHabitData): Promise<Id<'habits'> | null> => {
      const validation = validateHabitName(data.fullHabitName);
      if (!validation.isValid) {
        throw new Error(validation.error ?? 'Invalid habit name');
      }
      const payload = buildCreateHabitPayload(
        data,
        validation.sanitized,
        userDefaultEmojis
      );

      try {
        const result = await createWithOfflineFallback(payload);
        void markFirstHabitCreated();
        if (result.kind === 'synced' && data.hasReminders) {
          await scheduleReminder({
            habitId: result.value,
            habitName: payload.name,
            reminderTime: data.reminderTime,
          });
        }
        return result.kind === 'synced' ? result.value : null;
      } catch (error) {
        if (__DEV__) console.error('Failed to create habit:', error);
        throw error;
      }
    },
    [createWithOfflineFallback, userDefaultEmojis]
  );
}
