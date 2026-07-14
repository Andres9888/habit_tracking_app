import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { logInteraction } from '../../../../lib/analytics/interactions';
import { optimisticStore } from '../../../../lib/optimistic';
import {
  cancelHabitReminder,
  rescheduleHabitReminderFromSettings,
} from '@/utils/notifications';
import { showGenericError } from '../../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../../constants/errorMessages';
import { useSelectionDeleteActions } from './useSelectionDeleteActions';
import type {
  BatchUndoState,
  UseSelectionActionsArgs,
  UseSelectionActionsResult,
} from './useSelectionActions.types';

export function useSelectionActions({
  selectedIds,
  habits,
  exitSelectionMode,
}: UseSelectionActionsArgs): UseSelectionActionsResult {
  const batchArchiveMutation = useMutation(api.habits.batchArchive);
  const batchUnarchiveMutation = useMutation(api.habits.batchUnarchive);
  const deleteActions = useSelectionDeleteActions({
    exitSelectionMode,
    selectedIds,
  });

  const [undoState, setUndoState] = useState<BatchUndoState>({
    count: 0,
    habitIds: [],
    visible: false,
  });
  const handleBatchArchive = useCallback(async () => {
    const ids = [...selectedIds];
    const count = ids.length;

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
      await Promise.all(ids.map((id) => cancelHabitReminder(String(id))));
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
    const habitsToRestore = habitIds
      .map((habitId) => habits.find((h) => h._id === habitId))
      .filter(
        (habit): habit is NonNullable<typeof habit> => habit !== undefined
      );
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
      await Promise.all(
        habitsToRestore.map((habit) =>
          rescheduleHabitReminderFromSettings(habit)
        )
      );
      for (const id of opIds) optimisticStore.confirm(id);
      logInteraction('habits_batch_archive_undone', { count: habitIds.length });
    } catch (error) {
      for (const id of opIds) optimisticStore.fail(id, error as Error);
      showGenericError('Failed to undo archive. Please try again.');
    }
    setUndoState({ count: 0, habitIds: [], visible: false });
  }, [undoState, habits, batchUnarchiveMutation]);

  const dismissBatchArchiveUndo = useCallback(
    () => setUndoState({ count: 0, habitIds: [], visible: false }),
    []
  );

  return {
    batchArchiveUndoCount: undoState.count,
    batchArchiveUndoVisible: undoState.visible,
    dismissBatchArchiveUndo,
    handleBatchArchive,
    handleBatchArchiveUndo,
    ...deleteActions,
  };
}
