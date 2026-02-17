/**
 * Default habit categories for organizing and filtering habits.
 *
 * Six built-in categories are available to all users.
 * Custom categories are a premium feature.
 */

export interface HabitCategoryDef {
  id: string;
  label: string;
  icon: string;
  color: string;
}

/** Built-in habit categories available to all users */
export const DEFAULT_HABIT_CATEGORIES: HabitCategoryDef[] = [
  { id: 'health', label: 'Health', icon: '❤️', color: '#ef4444' },
  { id: 'productivity', label: 'Productivity', icon: '🎯', color: '#f59e0b' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: '#8b5cf6' },
  { id: 'fitness', label: 'Fitness', icon: '💪', color: '#059669' },
  { id: 'learning', label: 'Learning', icon: '📚', color: '#3b82f6' },
  { id: 'social', label: 'Social', icon: '👥', color: '#ec4899' },
];

/** Get category definition by ID */
export function getCategoryById(
  id: string | undefined
): HabitCategoryDef | undefined {
  if (!id) return undefined;
  return DEFAULT_HABIT_CATEGORIES.find((cat) => cat.id === id);
}

/** All category filter options (including "All") */
export const CATEGORY_FILTER_OPTIONS: Array<{
  id: string;
  label: string;
  icon: string;
}> = [
  { id: 'all', label: 'All', icon: '✨' },
  ...DEFAULT_HABIT_CATEGORIES,
];
