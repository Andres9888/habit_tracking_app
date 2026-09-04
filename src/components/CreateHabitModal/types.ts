import type { Doc, Id } from '../../../convex/_generated/dataModel';

export type HabitDoc = Doc<'habits'>;

export type HabitTemplate = Doc<'templates'>;

export type Category =
  | 'all'
  | 'morning_routine'
  | 'health_fitness'
  | 'productivity'
  | 'mindfulness'
  | 'andrew_huberman'
  | 'learning'
  | 'social'
  | 'financial'
  | 'creativity'
  | 'sleep'
  | 'longevity'
  | 'mental_health'
  | 'recovery'
  | 'breathing';

export interface CategoryFilter {
  id: Category;
  label: string;
  icon: string;
}

export interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habitToEdit?: HabitDoc | null;
  /**
   * Fires for each new-habit attempt, including explicit retries (never on
   * edit), with the optimistic id the row carries until the mutation syncs.
   */
  onHabitCreated?: (tempId: Id<'habits'>) => void;
  /** Fires once the optimistic create has a server id. */
  onHabitCreateSynced?: (tempId: Id<'habits'>, habitId: Id<'habits'>) => void;
}
