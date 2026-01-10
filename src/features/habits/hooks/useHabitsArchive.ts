import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';

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

      await archiveHabitMutation({ habitId });

      setArchiveUndo({
        habitId,
        habitName,
        visible: true,
      });

      logInteraction('habit_archived', { habitId, habitName });
    },
    [archiveHabitMutation, habits]
  );

  const handleArchiveUndo = useCallback(async () => {
    if (archiveUndo.habitId) {
      await unarchiveHabitMutation({ habitId: archiveUndo.habitId });
      logInteraction('habit_archive_undone', {
        habitId: archiveUndo.habitId,
        habitName: archiveUndo.habitName,
      });
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
