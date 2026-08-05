import { useCallback } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';

interface UseArchiveSelectionActionsParams {
  selectedIds: Set<Id<'habits'>>;
  archivedHabitIds: Id<'habits'>[];
  handleBatchRestore: (ids: Set<Id<'habits'>>) => Promise<void>;
  handleBatchDelete: (ids: Set<Id<'habits'>>) => void;
  exitSelectionMode: () => void;
  selectAll: (allIds: Id<'habits'>[]) => void;
}

export function useArchiveSelectionActions({
  selectedIds,
  archivedHabitIds,
  handleBatchRestore,
  handleBatchDelete,
  exitSelectionMode,
  selectAll,
}: UseArchiveSelectionActionsParams) {
  const handleSelectAll = useCallback(
    () => selectAll(archivedHabitIds),
    [selectAll, archivedHabitIds]
  );

  const handleBatchRestorePress = useCallback(() => {
    handleBatchRestore(selectedIds);
    exitSelectionMode();
  }, [handleBatchRestore, selectedIds, exitSelectionMode]);

  const handleBatchDeletePress = useCallback(() => {
    handleBatchDelete(selectedIds);
    exitSelectionMode();
  }, [handleBatchDelete, selectedIds, exitSelectionMode]);

  return { handleSelectAll, handleBatchRestorePress, handleBatchDeletePress };
}
