/**
 * HabitDetailModals - Undo toasts for habit detail screen
 */

import React from 'react';
import { UndoToasts } from './UndoToasts';
import type { Id } from '../../../../convex/_generated/dataModel';

interface HabitDetailModalsProps {
  habitId: Id<'habits'>;
  habitName: string;
  pendingArchive: boolean;
  pendingDelete: boolean;
  completeToastMessage: string | null;
  handleConfirmArchive: () => void;
  handleConfirmDelete: () => void;
  handleUndoArchive: () => void;
  handleUndoDelete: () => void;
  handleDismissComplete: () => void;
  handleUndoComplete: () => void;
  setPendingDelete: (pending: boolean) => void;
}

export function HabitDetailModals({
  habitName,
  pendingArchive,
  pendingDelete,
  completeToastMessage,
  handleConfirmArchive,
  handleConfirmDelete,
  handleUndoArchive,
  handleUndoDelete,
  handleDismissComplete,
  handleUndoComplete,
  setPendingDelete,
}: HabitDetailModalsProps) {
  return (
    <UndoToasts
      completeToastMessage={completeToastMessage}
      habitName={habitName}
      pendingArchive={pendingArchive}
      pendingDelete={pendingDelete}
      onConfirmArchive={handleConfirmArchive}
      onConfirmDelete={handleConfirmDelete}
      onDismissComplete={handleDismissComplete}
      onDismissDelete={() => setPendingDelete(false)}
      onUndoArchive={handleUndoArchive}
      onUndoComplete={handleUndoComplete}
      onUndoDelete={handleUndoDelete}
    />
  );
}
