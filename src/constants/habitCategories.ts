/**
 * Habit Categories for grouping and filtering habits
 *
 * Default categories are available to all users.
 * Custom categories are a premium feature.
 */

export interface HabitCategoryOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const DEFAULT_HABIT_CATEGORIES: HabitCategoryOption[] = [
  {
    id: 'health',
    name: 'Health',
    icon: '🍎',
    color: '#059669', // Primary green
    description: 'Nutrition, sleep, medical care',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '⚡',
    color: '#f59e0b', // Amber
    description: 'Work, focus, goals',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: '🧘',
    color: '#8b5cf6', // Purple
    description: 'Meditation, breathing, awareness',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    color: '#ef4444', // Red
    description: 'Exercise, sports, movement',
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: '📚',
    color: '#3b82f6', // Blue
    description: 'Reading, education, skills',
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    color: '#ec4899', // Pink
    description: 'Relationships, community, family',
  },
];

export function getCategoryById(id: string): HabitCategoryOption | undefined {
  return DEFAULT_HABIT_CATEGORIES.find((cat) => cat.id === id);
}

export function getCategoryColor(categoryId?: string): string {
  if (!categoryId) return '#6b7280'; // Gray for uncategorized
  const category = getCategoryById(categoryId);
  return category?.color ?? '#6b7280';
}

export function getCategoryName(categoryId?: string): string {
  if (!categoryId) return 'Uncategorized';
  const category = getCategoryById(categoryId);
  return category?.name ?? 'Custom';
}
