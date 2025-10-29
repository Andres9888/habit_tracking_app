import type { Doc } from '../../../convex/_generated/dataModel';

export type HabitDoc = Doc<'habits'>;

export type HabitTemplate = Doc<'templates'>;

export type Category =
  | 'all'
  | 'morning_routine'
  | 'health_fitness'
  | 'productivity'
  | 'mindfulness';

export interface CategoryFilter {
  id: Category;
  label: string;
  icon: string;
}

export interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habitToEdit?: HabitDoc | null;
}
