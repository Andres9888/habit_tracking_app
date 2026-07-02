import { v } from 'convex/values';

export const TEMPLATE_CATEGORIES = [
  { icon: '🔬', id: 'andrew_huberman', label: 'Huberman' },
  { icon: '🌬️', id: 'breathing', label: 'Breathing' },
  { icon: '🎨', id: 'creativity', label: 'Creativity' },
  { icon: '🏠', id: 'environmental_design', label: 'Environment' },
  { icon: '💰', id: 'financial', label: 'Financial' },
  { icon: '💪', id: 'health_fitness', label: 'Health' },
  { icon: '📚', id: 'learning', label: 'Learning' },
  { icon: '🧬', id: 'longevity', label: 'Longevity' },
  { icon: '🧠', id: 'mental_health', label: 'Mental Health' },
  { icon: '🧘', id: 'mindfulness', label: 'Mindfulness' },
  { icon: '🌅', id: 'morning_routine', label: 'Morning' },
  { icon: '🎯', id: 'productivity', label: 'Productivity' },
  { icon: '🔄', id: 'recovery', label: 'Recovery' },
  { icon: '😴', id: 'sleep', label: 'Sleep' },
  { icon: '👥', id: 'social', label: 'Social' },
  { icon: '➖', id: 'subtraction', label: 'Subtraction' },
] as const;

const templateCategoryLiterals = TEMPLATE_CATEGORIES.map((category) =>
  v.literal(category.id)
);

export const templateCategoryValidator = v.union(...templateCategoryLiterals);
