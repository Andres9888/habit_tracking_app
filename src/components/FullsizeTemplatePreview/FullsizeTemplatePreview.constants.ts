/**
 * Constants for FullsizeTemplatePreview component
 */

import { Dimensions } from 'react-native';
import { SemanticColors } from '../../theme/darkColors';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

/**
 * Confetti colors - celebratory green variants matching success theme
 *
 * Returns theme-aware confetti colors for celebration animations.
 */
export const getConfettiColors = (colors: SemanticColors) =>
  [
    colors.success.light, // Light green
    colors.primary[400], // Primary 400
    colors.success.primary, // Success green (matching button)
    colors.primary[500], // Primary 500
    colors.primary[600], // Primary 600
    colors.warning.primary, // Gold accent
  ] as const;

/**
 * Default fallback color when iconColor is missing or invalid
 *
 * Uses gray-500 from theme for proper dark mode support.
 */
export const getDefaultIconColor = (colors: SemanticColors) =>
  colors.gray[500];

/** Mapping of frequency values to display labels */
export const FREQUENCY_LABELS: Record<string, string> = {
  custom: 'Custom',
  daily: 'Daily',
  weekly: 'Weekly',
};

/** Mapping of category values to display labels */
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
