/**
 * Type definitions for NoteEditor
 */

import type { Id } from '../../../../convex/_generated/dataModel';

export interface NoteEditorProps {
  noteId?: Id<'notes'>;
  initialBody?: string;
  initialDate?: string;
  initialHabitId?: Id<'habits'>;
  onCancel: () => void;
  onSave: () => void;
}

export interface HabitSelectorProps {
  habits: Array<{ _id: Id<'habits'>; name: string }>;
  selectedHabitId: Id<'habits'> | undefined;
  onSelectHabit: (habitId?: Id<'habits'>) => void;
}

export interface NoteEditorActionsProps {
  isValid: boolean;
  isSaving: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
}
