import { useMemo } from 'react';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { useArchiveSelection } from './useArchiveSelection';
import { useArchiveSelectionActions } from './useArchiveSelectionActions';
import type { Id } from '../../../convex/_generated/dataModel';

export function useArchivedHabitsModalState() {
  const logic = useArchivedHabitsModalLogic();
  const selection = useArchiveSelection();
  const reducedMotion = useReduceMotion();

  const archivedHabitIds = useMemo(
    () => logic.archivedHabits.map((h) => h._id) as Id<'habits'>[],
    [logic.archivedHabits]
  );

  const { handleSelectAll, handleBatchRestorePress, handleBatchDeletePress } =
    useArchiveSelectionActions({
      selectedIds: selection.selectedIds,
      archivedHabitIds,
      handleBatchRestore: logic.handleBatchRestore,
      handleBatchDelete: logic.handleBatchDelete,
      exitSelectionMode: selection.exitSelectionMode,
      selectAll: selection.selectAll,
    });

  const allSelected = selection.selectedCount === logic.archivedHabits.length
    && logic.archivedHabits.length > 0;

  return {
    ...logic,
    ...selection,
    allSelected,
    archivedHabitIds,
    reducedMotion,
    handleSelectAll,
    handleBatchRestorePress,
    handleBatchDeletePress,
  };
}
