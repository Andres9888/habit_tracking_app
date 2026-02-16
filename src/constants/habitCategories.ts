/**
 * Habit Categories - Default categories for organizing habits
 * Based on the emoji categories but designed for habit classification
 */

export interface HabitCategoryDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  isPremium?: boolean;
}

/**
 * Default habit categories following the design system
 */
export const DEFAULT_HABIT_CATEGORIES: HabitCategoryDef[] = [
  {
    description: 'Fitness, exercise, and physical activity',
    icon: '💪',
    id: 'fitness',
    name: 'Fitness',
  },
  {
    description: 'Nutrition, sleep, and overall health',
    icon: '🍎',
    id: 'health',
    name: 'Health',
  },
  {
    description: 'Focus, work, and goal achievement',
    icon: '💼',
    id: 'productivity',
    name: 'Productivity',
  },
  {
    description: 'Meditation, reflection, and mental wellness',
    icon: '🧘',
    id: 'mindfulness',
    name: 'Mindfulness',
  },
  {
    description: 'Reading, studying, and skill development',
    icon: '📚',
    id: 'learning',
    name: 'Learning',
  },
  {
    description: 'Relationships, connection, and community',
    icon: '❤️',
    id: 'social',
    name: 'Social',
  },
];

/**
 * Premium-only custom categories
 * Users with premium can create their own categories
 */
export const CUSTOM_CATEGORY_PLACEHOLDER: HabitCategoryDef = {
  description: 'Create your own custom categories',
  icon: '✨',
  id: 'custom',
  isPremium: true,
  name: 'Custom',
};

/**
 * Special "All" category for viewing all habits
 */
export const ALL_CATEGORIES_FILTER: HabitCategoryDef = {
  description: 'View all habits',
  icon: '⭐',
  id: 'all',
  name: 'All',
};

/**
 * Get a category by ID
 */
export function getCategoryById(id: string): HabitCategoryDef | undefined {
  if (id === ALL_CATEGORIES_FILTER.id) return ALL_CATEGORIES_FILTER;
  return DEFAULT_HABIT_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get category name by ID (fallback to "Uncategorized")
 */
export function getCategoryName(id: string | undefined): string {
  if (!id) return 'Uncategorized';
  const category = getCategoryById(id);
  return category?.name ?? 'Uncategorized';
}

/**
 * Get all available categories (including "All")
 */
export function getAllCategories(): HabitCategoryDef[] {
  return [ALL_CATEGORIES_FILTER, ...DEFAULT_HABIT_CATEGORIES];
}
