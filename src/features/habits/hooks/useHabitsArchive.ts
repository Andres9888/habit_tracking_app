import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { optimisticStore } from '../../../lib/optimistic';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

interface ArchiveUndoState {
  visible: boolean;
  habitId: Id<'habits'> | null;
  habitName: string;
}

export interface UseHabitsArchiveResult {
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  handleArchiveUndo: () => Promise<void>;
  dismissArchiveUndo: () => void;
  archiveUndoVisible: boolean;
  archiveUndoHabitName: string;
}

export function useHabitsArchive(habits: Habit[]): UseHabitsArchiveResult {
  const archiveHabitMutation = useMutation(api.habits.archive);
  const unarchiveHabitMutation = useMutation(api.habits.unarchive);

  const [archiveUndo, setArchiveUndo] = useState<ArchiveUndoState>({
    habitId: null,
    habitName: '',
    visible: false,
  });

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      const habit = habits.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';

      // Apply optimistic update immediately
      const operationId = optimisticStore.addArchive({
        habitId,
        habitName,
        toArchived: true,
      });

      // Show undo toast immediately (optimistic)
      setArchiveUndo({
        habitId,
        habitName,
        visible: true,
      });

      try {
        await archiveHabitMutation({ habitId });
        optimisticStore.confirm(operationId);
        logInteraction('habit_archived', { habitId, habitName });
      } catch (error) {
        // Rollback on failure
        optimisticStore.fail(operationId, error as Error);
        setArchiveUndo({ habitId: null, habitName: '', visible: false });
        if (__DEV__) console.error('[useHabitsArchive] Archive failed:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED);
      }
    },
    [archiveHabitMutation, habits]
  );

  const handleArchiveUndo = useCallback(async () => {
    if (archiveUndo.habitId) {
      const { habitId, habitName } = archiveUndo;

      // Apply optimistic unarchive immediately
      const operationId = optimisticStore.addArchive({
        habitId,
        habitName,
        toArchived: false,
      });

      try {
        await unarchiveHabitMutation({ habitId });
        optimisticStore.confirm(operationId);
        logInteraction('habit_archive_undone', { habitId, habitName });
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        if (__DEV__) console.error('[useHabitsArchive] Undo failed:', error);
        showGenericError('Failed to undo archive. Please try again.');
      }
    }
    setArchiveUndo({ habitId: null, habitName: '', visible: false });
  }, [archiveUndo.habitId, archiveUndo.habitName, unarchiveHabitMutation]);

  const dismissArchiveUndo = useCallback(() => {
    setArchiveUndo({ habitId: null, habitName: '', visible: false });
  }, []);

  return {
    archiveUndoHabitName: archiveUndo.habitName,
    archiveUndoVisible: archiveUndo.visible,
    dismissArchiveUndo,
    handleArchive,
    handleArchiveUndo,
  };
}
