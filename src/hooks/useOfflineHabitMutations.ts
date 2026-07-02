import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useIsOnline } from '../contexts/NetworkStatusContext';
import { useCreateOfflineHabit } from './useOfflineHabitMutations/useCreateOfflineHabit';
import { useNamedOfflineHabitMutation } from './useOfflineHabitMutations/useNamedOfflineHabitMutation';
import { useRemoveOfflineHabit } from './useOfflineHabitMutations/useRemoveOfflineHabit';
import { useUpdateOfflineHabit } from './useOfflineHabitMutations/useUpdateOfflineHabit';

/**
 * Hook providing offline-aware habit mutations.
 */
export function useOfflineHabitMutations() {
  const isOnline = useIsOnline();
  const createHabitMutation = useMutation(api.habits.create);
  const updateHabitMutation = useMutation(api.habits.update);
  const archiveHabitMutation = useMutation(api.habits.archive);
  const pauseHabitMutation = useMutation(api.habits.pause);
  const removeHabitMutation = useMutation(api.habits.remove);

  const createHabit = useCreateOfflineHabit(isOnline, createHabitMutation);
  const updateHabit = useUpdateOfflineHabit(isOnline, updateHabitMutation);
  const archiveHabit = useNamedOfflineHabitMutation(
    isOnline,
    'archiveHabit',
    archiveHabitMutation
  );
  const pauseHabit = useNamedOfflineHabitMutation(
    isOnline,
    'pauseHabit',
    pauseHabitMutation
  );
  const removeHabit = useRemoveOfflineHabit(isOnline, removeHabitMutation);

  return {
    createHabit,
    updateHabit,
    archiveHabit,
    pauseHabit,
    removeHabit,
    isOnline,
  };
}
