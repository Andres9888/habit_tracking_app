/**
 * NotesList Types
 */

import type { Id } from '../../../../convex/_generated/dataModel';

export interface NotesListProps {
  hideHabitFilter?: boolean;
  initialHabitId?: Id<'habits'>;
  onAddNote?: () => void;
}

export interface NoteGroup {
  date: string;
  notes: NoteItem[];
}

export interface NoteItem {
  _id: Id<'notes'>;
  _creationTime: number;
  body: string;
  date: string;
  habitId?: Id<'habits'>;
  createdAt: number;
  updatedAt: number;
}
