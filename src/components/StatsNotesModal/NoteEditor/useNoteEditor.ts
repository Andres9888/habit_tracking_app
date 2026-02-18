/**
 * useNoteEditor Hook
 *
 * Manages state and logic for the note editor form.
 */

import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { useState } from 'react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

interface UseNoteEditorOptions {
  noteId?: Id<'notes'>;
  initialBody?: string;
  initialDate?: string;
  initialHabitId?: Id<'habits'>;
  onSaveComplete: () => void;
}

export function useNoteEditor({
  noteId,
  initialBody = '',
  initialDate,
  initialHabitId,
  onSaveComplete,
}: UseNoteEditorOptions) {
  const [body, setBody] = useState(initialBody);
  const [date, setDate] = useState(
    initialDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedHabitId, setSelectedHabitId] = useState<
    Id<'habits'> | undefined
  >(initialHabitId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const habitsData = useQuery(api.habits.list);
  const habits = habitsData ?? [];
  const isLoadingHabits = habitsData === undefined;

  const characterCount = body.length;
  const isValid = body.trim().length > 0 && characterCount <= 1000;
  const isEditing = Boolean(noteId);

  const handleSave = async () => {
    if (!isValid) return;

    setIsSaving(true);
    setError('');

    try {
      await (noteId
        ? updateNote({ body: body.trim(), noteId })
        : createNote({
            body: body.trim(),
            date,
            habitId: selectedHabitId,
          }));
      onSaveComplete();
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Failed to save note'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    body,
    characterCount,
    date,
    error,
    habits,
    handleSave,
    isEditing,
    isLoadingHabits,
    isSaving,
    isValid,
    selectedHabitId,
    setBody,
    setDate,
    setSelectedHabitId,
  };
}
