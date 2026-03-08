/* eslint-disable max-lines */
import { useMutation, useQuery } from 'convex/react';
import { Alert } from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

export const useArchivedHabitsModalLogic = () => {
  const archivedHabitsData = useQuery(api.habits.listArchived);
  const isLoading = archivedHabitsData === undefined;
  const archivedHabits = [...(archivedHabitsData ?? [])].sort(
    (a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0)
  );
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useMutation(api.habits.remove);
  const deleteAllArchivedMutation = useMutation(api.habits.deleteAllArchived);

  const handleRestore = async (
    habitId: Id<'habits'>,
    habitName: string
  ): Promise<boolean> => {
    triggerHaptic('tap');

    try {
      await unarchiveHabit({ habitId });
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
    triggerHaptic('heavy');

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

  const handleDeleteAll = () => {
    triggerHaptic('heavy');

    Alert.alert(
      'Delete All Archived Habits?',
      `This will permanently delete ${archivedHabits.length} archived habit${archivedHabits.length === 1 ? '' : 's'} and all their tracking data. This cannot be undone.`,
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            try {
              await deleteAllArchivedMutation();
              triggerHaptic('success');
            } catch (error) {
              if (__DEV__)
                console.error('Failed to delete all archived:', error);
              triggerHaptic('error');
              Alert.alert(
                'Error',
                'Failed to delete archived habits. Please try again.'
              );
            }
          },
          style: 'destructive',
          text: 'Delete All',
        },
      ],
      { cancelable: true }
    );
  };

  return {
    archivedHabits,
    handleDeleteAll,
    handlePermanentDelete,
    handleRestore,
    isLoading,
  };
};
