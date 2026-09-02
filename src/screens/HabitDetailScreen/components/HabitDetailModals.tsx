/**
 * HabitDetailModals - Undo toasts for habit detail screen
 */

import React from 'react';
import { UndoToasts } from './UndoToasts';

interface HabitDetailModalsProps {
  habitName: string;
  pendingArchive: boolean;
  pendingDelete: boolean;
  handleConfirmArchive: () => void;
  handleConfirmDelete: () => void;
  handleUndoArchive: () => void;
  handleUndoDelete: () => void;
  setPendingDelete: (pending: boolean) => void;
}

export function HabitDetailModals({
  habitName,
  pendingArchive,
  pendingDelete,
  handleConfirmArchive,
  handleConfirmDelete,
  handleUndoArchive,
  handleUndoDelete,
  setPendingDelete,
}: HabitDetailModalsProps) {
  return (
    <UndoToasts
      habitName={habitName}
      pendingArchive={pendingArchive}
      pendingDelete={pendingDelete}
      onConfirmArchive={handleConfirmArchive}
      onConfirmDelete={handleConfirmDelete}
      onDismissDelete={() => setPendingDelete(false)}
      onUndoArchive={handleUndoArchive}
      onUndoDelete={handleUndoDelete}
    />
  );
}
