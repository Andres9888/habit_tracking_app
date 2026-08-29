import { useMutation } from 'convex/react';
import { Alert } from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';
import { useCachedQuery } from '@/lib/queryCache';
import { useSettingsQuery } from '@/lib/settings/useSettingsQuery';
import { useBatchArchiveActions } from './useBatchArchiveActions';
import { useArchiveDeleteActions } from './useArchiveDeleteActions';
import { useOfflineRemoveHabit, useOptimisticStore } from '@/lib/optimistic';

export const useArchivedHabitsModalLogic = () => {
  const archivedHabitsData = useCachedQuery(
    api.habits.listArchived,
    {},
    {
      entryName: 'habits.listArchived',
    }
  );
  const optimistic = useOptimisticStore();
  const settingsData = useSettingsQuery();
  const isLoading = archivedHabitsData === undefined;
  const archivedHabits = [...(archivedHabitsData ?? [])]
    .filter((habit) => optimistic.pendingArchives.get(habit._id) !== true)
    .sort((a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0));
  const isPremiumUser =
    (settingsData as { hasPremium?: boolean } | null)?.hasPremium ?? false;
  // Free habit cap removed in favour of trial-then-paywall gate at AuthGate.
  // Restoring an archived habit is never blocked by a slot cap anymore.
  const hasReachedHabitLimit = false;
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useOfflineRemoveHabit();
  const deleteAllArchivedMutation = useMutation(api.habits.deleteAllArchived);

  const { handleBatchRestore, handleBatchDelete } = useBatchArchiveActions(
    unarchiveHabit,
    removeHabit
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
    try {
      await unarchiveHabit({ habitId });
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
