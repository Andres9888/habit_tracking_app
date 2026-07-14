import { Alert } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';
import { cancelHabitReminder } from '@/utils/notifications';
import type { ArchivedHabit } from './types';

type MutationFn<T> = (args: T) => Promise<unknown>;
type DeleteAllArchivedResult = {
  deletedCount: number;
  habitIds?: Id<'habits'>[];
};

interface UseArchiveDeleteActionsParams {
  removeHabit: MutationFn<{ habitId: Id<'habits'> }>;
  deleteAllArchivedMutation: MutationFn<Record<string, never>>;
  archivedHabits: ArchivedHabit[];
}

export function useArchiveDeleteActions({
  removeHabit,
  deleteAllArchivedMutation,
  archivedHabits,
}: UseArchiveDeleteActionsParams) {
  const handlePermanentDelete = (habitId: Id<'habits'>, habitName: string) => {
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
              await cancelHabitReminder(String(habitId));
              triggerHaptic('success');
            } catch (error_) {
              if (__DEV__) console.error('Failed to delete habit:', error_);
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
    const count = archivedHabits.length;
    Alert.alert(
      'Delete All Archived Habits?',
      `This will permanently delete ${count} archived habit${count === 1 ? '' : 's'} and all their tracking data. This cannot be undone.`,
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            try {
              const result = (await deleteAllArchivedMutation(
                {} as Record<string, never>
              )) as DeleteAllArchivedResult;
              const habitIds =
                result.habitIds ?? archivedHabits.map((h) => h._id);
              await Promise.all(
                habitIds.map((id) => cancelHabitReminder(String(id)))
              );
              triggerHaptic('success');
            } catch (error_) {
              if (__DEV__)
                console.error('Failed to delete all archived:', error_);
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

  return { handlePermanentDelete, handleDeleteAll };
}
