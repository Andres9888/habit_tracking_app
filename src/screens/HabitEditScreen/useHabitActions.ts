import { useCallback } from 'react';
import { Alert } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import {
  useOfflineArchiveHabit,
  useOfflineRemoveHabit,
} from '../../lib/optimistic';

interface UseHabitActionsProps {
  habitId: Id<'habits'> | null;
  onSuccess: () => void;
}

export function useHabitActions({ habitId, onSuccess }: UseHabitActionsProps) {
  const removeHabit = useOfflineRemoveHabit();
  const archiveHabit = useOfflineArchiveHabit();

  const handleDelete = useCallback(() => {
    if (!habitId) return;

    Alert.alert(
      'Delete Habit',
      'This action cannot be undone. All your progress and history will be permanently deleted.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void removeHabit({ habitId })
              .then(onSuccess)
              .catch((error) => {
                if (__DEV__) console.warn('Error deleting habit:', error);
                Alert.alert(
                  'Error',
                  ERROR_MESSAGES.DATA_OPS.DELETE_HABIT_FAILED,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Retry',
                      onPress: () =>
                        void removeHabit({ habitId }).then(onSuccess),
                    },
                  ]
                );
              });
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  }, [habitId, removeHabit, onSuccess]);

  const handleArchive = useCallback(() => {
    if (!habitId) return;

    Alert.alert(
      'Archive Habit',
      'This habit will be hidden but your progress will be preserved. You can restore it anytime from Settings.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void archiveHabit({ habitId })
              .then(onSuccess)
              .catch((error) => {
                if (__DEV__) console.warn('Error archiving habit:', error);
                Alert.alert(
                  'Error',
                  ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Retry',
                      onPress: () =>
                        void archiveHabit({ habitId }).then(onSuccess),
                    },
                  ]
                );
              });
          },
          text: 'Archive',
        },
      ]
    );
  }, [habitId, archiveHabit, onSuccess]);

  return { handleArchive, handleDelete };
}
