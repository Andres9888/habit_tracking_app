/**
 * Undo Toasts for HabitDetailScreen
 */

import React from 'react';
import { DeleteUndoToast } from '../../../components/DeleteUndoToast';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { CompleteUndoToast } from '../../../components/CompleteUndoToast';

interface UndoToastsProps {
  habitName: string;
  pendingDelete: boolean;
  pendingArchive: boolean;
  completeToastMessage: string | null;
  onConfirmDelete: () => void;
  onDismissDelete: () => void;
  onUndoDelete: () => void;
  onConfirmArchive: () => void;
  onUndoArchive: () => void;
  onDismissComplete: () => void;
  onUndoComplete: () => void;
}

export function UndoToasts({
  habitName,
  pendingDelete,
  pendingArchive,
  completeToastMessage,
  onConfirmDelete,
  onDismissDelete,
  onUndoDelete,
  onConfirmArchive,
  onUndoArchive,
  onDismissComplete,
  onUndoComplete,
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
      <CompleteUndoToast
        message={completeToastMessage ?? ''}
        visible={completeToastMessage !== null}
        onDismiss={onDismissComplete}
        onUndo={onUndoComplete}
      />
    </>
  );
}
