/**
 * Swipe action handlers for habit detail screen
 * Handles delete/archive swipe gestures with accessibility announcements
 */

import { useCallback } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

interface UseSwipeActionsProps {
  habit: { _id: Id<'habits'>; name: string } | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
}

export const useSwipeActions = ({
  habit,
  onArchive,
  onClose,
  onDelete,
  setPendingArchive,
  setPendingDelete,
}: UseSwipeActionsProps) => {
  const handleSwipeDelete = useCallback(() => {
    void triggerHaptic('heavy');
    setPendingDelete(true);
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(
        `${habit?.name} marked for deletion. Undo available.`
      );
    }, 100);
  }, [setPendingDelete, habit?.name]);

  const handleSwipeArchive = useCallback(() => {
    void triggerHaptic('heavy');
    setPendingArchive(true);
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(
        `${habit?.name} marked for archiving. Undo available.`
      );
    }, 100);
  }, [setPendingArchive, habit?.name]);

  const handleConfirmDelete = useCallback(() => {
    setPendingDelete(false);
    if (habit) {
      onDelete?.(habit._id);
      onClose();
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(
          `${habit.name} has been deleted.`
        );
      }, 100);
    }
  }, [habit, onDelete, onClose, setPendingDelete]);

  const handleConfirmArchive = useCallback(() => {
    setPendingArchive(false);
    if (habit) {
      onArchive?.(habit._id);
      onClose();
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(
          `${habit.name} has been archived.`
        );
      }, 100);
    }
  }, [habit, onArchive, onClose, setPendingArchive]);

  const handleUndoDelete = useCallback(
    () => setPendingDelete(false),
    [setPendingDelete]
  );
  const handleUndoArchive = useCallback(
    () => setPendingArchive(false),
    [setPendingArchive]
  );

  return {
    handleConfirmArchive,
    handleConfirmDelete,
    handleSwipeArchive,
    handleSwipeDelete,
    handleUndoArchive,
    handleUndoDelete,
  };
};
