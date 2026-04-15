import { useMutation, useQuery } from 'convex/react';
import { Alert } from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

export const useFormedHabitsModalLogic = () => {
  const formedHabitsData = useQuery(api.habits.listFormed);
  const isLoading = formedHabitsData === undefined;
  const formedHabits = [...(formedHabitsData ?? [])].sort(
    (a, b) => (b.formedAt ?? 0) - (a.formedAt ?? 0)
  );
  const unformHabit = useMutation(api.habits.unformHabit);
  const removeHabit = useMutation(api.habits.remove);

  const handleRestore = async (
    habitId: Id<'habits'>,
    habitName: string
  ): Promise<boolean> => {
    triggerHaptic('tap');
    try {
      await unformHabit({ habitId });
      triggerHaptic('success');
      return true;
    } catch (error_) {
      if (__DEV__) console.error('Failed to unform habit:', error_);
      triggerHaptic('error');
      Alert.alert('Error', `Failed to restore "${habitName}".`);
      return false;
    }
  };

  const handlePermanentDelete = (
    habitId: Id<'habits'>,
    habitName: string
  ) => {
    triggerHaptic('heavy');
    Alert.alert(
      `Permanently Delete "${habitName}"?`,
      'This will permanently delete the habit and all its tracking data. This action cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            try {
              await removeHabit({ habitId });
              triggerHaptic('success');
            } catch (error_) {
              if (__DEV__) console.error('Failed to delete:', error_);
              triggerHaptic('error');
              Alert.alert('Error', `Failed to delete "${habitName}".`);
            }
          },
          style: 'destructive',
          text: 'Delete Forever',
        },
      ],
      { cancelable: true }
    );
  };

  return { formedHabits, handlePermanentDelete, handleRestore, isLoading };
};
