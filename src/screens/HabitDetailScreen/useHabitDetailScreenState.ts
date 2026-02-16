import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * @fileoverview useHabitDetailScreenState - State management for HabitDetailScreen
 * 
 * **Purpose:**
 * Manages UI state, completion tracking, and notes for a single habit detail view
 * 
 * **Responsibilities:**
 * - Tracks modal visibility (notes editor, notes list)
 * - Manages completed dates set (for calendar view)
 * - Calculates derived state (completion count, strength %, days tracking)
 * - Fetches and indexes habit notes by date
 * - Manages undo states (pending delete/archive)
 * - Determines if habit is completed today
 * 
 * **Key state:**
 * - completedDates: Set<string> of ISO date strings (completed days)
 * - notesByDate: Record<string, string> for quick note lookup
 * - isCompletedToday: boolean flag for today's completion
 * - Modal states: isNotesEditorOpen, isNotesListOpen, editingNoteId
 * 
 * **Performance optimizations:**
 * - Memoized completedDates key to prevent unnecessary recalculations
 * - Only recalculates when tracking data actually changes
 * - Efficient Set-based completed dates lookup
 * 
 * **Props:**
 * - habitCreatedAt: Timestamp for "days tracking" calculation
 * - habitId: ID for fetching notes
 * - habitStrength: 0-1 value for strength percentage
 * - tracking: Array of completion entries
 * - visible: Controls whether to fetch notes (performance optimization)
 */

import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
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
