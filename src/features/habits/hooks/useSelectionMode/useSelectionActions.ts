import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
import { logInteraction } from '../../../../lib/analytics/interactions';
import { optimisticStore } from '../../../../lib/optimistic';
import { showGenericError } from '../../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../../constants/errorMessages';

interface BatchUndoState {
  visible: boolean;
  habitIds: Id<'habits'>[];
  count: number;
}

interface UseSelectionActionsArgs {
  selectedIds: Set<Id<'habits'>>;
  habits: Habit[];
  exitSelectionMode: () => void;
}

export interface UseSelectionActionsResult {
  handleBatchArchive: () => Promise<void>;
  handleBatchArchiveUndo: () => Promise<void>;
  dismissBatchArchiveUndo: () => void;
  batchArchiveUndoVisible: boolean;
  batchArchiveUndoCount: number;
  confirmDeleteVisible: boolean;
  showDeleteConfirmation: () => void;
  hideDeleteConfirmation: () => void;
  confirmBatchDelete: () => Promise<void>;
  deleteCount: number;
}

export function useSelectionActions({
  selectedIds,
  habits,
  exitSelectionMode,
}: UseSelectionActionsArgs): UseSelectionActionsResult {
  const batchArchiveMutation = useMutation(api.habits.batchArchive);
  const batchUnarchiveMutation = useMutation(api.habits.batchUnarchive);
  const batchRemoveMutation = useMutation(api.habits.batchRemove);

  const [undoState, setUndoState] = useState<BatchUndoState>({
    count: 0,
    habitIds: [],
    visible: false,
  });
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);

  const handleBatchArchive = useCallback(async () => {
    const ids = Array.from(selectedIds);
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
      opIds.forEach((id) => optimisticStore.confirm(id));
      logInteraction('habits_batch_archived', { count });
    } catch (error) {
      opIds.forEach((id) => optimisticStore.fail(id, error as Error));
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
      opIds.forEach((id) => optimisticStore.confirm(id));
      logInteraction('habits_batch_archive_undone', { count: habitIds.length });
    } catch (error) {
      opIds.forEach((id) => optimisticStore.fail(id, error as Error));
      showGenericError('Failed to undo archive. Please try again.');
    }
    setUndoState({ count: 0, habitIds: [], visible: false });
  }, [undoState, habits, batchUnarchiveMutation]);

  const dismissBatchArchiveUndo = useCallback(() => {
    setUndoState({ count: 0, habitIds: [], visible: false });
  }, []);

  const showDeleteConfirmation = useCallback(() => {
    setDeleteCount(selectedIds.size);
    setConfirmDeleteVisible(true);
  }, [selectedIds.size]);

  const hideDeleteConfirmation = useCallback(() => {
    setConfirmDeleteVisible(false);
  }, []);

  const confirmBatchDelete = useCallback(async () => {
    const ids = Array.from(selectedIds);
    setConfirmDeleteVisible(false);
    exitSelectionMode();
    try {
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
