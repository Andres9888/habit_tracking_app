import { useMutation, useQuery } from 'convex/react';
import { Alert } from 'react-native';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { FREE_HABIT_LIMIT } from '@/constants';
import { triggerHaptic } from '@/utils/haptics';
import { useBatchArchiveActions } from './useBatchArchiveActions';
import { useArchiveDeleteActions } from './useArchiveDeleteActions';

export const useArchivedHabitsModalLogic = () => {
  const archivedHabitsData = useQuery(api.habits.listArchived);
  const settingsData = useQuery(api.settings.get);
  const habitsData = useQuery(api.habits.list);
  const isLoading = archivedHabitsData === undefined;
  const archivedHabits = [...(archivedHabitsData ?? [])].sort(
    (a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0)
  );
  const isPremiumUser = (settingsData as { hasPremium?: boolean } | null)?.hasPremium ?? false;
  const activeHabitCount = (habitsData ?? []).filter(
    (h: { archived?: boolean; paused?: boolean }) => !h.archived && !h.paused
  ).length;
  const hasReachedHabitLimit = !isPremiumUser && activeHabitCount >= FREE_HABIT_LIMIT;
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
      Alert.alert('Error', `Failed to restore "${habitName}". Please try again.`);
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
