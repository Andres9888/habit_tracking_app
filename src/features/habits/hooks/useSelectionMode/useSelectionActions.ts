import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { logInteraction } from '../../../../lib/analytics/interactions';
import { optimisticStore } from '../../../../lib/optimistic';
import { cancelHabitReminder } from '@/utils/notifications';
import { showGenericError } from '../../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../../constants/errorMessages';
import type { BatchUndoState, UseSelectionActionsArgs, UseSelectionActionsResult } from './useSelectionActions.types';

export function useSelectionActions({
  selectedIds,
  habits,
  exitSelectionMode,
}: UseSelectionActionsArgs): UseSelectionActionsResult {
  const batchArchiveMutation = useMutation(api.habits.batchArchive);
  const batchUnarchiveMutation = useMutation(api.habits.batchUnarchive);
  const batchRemoveMutation = useMutation(api.habits.batchRemove);

  const [undoState, setUndoState] = useState<BatchUndoState>({ count: 0, habitIds: [], visible: false });
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);

  const handleBatchArchive = useCallback(async () => {
    const ids = [...selectedIds];
    const count = ids.length;

    // Optimistic updates for each habit
    const opIds = ids.map((habitId) => {
      const habit = habits.find((h) => h._id === habitId);
      return optimisticStore.addArchive({
        habitId,
        habitName: habit?.name ?? 'Habit',
        toArchived: true,
      });
    });

    setUndoState({ count, habitIds: ids, visible: true });
    exitSelectionMode();

    try {
      await batchArchiveMutation({ habitIds: ids });
      for (const id of opIds) optimisticStore.confirm(id);
      logInteraction('habits_batch_archived', { count });
    } catch (error) {
      for (const id of opIds) optimisticStore.fail(id, error as Error);
      setUndoState({ count: 0, habitIds: [], visible: false });
      showGenericError(ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED);
    }
  }, [selectedIds, habits, exitSelectionMode, batchArchiveMutation]);

  const handleBatchArchiveUndo = useCallback(async () => {
    const { habitIds } = undoState;
    const opIds = habitIds.map((habitId) => {
      const habit = habits.find((h) => h._id === habitId);
      return optimisticStore.addArchive({
        habitId,
        habitName: habit?.name ?? 'Habit',
        toArchived: false,
      });
    });

    try {
      await batchUnarchiveMutation({ habitIds });
      for (const id of opIds) optimisticStore.confirm(id);
      logInteraction('habits_batch_archive_undone', { count: habitIds.length });
    } catch (error) {
      for (const id of opIds) optimisticStore.fail(id, error as Error);
      showGenericError('Failed to undo archive. Please try again.');
    }
    setUndoState({ count: 0, habitIds: [], visible: false });
  }, [undoState, habits, batchUnarchiveMutation]);

  const dismissBatchArchiveUndo = useCallback(() => setUndoState({ count: 0, habitIds: [], visible: false }), []);

  const showDeleteConfirmation = useCallback(() => {
    setDeleteCount(selectedIds.size);
    setConfirmDeleteVisible(true);
  }, [selectedIds.size]);

  const hideDeleteConfirmation = useCallback(() => setConfirmDeleteVisible(false), []);

  const confirmBatchDelete = useCallback(async () => {
    const ids = [...selectedIds];
    setConfirmDeleteVisible(false);
    exitSelectionMode();
    try {
      await Promise.all(ids.map((id) => cancelHabitReminder(String(id))));
      await batchRemoveMutation({ habitIds: ids });
      logInteraction('habits_batch_deleted', { count: ids.length });
    } catch (error) {
      if (__DEV__) console.error('[useSelectionActions] Batch delete failed:', error);
      showGenericError('Failed to delete habits. Please try again.');
    }
  }, [selectedIds, exitSelectionMode, batchRemoveMutation]);

  return {
    batchArchiveUndoCount: undoState.count,
    batchArchiveUndoVisible: undoState.visible,
    confirmBatchDelete,
    confirmDeleteVisible,
    deleteCount,
    dismissBatchArchiveUndo,
    handleBatchArchive,
    handleBatchArchiveUndo,
    hideDeleteConfirmation,
    showDeleteConfirmation,
  };
}
