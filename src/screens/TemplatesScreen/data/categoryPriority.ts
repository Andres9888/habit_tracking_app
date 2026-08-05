/**
 * Shared category ordering — drives catalog category grouping.
 */

export const CATEGORY_PRIORITY = [
  'morning_routine',
  'mental_health',
  'health_fitness',
  'sleep',
  'mindfulness',
  'learning',
  'financial',
  'productivity',
  'recovery',
  'social',
  'breathing',
  'creativity',
  'longevity',
  'andrew_huberman',
] as const;

export function getCategoryPriority(categoryId: string) {
  const index = CATEGORY_PRIORITY.indexOf(
    categoryId as (typeof CATEGORY_PRIORITY)[number]
  );
  return index === -1 ? CATEGORY_PRIORITY.length : index;
}
