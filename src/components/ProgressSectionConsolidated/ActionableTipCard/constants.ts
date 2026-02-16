/**
 * Constants for ActionableTipCard
 */

import type { SemanticColors } from '../../../theme/darkColors';

/** Duration of entrance animation (ms) */
export const ENTRANCE_DURATION = 400;

/** Card styling constants for light mode */
const lightModeColors = {
  cardBackground: '#f5f3ff', // violet-50
  iconBackground: '#ede9fe', // violet-100
  textPrimary: '#4c1d95', // violet-900
  textSecondary: '#7c3aed', // violet-400
  chevron: '#a78bfa', // violet-400
  borderColor: '#e9d5ff', // violet-200
} as const;

/** Card styling constants for dark mode */
const darkModeColors = {
  cardBackground: '#312e81', // indigo-900 (slightly adjusted for better visibility)
  iconBackground: '#4f46e5', // indigo-600
  textPrimary: '#e0e7ff', // indigo-100
  textSecondary: '#c7d2fe', // indigo-200
  chevron: '#a5b4fc', // indigo-300
  borderColor: '#4f46e5', // indigo-600
} as const;

/**
 * Get theme-corrected colors based on the active theme.
 * Light mode uses violet, dark mode uses indigo for better visibility.
 */
export function getThemeCorrectedColors(colors: SemanticColors) {
  const isDark = colors.text.primary === '#F9FAFB';
  return isDark ? darkModeColors : lightModeColors;
}
