/**
 * Undo Toasts for HabitDetailScreen
 */

import React from 'react';
import { DeleteUndoToast } from '../../../components/DeleteUndoToast';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';

interface UndoToastsProps {
  habitName: string;
  pendingDelete: boolean;
  pendingArchive: boolean;
  onConfirmDelete: () => void;
  onDismissDelete: () => void;
  onUndoDelete: () => void;
  onConfirmArchive: () => void;
  onUndoArchive: () => void;
}

export function UndoToasts({
  habitName,
  pendingDelete,
  pendingArchive,
  onConfirmDelete,
  onDismissDelete,
  onUndoDelete,
  onConfirmArchive,
  onUndoArchive,
}: UndoToastsProps) {
  return (
    <>
      <DeleteUndoToast
        duration={5000}
        itemName={habitName}
        visible={pendingDelete}
        onConfirm={onConfirmDelete}
        onDismiss={onDismissDelete}
        onUndo={onUndoDelete}
      />
      <ArchiveUndoToast
        duration={5000}
        habitName={habitName}
        visible={pendingArchive}
        onDismiss={onConfirmArchive}
        onUndo={onUndoArchive}
      />
    </>
  );
}
