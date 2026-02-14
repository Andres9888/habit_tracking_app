import { triggerHaptic } from '@/utils/haptics';
import { useMutation, useQuery } from 'convex/react';
import { Alert } from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export const useArchivedHabitsModalLogic = () => {
  const archivedHabitsData = useQuery(api.habits.listArchived);
  const isLoading = archivedHabitsData === undefined;
  const archivedHabits = archivedHabitsData ?? [];
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useMutation(api.habits.remove);

  const handleRestore = async (
    habitId: Id<'habits'>,
    habitName: string
  ): Promise<boolean> => {
    triggerHaptic('tap');

    try {
      await unarchiveHabit({ habitId });
      // Success haptic feedback after restore completes
      triggerHaptic('success');
      return true;
    } catch (error) {
      if (__DEV__) console.error('Failed to restore habit:', error);
      triggerHaptic('error');
      Alert.alert(
        'Error',
        `Failed to restore "${habitName}". Please try again.`
      );
      return false;
    }
  };

  const handlePermanentDelete = (habitId: Id<'habits'>, habitName: string) => {
    triggerHaptic('toggle');

    Alert.alert(
      `Permanently Delete "${habitName}"?`,
      'This will permanently delete the habit and all its tracking data. This action cannot be undone.',
      [
        {
          style: 'cancel',
          text: 'Cancel',
        },
        {
          onPress: async () => {
            try {
              await removeHabit({ habitId });
              triggerHaptic('success');
            } catch (error) {
              if (__DEV__) console.error('Failed to delete habit:', error);
              triggerHaptic('error');
              Alert.alert(
                'Error',
                `Failed to delete "${habitName}". Please try again.`
              );
            }
          },
          style: 'destructive',
          text: 'Delete Forever',
        },
      ],
      { cancelable: true }
    );
  };

  return {
    archivedHabits,
    handlePermanentDelete,
    handleRestore,
    isLoading,
  };
};
