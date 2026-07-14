import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { triggerHaptic } from '@/utils/haptics';
import { cancelHabitReminder } from '@/utils/notifications';
import { logInteraction } from '../../../lib/analytics/interactions';

export function useHabitDelete(habits: Habit[]) {
  const removeHabit = useMutation(api.habits.remove);

  // Latest-ref: habits gets a new identity on every toggle; reading it through
  // a ref keeps handleDelete stable so memo'd habit cards don't re-render.
  const habitsRef = useRef(habits);
  habitsRef.current = habits;

  const handleDelete = useCallback(
    (habitId: Id<'habits'>) => {
      const habit = habitsRef.current.find((h) => h._id === habitId);
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
              try {
                await removeHabit({ habitId });
                await cancelHabitReminder(String(habitId));
                triggerHaptic('success');
                logInteraction('habit_deleted', { habitId, habitName });
              } catch (error_) {
                if (__DEV__)
                  console.error('[useHabitDelete] Delete failed:', error_);
                triggerHaptic('error');
                Alert.alert(
                  'Error',
                  `Failed to delete "${habitName}". Please try again.`
                );
              }
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
