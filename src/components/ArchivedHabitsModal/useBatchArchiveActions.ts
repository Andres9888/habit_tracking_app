import { Alert } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

type BatchMutationFn = (args: { habitIds: Id<'habits'>[] }) => Promise<unknown>;
type MutationFn = (args: { habitId: Id<'habits'> }) => Promise<unknown>;

interface BatchDeleteOptions {
  onSuccess?: () => void;
}

export function useBatchArchiveActions(
  unarchiveHabit: MutationFn,
  removeHabit: MutationFn,
  batchUnarchiveHabits?: BatchMutationFn
) {
  const handleBatchRestore = async (ids: Set<Id<'habits'>>) => {
    if (ids.size === 0) return false;

    triggerHaptic('tap');
    const habitIds = [...ids];

    try {
      if (batchUnarchiveHabits) {
        await batchUnarchiveHabits({ habitIds });
      } else {
        await Promise.all(
          habitIds.map((habitId) => unarchiveHabit({ habitId }))
        );
      }
      triggerHaptic('success');
      return true;
    } catch (error) {
      if (__DEV__) console.error('Failed to batch restore:', error);
      triggerHaptic('error');
      Alert.alert('Error', 'Failed to restore some habits. Please try again.');
      return false;
    }
  };

  const handleBatchDelete = (
    ids: Set<Id<'habits'>>,
    options?: BatchDeleteOptions
  ) => {
    triggerHaptic('heavy');
    const count = ids.size;
    Alert.alert(
      `Delete ${count} Habit${count === 1 ? '' : 's'}?`,
      'This will permanently delete the selected habits and all their tracking data. This cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            try {
              await Promise.all(
                [...ids].map((habitId) => removeHabit({ habitId }))
              );
              triggerHaptic('success');
              options?.onSuccess?.();
            } catch (error) {
              if (__DEV__) console.error('Failed to batch delete:', error);
              triggerHaptic('error');
              Alert.alert(
                'Error',
                'Failed to delete some habits. Please try again.'
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

  return { handleBatchRestore, handleBatchDelete };
}
