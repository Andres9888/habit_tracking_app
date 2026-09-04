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

/** What the post-create toast needs to name the habit back to the user. */
export interface CreatedHabitInfo {
  color: string;
  /** The optimistic (client request) id until the mutation syncs. */
  habitId: Id<'habits'>;
  icon: string;
  name: string;
}

export interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habitToEdit?: HabitDoc | null;
  /** Fires as the form closes on a new habit (never on edit). */
  onHabitCreated?: (habit: CreatedHabitInfo) => void;
  /** Fires once the optimistic create has a server id. */
  onHabitCreateSynced?: (tempId: Id<'habits'>, habitId: Id<'habits'>) => void;
}
