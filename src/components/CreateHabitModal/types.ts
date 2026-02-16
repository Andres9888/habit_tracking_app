/**
 * Type definitions for CreateHabitModal component
 *
 * @module CreateHabitModal/types
 */

import type { Doc } from '../../../convex/_generated/dataModel';

/**
 * Habit document type from Convex database
 * Represents a saved habit with all its properties
 */
export type HabitDoc = Doc<'habits'>;

/**
 * Habit template document type from Convex database
 * Pre-configured habit suggestions users can apply
 */
export type HabitTemplate = Doc<'templates'>;

/**
 * Habit category for filtering templates
 *
 * @category Template Filtering
 * Categories help users discover relevant habit templates:
 * - 'all' - Show all templates (no filter)
 * - 'morning_routine' - Morning habits like meditation, exercise
 * - 'health_fitness' - Physical health and fitness habits
 * - 'productivity' - Work and personal productivity
 * - 'mindfulness' - Meditation, breathing, mental wellness
 * - 'andrew_huberman' - Science-based protocols from Dr. Huberman
 * - 'learning' - Education and skill-building
 * - 'social' - Social connection and relationships
 * - 'financial' - Money management and financial health
 * - 'creativity' - Creative practice and artistic expression
 * - 'sleep' - Sleep hygiene and rest
 * - 'longevity' - Longevity-focused health practices
 * - 'mental_health' - Mental wellness and emotional health
 * - 'recovery' - Physical recovery and rest
 * - 'breathing' - Breathwork and breathing exercises
 */
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

/**
 * Category filter button data
 * Used in the CategoryFilters component to render filter chips
 */
export interface CategoryFilter {
  /** Category identifier */
  id: Category;
  /** Human-readable label shown in UI */
  label: string;
  /** Emoji icon representing the category */
  icon: string;
}

/**
 * Props for CreateHabitModalCentered component
 *
 * @property visible - Controls modal visibility
 * @property onClose - Callback when modal is dismissed
 * @property habitToEdit - If provided, modal enters edit mode for this habit
 */
export interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habitToEdit?: HabitDoc | null;
}
