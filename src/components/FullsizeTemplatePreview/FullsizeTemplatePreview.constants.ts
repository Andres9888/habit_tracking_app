/**
 * Constants for FullsizeTemplatePreview component
 */

/** Default fallback color when iconColor is missing or invalid */
export const DEFAULT_ICON_COLOR = '#78716c';

/** Mapping of frequency values to display labels */
export const FREQUENCY_LABELS: Record<string, string> = {
  custom: 'Custom',
  daily: 'Daily',
  weekly: 'Weekly',
};

/** Mapping of category values to display labels */
export const CATEGORY_LABELS: Record<string, string> = {
  andrew_huberman: 'Andrew Huberman',
  breathing: 'Breathing',
  creativity: 'Creativity',
  financial: 'Financial',
  health_fitness: 'Health & Fitness',
  learning: 'Learning',
  longevity: 'Longevity',
  mental_health: 'Mental Health',
  mindfulness: 'Mindfulness',
  morning_routine: 'Morning Routine',
  productivity: 'Productivity',
  recovery: 'Recovery',
  sleep: 'Sleep',
  social: 'Social',
};

/** Default duration estimates per category (in minutes) */
export const CATEGORY_DURATION_DEFAULTS: Record<string, string> = {
  andrew_huberman: '10-30 min',
  breathing: '3-5 min',
  creativity: '15-30 min',
  financial: '5-10 min',
  health_fitness: '15-45 min',
  learning: '15-30 min',
  longevity: '10-20 min',
  mental_health: '5-15 min',
  mindfulness: '5-15 min',
  morning_routine: '5-15 min',
  productivity: '5-15 min',
  recovery: '10-20 min',
  sleep: '5-10 min',
  social: '10-20 min',
};
