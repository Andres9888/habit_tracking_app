/**
 * HabitDetailScreen Types
 * Type definitions for the habit detail screen
 */

import type { Id, Doc } from '../../../convex/_generated/dataModel';
import type {
  Habit as HabitDoc,
  HabitTrackingEntry,
} from '../../features/habits/types';

export type Habit = HabitDoc & {
  successRate?: number;
  totalCompletions?: number;
  totalMisses?: number;
};

export interface WeekDayData {
  completed: boolean;
  date: string;
  isToday: boolean;
}

export interface HabitDetailScreenProps {
  habit: Habit | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEdit?: (habit: Habit) => void;
  onOpenCalendar?: (habit: Habit) => void;
  onPause?: (habitId: Id<'habits'>) => void;
  tracking?: HabitTrackingEntry[];
  visible: boolean;
}

export interface HeroSectionProps {
  currentStreak: number;
  habit: Habit;
  isCompletedToday: boolean;
  reduceMotion?: boolean;
}

export interface NotesListModalProps {
  habitId: Id<'habits'>;
  insets: { top: number; bottom: number };
  isOpen: boolean;
  onClose: () => void;
}

export interface NotesEditorModalProps {
  editingNote: Doc<'notes'> | null | undefined;
  habitId: Id<'habits'>;
  insets: { top: number; bottom: number };
  isOpen: boolean;
  onClose: () => void;
}

export interface UseHabitDetailScreenStateReturn {
  completedDates: Set<string>;
  daysTracking: number;
  editingNote: Doc<'notes'> | null | undefined;
  editingNoteId: Id<'notes'> | null;
  habitNotes: Doc<'notes'>[];
  isCompletedToday: boolean;
  isNotesEditorOpen: boolean;
  isNotesListOpen: boolean;
  isTogglingCalendar: boolean;
  pendingArchive: boolean;
  pendingDelete: boolean;
  setEditingNoteId: (id: Id<'notes'> | null) => void;
  setIsNotesEditorOpen: (open: boolean) => void;
  setIsNotesListOpen: (open: boolean) => void;
  setIsTogglingCalendar: (toggling: boolean) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
  strengthPercent: number;
  today: string;
  totalCompletions: number;
}
