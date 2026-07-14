import { useMutation } from 'convex/react';
import { Alert } from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';
import { useCachedQuery } from '@/lib/queryCache';
import { rescheduleHabitReminderFromSettings } from '@/utils/notifications';
import { useBatchArchiveActions } from './useBatchArchiveActions';
import { useArchiveDeleteActions } from './useArchiveDeleteActions';

export const useArchivedHabitsModalLogic = () => {
  const archivedHabitsData = useCachedQuery(
    api.habits.listArchived,
    {},
    {
      entryName: 'habits.listArchived',
    }
  );
  const settingsData = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const isLoading = archivedHabitsData === undefined;
  const archivedHabits = [...(archivedHabitsData ?? [])].sort(
    (a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0)
  );
  const isPremiumUser =
    (settingsData as { hasPremium?: boolean } | null)?.hasPremium ?? false;
  // Free habit cap removed in favour of trial-then-paywall gate at AuthGate.
  // Restoring an archived habit is never blocked by a slot cap anymore.
  const hasReachedHabitLimit = false;
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useMutation(api.habits.remove);
  const deleteAllArchivedMutation = useMutation(api.habits.deleteAllArchived);

  const { handleBatchRestore, handleBatchDelete } = useBatchArchiveActions(
    unarchiveHabit,
    removeHabit,
    archivedHabits
  );

  const { handlePermanentDelete, handleDeleteAll } = useArchiveDeleteActions({
    removeHabit,
    deleteAllArchivedMutation,
    archivedHabits,
  });

  const handleRestore = async (
    habitId: Id<'habits'>,
    habitName: string
  ): Promise<boolean> => {
    triggerHaptic('tap');
    const habit = archivedHabits.find((h) => h._id === habitId);
    try {
      await unarchiveHabit({ habitId });
      if (habit) await rescheduleHabitReminderFromSettings(habit);
      triggerHaptic('success');
      return true;
    } catch (error_) {
      if (__DEV__) console.error('Failed to restore habit:', error_);
      triggerHaptic('error');
      Alert.alert(
        'Error',
        `Failed to restore "${habitName}". Please try again.`
      );
      return false;
    }
  };

  return {
    archivedHabits,
    handleBatchDelete,
    handleBatchRestore,
    handleDeleteAll,
    handlePermanentDelete,
    handleRestore,
    hasReachedHabitLimit,
    isPremiumUser,
    isLoading,
  };
};
