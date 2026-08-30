/**
 * Undo Toasts for HabitDetailScreen
 */

import React from 'react';
import { DeleteUndoToast } from '../../../components/DeleteUndoToast';
import { ArchiveUndoToast } from '../../../components/ArchiveUndoToast';
import { CompletionUndoToast } from './CompletionUndoToast';

interface UndoToastsProps {
  completionToastStreak: number;
  completionToastVisible: boolean;
  habitName: string;
  pendingDelete: boolean;
  pendingArchive: boolean;
  onDismissCompletionToast: () => void;
  onConfirmDelete: () => void;
  onDismissDelete: () => void;
  onUndoDelete: () => void;
  onConfirmArchive: () => void;
  onUndoArchive: () => void;
  onUndoCompletionToast: () => void;
}

export function UndoToasts({
  completionToastStreak,
  completionToastVisible,
  habitName,
  pendingDelete,
  pendingArchive,
  onDismissCompletionToast,
  onConfirmDelete,
  onDismissDelete,
  onUndoDelete,
  onConfirmArchive,
  onUndoArchive,
  onUndoCompletionToast,
}: UndoToastsProps) {
  return (
    <>
      <CompletionUndoToast
        streak={completionToastStreak}
        visible={completionToastVisible}
        onDismiss={onDismissCompletionToast}
        onUndo={onUndoCompletionToast}
      />
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
