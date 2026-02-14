import { useMutation, useQuery } from 'convex/react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const RETENTION_DAYS = 30;

export const useRecentlyDeletedModalLogic = () => {
  const deletedHabitsData = useQuery(api.habits.listDeleted);
  const isLoading = deletedHabitsData === undefined;
  const deletedHabits = deletedHabitsData ?? [];
  const restoreHabit = useMutation(api.habits.restore);
  const permanentlyDeleteHabit = useMutation(api.habits.permanentlyDelete);

  /** Calculate days remaining before permanent deletion */
  const getDaysRemaining = (deletedAt?: number): number => {
    if (!deletedAt) return RETENTION_DAYS;
    const elapsed = Date.now() - deletedAt;
    const remaining = RETENTION_DAYS - Math.floor(elapsed / (24 * 60 * 60 * 1000));
    return Math.max(0, remaining);
  };

  const handleRestore = async (
    habitId: Id<'habits'>,
    habitName: string
  ): Promise<boolean> => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await restoreHabit({ habitId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return true;
    } catch (error) {
      if (__DEV__) console.error('Failed to restore habit:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Error',
        `Failed to restore "${habitName}". Please try again.`
      );
      return false;
    }
  };

  const handlePermanentDelete = (habitId: Id<'habits'>, habitName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
              await permanentlyDeleteHabit({ habitId });
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            } catch (error) {
              if (__DEV__) console.error('Failed to delete habit:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
    deletedHabits,
    getDaysRemaining,
    handlePermanentDelete,
    handleRestore,
    isLoading,
  };
};
