import { useCallback } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';

interface UseArchiveSelectionActionsParams {
  selectedIds: Set<Id<'habits'>>;
  archivedHabitIds: Id<'habits'>[];
  handleBatchRestore: (ids: Set<Id<'habits'>>) => Promise<boolean>;
  handleBatchDelete: (
    ids: Set<Id<'habits'>>,
    options?: { onSuccess?: () => void }
  ) => void;
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

  const handleBatchRestorePress = useCallback(async () => {
    const didRestore = await handleBatchRestore(selectedIds);
    if (didRestore) exitSelectionMode();
  }, [handleBatchRestore, selectedIds, exitSelectionMode]);

  const handleBatchDeletePress = useCallback(() => {
    handleBatchDelete(selectedIds, { onSuccess: exitSelectionMode });
  }, [handleBatchDelete, selectedIds, exitSelectionMode]);

  return { handleSelectAll, handleBatchRestorePress, handleBatchDeletePress };
}
