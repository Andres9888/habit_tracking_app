import { Alert } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';
import { cancelHabitReminder } from '@/utils/notifications';

type MutationFn = (args: { habitId: Id<'habits'> }) => Promise<unknown>;

export function useBatchArchiveActions(
  unarchiveHabit: MutationFn,
  removeHabit: MutationFn
) {
  const handleBatchRestore = async (ids: Set<Id<'habits'>>) => {
    triggerHaptic('tap');
    try {
      await Promise.all([...ids].map((habitId) => unarchiveHabit({ habitId })));
      triggerHaptic('success');
    } catch (error) {
      if (__DEV__) console.error('Failed to batch restore:', error);
      triggerHaptic('error');
      Alert.alert('Error', 'Failed to restore some habits. Please try again.');
    }
  };

  const handleBatchDelete = (ids: Set<Id<'habits'>>) => {
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
              await Promise.all([...ids].map((id) => cancelHabitReminder(String(id))));
              await Promise.all([...ids].map((habitId) => removeHabit({ habitId })));
              triggerHaptic('success');
            } catch (error) {
              if (__DEV__) console.error('Failed to batch delete:', error);
              triggerHaptic('error');
              Alert.alert('Error', 'Failed to delete some habits. Please try again.');
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
