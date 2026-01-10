import type { Doc } from '../../../convex/_generated/dataModel';

export interface HabitNotesSectionProps {
  /** Notes for this habit (should already be filtered by habitId and sorted desc) */
  notes: Doc<'notes'>[];
  /** Callback when user taps "Add Note" */
  onAddNote: () => void;
  /** Callback when user taps "View All" to open full notes list */
  onViewAll: () => void;
  /** Callback when user taps a note to edit it */
  onEditNote?: (note: Doc<'notes'>) => void;
}
