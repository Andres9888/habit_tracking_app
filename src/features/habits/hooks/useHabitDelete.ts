import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { triggerHaptic } from '@/utils/haptics';
import { logInteraction } from '../../../lib/analytics/interactions';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { deleteHabitOffline } from './offlineHabitMutations';

export function useHabitDelete(habits: Habit[]) {
  const removeHabit = useMutation(api.habits.remove);
  const isOnline = useIsOnline();

  // Latest-ref: habits/isOnline get a new identity on every toggle; reading
  // them through a ref keeps handleDelete stable so memo'd habit cards don't
  // re-render.
  const depsRef = useRef({ habits, isOnline });
  depsRef.current = { habits, isOnline };

  const handleDelete = useCallback(
    (habitId: Id<'habits'>) => {
      const { habits: currentHabits, isOnline: online } = depsRef.current;
      const habit = currentHabits.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';

      triggerHaptic('heavy');

      Alert.alert(
        'Delete Habit',
        `This will permanently delete "${habitName}" and all its history. This cannot be undone.`,
        [
          { text: 'Keep Habit', style: 'cancel' },
          {
            text: 'Delete Forever',
            style: 'destructive',
            onPress: async () => {
              await deleteHabitOffline({
                habitId,
                habitName,
                isOnline: online,
                onError: (error_) => {
                  if (__DEV__)
                    console.error('[useHabitDelete] Delete failed:', error_);
                  triggerHaptic('error');
                  Alert.alert(
                    'Error',
                    `Failed to delete "${habitName}". Please try again.`
                  );
                },
                removeMutation: removeHabit,
              });
              triggerHaptic('success');
              logInteraction('habit_deleted', { habitId, habitName });
            },
          },
        ],
        { cancelable: true }
      );
    },
    [removeHabit]
  );

  return { handleDelete };
}
