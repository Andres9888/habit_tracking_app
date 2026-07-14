import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { cancelHabitReminder } from '../../utils/notifications';

interface UseHabitActionsProps {
  habitId: Id<'habits'> | null;
  onSuccess: () => void;
}

export function useHabitActions({ habitId, onSuccess }: UseHabitActionsProps) {
  const removeHabit = useMutation(api.habits.remove);
  const archiveHabit = useMutation(api.habits.archive);

  const deleteHabit = useCallback(async () => {
    if (!habitId) return;
    await removeHabit({ habitId });
    await cancelHabitReminder(String(habitId));
    onSuccess();
  }, [habitId, removeHabit, onSuccess]);

  const archiveSelectedHabit = useCallback(async () => {
    if (!habitId) return;
    await archiveHabit({ habitId });
    await cancelHabitReminder(String(habitId));
    onSuccess();
  }, [habitId, archiveHabit, onSuccess]);

  const handleDelete = useCallback(() => {
    if (!habitId) return;

    Alert.alert(
      'Delete Habit',
      'This action cannot be undone. All your progress and history will be permanently deleted.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void deleteHabit().catch((error) => {
              if (__DEV__) console.warn('Error deleting habit:', error);
              Alert.alert(
                'Error',
                ERROR_MESSAGES.DATA_OPS.DELETE_HABIT_FAILED,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Retry', onPress: () => void deleteHabit() },
                ]
              );
            });
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  }, [habitId, deleteHabit]);

  const handleArchive = useCallback(() => {
    if (!habitId) return;

    Alert.alert(
      'Archive Habit',
      'This habit will be hidden but your progress will be preserved. You can restore it anytime from Settings.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void archiveSelectedHabit().catch((error) => {
              if (__DEV__) console.warn('Error archiving habit:', error);
              Alert.alert(
                'Error',
                ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Retry', onPress: () => void archiveSelectedHabit() },
                ]
              );
            });
          },
          text: 'Archive',
        },
      ]
    );
  }, [habitId, archiveSelectedHabit]);

  return { handleArchive, handleDelete };
}
