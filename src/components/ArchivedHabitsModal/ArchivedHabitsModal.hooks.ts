import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';
import { useCachedQuery } from '@/lib/queryCache';
import { canAddHabit } from '@/lib/premium/freeTier';
import { alertPremiumOrError } from '@/lib/premium/premiumAlert';
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
  const activeHabitsData = useCachedQuery(
    api.habits.list,
    {},
    { entryName: 'habits.list' }
  );
  // Mirrors the server cap so the modal can warn *before* a restore fails.
  // Previously hardcoded false, which left the "restore" affordance looking
  // available right up to the point it threw.
  const hasReachedHabitLimit = !canAddHabit(
    isPremiumUser,
    activeHabitsData ?? []
  );
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useMutation(api.habits.remove);
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
      alertPremiumOrError(
        error_,
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
