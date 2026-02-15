/**
 * Constants for FullsizeTemplatePreview component
 */

import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

/** Confetti colors - celebratory green variants matching success theme */
export const CONFETTI_COLORS = [
  '#86EFAC', // Light green
  '#34D399', // Primary 400
  '#22c55e', // Success green (matching button)
  '#10B981', // Primary 500
  '#059669', // Primary 600
  '#F59E0B', // Gold accent
] as const;

/** Default fallback color when iconColor is missing or invalid */
export const DEFAULT_ICON_COLOR = '#78716c';

import { t } from '../../i18n';

/** Mapping of frequency values to display labels (i18n-aware) */
export function getFrequencyLabels(): Record<string, string> {
  return {
    custom: t('frequency.custom'),
    daily: t('frequency.daily'),
    weekly: t('frequency.weekly'),
  };
}

/** @deprecated Use getFrequencyLabels() for i18n. Kept for backward compat. */
export const FREQUENCY_LABELS: Record<string, string> = {
  custom: 'Custom',
  daily: 'Daily',
  weekly: 'Weekly',
};

/** Mapping of category values to display labels (i18n-aware) */
export function getCategoryLabels(): Record<string, string> {
  return {
    andrew_huberman: 'Andrew Huberman',
    creativity: t('categories.creativity'),
    financial: t('categories.financial'),
    health_fitness: 'Health & Fitness',
    learning: t('categories.learning'),
    mindfulness: t('categories.mindfulness'),
    morning_routine: 'Morning Routine',
    productivity: t('categories.productivity'),
    sleep: t('categories.sleep'),
    social: t('categories.social'),
  };
}

/** @deprecated Use getCategoryLabels() for i18n. Kept for backward compat. */
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
