import type { Id } from '../../../convex/_generated/dataModel';

export type CalendarView = 'month' | 'year';

export interface Habit {
  _id: Id<'habits'>;
  name: string;
  notes?: string;
  strength?: number;
  frequency?: string;
  reminderTime?: string;
  preferredTime?: string;
  createdAt?: number;
  [key: string]: any;
}

export interface TrackingEntry {
  _creationTime: number;
  habitId: Id<'habits'>;
  date: string;
  completed: boolean;
}

export interface HabitCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit | null;
  streak: number;
  tracking: TrackingEntry[];
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  /** Optional callback to navigate to HabitDetail's Motivation tab for advanced features */
  onOpenMotivationTab?: () => void;
  /** Callback to open the edit screen at the parent level (avoids nested modals) */
  onEdit?: () => void;
}
