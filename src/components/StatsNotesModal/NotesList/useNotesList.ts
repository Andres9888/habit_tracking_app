/**
 * NotesList Hook
 * State management and data fetching for notes list
 */

import { triggerHaptic } from '@/utils/haptics';
import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useNotesList(initialHabitId?: Id<'habits'>) {
  const [searchText, setSearchText] = useState('');
  const [selectedHabitFilter, setSelectedHabitFilter] = useState<
    Id<'habits'> | 'all'
  >(initialHabitId ?? 'all');
  const [editingNoteId, setEditingNoteId] = useState<Id<'notes'> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showVisualizationGuide, setShowVisualizationGuide] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<Id<'notes'> | null>(
    null
  );

  useEffect(() => {
    if (initialHabitId) {
      setSelectedHabitFilter(initialHabitId);
    }
  }, [initialHabitId]);

  const habits = useQuery(api.habits.list) ?? [];
  const notes =
    useQuery(api.notes.search, {
      habitId: selectedHabitFilter === 'all' ? undefined : selectedHabitFilter,
      searchText: searchText || undefined,
    }) ?? [];

  const deleteNote = useMutation(api.notes.remove);

  const groupedNotes = useMemo(() => {
    const groups = new Map<string, typeof notes>();

    for (const note of notes) {
      const existing = groups.get(note.date) || [];
      groups.set(note.date, [...existing, note]);
    }

    return [...groups.entries()]
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, dateNotes]) => ({
        date,
        notes: dateNotes.sort((a, b) => b._creationTime - a._creationTime),
      }));
  }, [notes]);

  const editingNote = editingNoteId
    ? notes.find((n) => n._id === editingNoteId)
    : null;

  const handleDelete = async (noteId: Id<'notes'>) => {
    setDeletingNoteId(noteId);
    try {
      await deleteNote({ noteId });
    } catch (error) {
      if (__DEV__) console.error('Failed to delete note:', error);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleOpenVisualizationGuide = () => {
    triggerHaptic('toggle');
    setShowVisualizationGuide(true);
  };

  const handleCloseVisualizationGuide = () => {
    triggerHaptic('tap');
    setShowVisualizationGuide(false);
  };

  return {
    deletingNoteId,
    editingNote,
    editingNoteId,
    groupedNotes,
    habits,
    handleCloseVisualizationGuide,
    handleDelete,
    handleOpenVisualizationGuide,
    isAdding,
    searchText,
    selectedHabitFilter,
    setEditingNoteId,
    setIsAdding,
    setSearchText,
    setSelectedHabitFilter,
    showVisualizationGuide,
  };
}
