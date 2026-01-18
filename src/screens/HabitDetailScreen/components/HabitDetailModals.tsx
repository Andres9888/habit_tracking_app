/**
 * HabitDetailModals - Notes modals and undo toasts for habit detail screen
 */

import React from 'react';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { NotesListModal } from './NotesListModal';
import { NotesEditorModal } from './NotesEditorModal';
import { UndoToasts } from './UndoToasts';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface HabitDetailModalsProps {
  habitId: string;
  habitName: string;
  insets: EdgeInsets;
  isNotesListOpen: boolean;
  setIsNotesListOpen: (open: boolean) => void;
  editingNote: Doc<'notes'> | null | undefined;
  isNotesEditorOpen: boolean;
  handleCloseNotesEditor: () => void;
  pendingArchive: boolean;
  pendingDelete: boolean;
  handleConfirmArchive: () => void;
  handleConfirmDelete: () => void;
  handleUndoArchive: () => void;
  handleUndoDelete: () => void;
  setPendingDelete: (pending: boolean) => void;
}

export function HabitDetailModals({
  habitId,
  habitName,
  insets,
  isNotesListOpen,
  setIsNotesListOpen,
  editingNote,
  isNotesEditorOpen,
  handleCloseNotesEditor,
  pendingArchive,
  pendingDelete,
  handleConfirmArchive,
  handleConfirmDelete,
  handleUndoArchive,
  handleUndoDelete,
  setPendingDelete,
}: HabitDetailModalsProps) {
  return (
    <>
      <NotesListModal
        habitId={habitId}
        insets={insets}
        isOpen={isNotesListOpen}
        onClose={() => setIsNotesListOpen(false)}
      />
      <NotesEditorModal
        editingNote={editingNote}
        habitId={habitId}
        insets={insets}
        isOpen={isNotesEditorOpen}
        onClose={handleCloseNotesEditor}
      />
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
    </>
  );
}
