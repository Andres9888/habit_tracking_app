import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '../../../../../convex/_generated/api';
import { logInteraction } from '../../../../lib/analytics/interactions';
import { showGenericError } from '../../../../utils/errorAlerts';
import { cancelHabitReminder } from '@/utils/notifications';
import type { UseSelectionActionsArgs } from './useSelectionActions.types';

type Args = Pick<UseSelectionActionsArgs, 'selectedIds' | 'exitSelectionMode'>;

export function useSelectionDeleteActions({
  selectedIds,
  exitSelectionMode,
}: Args) {
  const batchRemoveMutation = useMutation(api.habits.batchRemove);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);

  const showDeleteConfirmation = useCallback(() => {
    setDeleteCount(selectedIds.size);
    setConfirmDeleteVisible(true);
  }, [selectedIds.size]);

  const hideDeleteConfirmation = useCallback(
    () => setConfirmDeleteVisible(false),
    []
  );

  const confirmBatchDelete = useCallback(async () => {
    const ids = [...selectedIds];
    setConfirmDeleteVisible(false);
    exitSelectionMode();
    try {
      await batchRemoveMutation({ habitIds: ids });
      await Promise.all(ids.map((id) => cancelHabitReminder(String(id))));
      logInteraction('habits_batch_deleted', { count: ids.length });
    } catch (error) {
      if (__DEV__)
        console.error('[useSelectionActions] Batch delete failed:', error);
      showGenericError('Failed to delete habits. Please try again.');
    }
  }, [selectedIds, exitSelectionMode, batchRemoveMutation]);

  return {
    confirmBatchDelete,
    confirmDeleteVisible,
    deleteCount,
    hideDeleteConfirmation,
    showDeleteConfirmation,
  };
}
