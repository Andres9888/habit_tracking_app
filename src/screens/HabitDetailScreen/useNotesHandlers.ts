/**
 * useNotesHandlers
 * Notes modal handlers for habit detail screen
 */

import { useCallback } from 'react';
import type { Id, Doc } from '../../../convex/_generated/dataModel';
import type { Habit } from './HabitDetailScreen.types';

interface UseNotesHandlersProps {
  habit: Habit | null;
  onEdit?: (habit: Habit) => void;
  setEditingNoteId: (id: Id<'notes'> | null) => void;
  setIsNotesEditorOpen: (open: boolean) => void;
  setIsNotesListOpen: (open: boolean) => void;
}

export const useNotesHandlers = ({
  habit,
  onEdit,
  setEditingNoteId,
  setIsNotesEditorOpen,
  setIsNotesListOpen,
}: UseNotesHandlersProps) => {
  const handleOpenNotesEditor = useCallback(() => {
    setEditingNoteId(null);
    setIsNotesEditorOpen(true);
  }, [setEditingNoteId, setIsNotesEditorOpen]);

  const handleOpenNotesList = useCallback(() => {
    setIsNotesListOpen(true);
  }, [setIsNotesListOpen]);

  const handleEditNote = useCallback(
    (note: Doc<'notes'>) => {
      setEditingNoteId(note._id);
      setIsNotesEditorOpen(true);
    },
    [setEditingNoteId, setIsNotesEditorOpen]
  );

  const handleCloseNotesEditor = useCallback(() => {
    setEditingNoteId(null);
    setIsNotesEditorOpen(false);
  }, [setEditingNoteId, setIsNotesEditorOpen]);

  const handleEdit = useCallback(() => {
    if (habit) {
      onEdit?.(habit);
    }
  }, [habit, onEdit]);

  return {
    handleCloseNotesEditor,
    handleEdit,
    handleEditNote,
    handleOpenNotesEditor,
    handleOpenNotesList,
  };
};
