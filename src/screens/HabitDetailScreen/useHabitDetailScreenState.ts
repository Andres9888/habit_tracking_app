/**
 * useHabitDetailScreenState - State management for the habit detail screen
 */

import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id, Doc } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';

interface UseHabitDetailScreenStateProps {
  habitCreatedAt: number | undefined;
  habitId: Id<'habits'> | undefined;
  habitStrength: number;
  tracking: HabitTrackingEntry[];
  visible: boolean;
}

export const useHabitDetailScreenState = ({
  habitCreatedAt,
  habitId,
  habitStrength,
  tracking,
  visible,
}: UseHabitDetailScreenStateProps) => {
  // Notes modal states
  const [isNotesEditorOpen, setIsNotesEditorOpen] = useState(false);
  const [isNotesListOpen, setIsNotesListOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<Id<'notes'> | null>(null);

  // Delete/Archive undo toast states (T3.5: Swipe-to-delete)
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingArchive, setPendingArchive] = useState(false);

  // Calendar toggling state
  const [isTogglingCalendar, setIsTogglingCalendar] = useState(false);

  // Fetch habit notes
  const habitNotes =
    useQuery(api.notes.search, visible && habitId ? { habitId } : 'skip') ?? [];

  // Today's date
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Completed dates set
  const completedDates = useMemo(() => {
    if (!habitId) {
      return new Set<string>();
    }
    return new Set(
      tracking
        .filter((entry) => entry.habitId === habitId && entry.completed)
        .map((entry) => entry.date)
    );
  }, [habitId, tracking]);

  const isCompletedToday = completedDates.has(today);

  // Days tracking calculation
  const daysTracking = useMemo(() => {
    return habitCreatedAt
      ? Math.max(
          0,
          Math.floor((Date.now() - habitCreatedAt) / (1000 * 60 * 60 * 24))
        )
      : 0;
  }, [habitCreatedAt]);

  const totalCompletions = useMemo(() => completedDates.size, [completedDates]);

  const strengthPercent = useMemo(
    () => Math.max(0, Math.min(100, habitStrength * 100)),
    [habitStrength]
  );

  // Get the note being edited
  const editingNote = editingNoteId
    ? habitNotes.find((n) => n._id === editingNoteId)
    : null;

  return {
    completedDates,
    daysTracking,
    editingNote,
    editingNoteId,
    habitNotes,
    isCompletedToday,
    isNotesEditorOpen,
    isNotesListOpen,
    isTogglingCalendar,
    pendingArchive,
    pendingDelete,
    setEditingNoteId,
    setIsNotesEditorOpen,
    setIsNotesListOpen,
    setIsTogglingCalendar,
    setPendingArchive,
    setPendingDelete,
    strengthPercent,
    today,
    totalCompletions,
  };
};
