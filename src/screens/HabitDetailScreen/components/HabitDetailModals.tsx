/**
 * HabitDetailModals - Undo toasts for habit detail screen
 */

import React from 'react';
import { UndoToasts } from './UndoToasts';
import type { Id } from '../../../../convex/_generated/dataModel';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { useCompletionToast } from '../useCompletionToast';

interface HabitDetailModalsProps {
  currentStreak: number;
  habitId: Id<'habits'>;
  habitName: string;
  isCompletedToday: boolean;
  pendingArchive: boolean;
  pendingDelete: boolean;
  handleConfirmArchive: () => void;
  handleConfirmDelete: () => void;
  handleUndoArchive: () => void;
  handleUndoCompletionToast: (date: string) => void;
  handleUndoDelete: () => void;
  setPendingDelete: (pending: boolean) => void;
}

export function HabitDetailModals({
  currentStreak,
  habitId,
  habitName,
  isCompletedToday,
  pendingArchive,
  pendingDelete,
  handleConfirmArchive,
  handleConfirmDelete,
  handleUndoArchive,
  handleUndoCompletionToast,
  handleUndoDelete,
  setPendingDelete,
}: HabitDetailModalsProps) {
  const completionToast = useCompletionToast({
    currentStreak,
    habitId,
    isCompletedToday,
  });

  return (
    <UndoToasts
      completionToastStreak={completionToast.completionToastStreak}
      completionToastVisible={completionToast.completionToastVisible}
      habitName={habitName}
      pendingArchive={pendingArchive}
      pendingDelete={pendingDelete}
      onDismissCompletionToast={completionToast.hideCompletionToast}
      onConfirmArchive={handleConfirmArchive}
      onConfirmDelete={handleConfirmDelete}
      onDismissDelete={() => setPendingDelete(false)}
      onUndoArchive={handleUndoArchive}
      onUndoCompletionToast={() =>
        handleUndoCompletionToast(
          completionToast.completionToastDate ?? getLocalDateString()
        )
      }
      onUndoDelete={handleUndoDelete}
    />
  );
}
