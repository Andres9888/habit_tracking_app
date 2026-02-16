/**
 * OPTIMIZED: useNotesList
 * 
 * Uses shared HabitsDataContext instead of duplicate query
 * 
 * Performance improvements:
 * - Eliminates duplicate habits.list query
 * - Keeps notes search query (specific to this component)
 */

import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import * as Haptics from 'expo-haptics';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useHabitsData } from '../../../contexts/HabitsDataContext';

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

  // Use shared habits context instead of duplicate query
  const { habits } = useHabitsData();

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowVisualizationGuide(true);
  };

  const handleCloseVisualizationGuide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
