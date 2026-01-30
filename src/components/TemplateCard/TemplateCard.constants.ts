/**
 * TemplateCard Constants
 *
 * Label mappings and default configuration values
 */

/** Default fallback color when iconColor is missing or invalid */
export const DEFAULT_ICON_COLOR = '#78716c';

/** Success color for imported state */
export const SUCCESS_COLOR = '#22c55e';

/** Frequency display labels */
export const FREQUENCY_LABELS: Record<string, string> = {
  custom: 'Custom',
  daily: 'Daily',
  weekly: 'Weekly',
};

/** Category display names */
export const CATEGORY_LABELS: Record<string, string> = {
  andrew_huberman: 'Andrew Huberman',
  creativity: 'Creativity',
  financial: 'Financial',
  health_fitness: 'Health & Fitness',
  learning: 'Learning',
  mindfulness: 'Mindfulness',
  morning_routine: 'Morning Routine',
  productivity: 'Productivity',
  sleep: 'Sleep',
  social: 'Social',
};

/**
 * Format frequency string for display
 */
export const formatFrequency = (frequency?: string): string | undefined => {
  if (!frequency) return undefined;
  return (
    FREQUENCY_LABELS[frequency] ||
    frequency
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')
  );
};
