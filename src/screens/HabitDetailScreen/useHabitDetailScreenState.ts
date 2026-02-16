import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitDetailScreenState - State management for the habit detail screen
 */

import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import { computeCurrentStreakFromDates } from '../../utils/streak';

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
  const today = useMemo(() => getLocalDateString(), []);

  // Create a stable string key for completed dates to prevent unnecessary re-renders
  // when tracking array reference changes but content is the same
  const completedDatesKey = useMemo(() => {
    if (!habitId || !tracking || !Array.isArray(tracking)) return '';
    const dates = tracking
      .filter((entry) => entry && entry.habitId === habitId && entry.completed)
      .map((entry) => entry.date)
      .filter((date): date is string => typeof date === 'string');
    if (dates.length === 0) return '';
    return dates.sort().join(',');
  }, [habitId, tracking]);

  // Completed dates set - only recalculates when the actual dates change
  // Note: ''.split(',') returns [''] not [], so we must check for empty string first
  const completedDates = useMemo(() => {
    if (!completedDatesKey) {
      return new Set<string>();
    }
    return new Set(completedDatesKey.split(','));
  }, [completedDatesKey]);

  const isCompletedToday = completedDates.has(today);

  const currentStreak = useMemo(
    () => computeCurrentStreakFromDates(completedDates, new Date()),
    [completedDates]
  );

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

  // Create notesByDate map for quick lookup by date
  const notesByDate = useMemo(() => {
    const map: Record<string, string> = {};
    habitNotes.forEach((note) => {
      if (note.date) {
        map[note.date] = note.body;
      }
    });
    return map;
  }, [habitNotes]);

  return {
    completedDates,
    currentStreak,
    daysTracking,
    editingNote,
    editingNoteId,
    habitNotes,
    isCompletedToday,
    isNotesEditorOpen,
    isNotesListOpen,
    isTogglingCalendar,
    notesByDate,
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
