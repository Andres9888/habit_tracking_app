/**
 * CategoryChip Constants
 */

import type { CategoryColorConfig } from './CategoryChip.types';
import type { SemanticColors } from '../../theme/darkColors';

/** Convert hex color to rgba for valid color interpolation */
export const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== 'string' || hex.length < 7) {
    return `rgba(0,0,0,${alpha})`;
  }
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    return `rgba(0,0,0,${alpha})`;
  }
  return `rgba(${red},${green},${blue},${alpha})`;
};

/**
 * Get category-specific color configurations from theme
 *
 * Maps category names to semantic color tokens from the theme,
 * ensuring proper dark mode support.
 */
export const getCategoryColors = (
  colors: SemanticColors,
): Record<string, CategoryColorConfig> => ({
  all: colors.category.indigo,
  andrew_huberman: colors.category.green,
  creativity: colors.category.pink,
  financial: colors.category.green,
  health_fitness: colors.category.teal,
  learning: colors.category.purple,
  mindfulness: colors.category.purple,
  morning_routine: colors.category.amber,
  productivity: colors.category.cyan,
  sleep: {
    gradient: [colors.info.background, colors.info.primary],
    primary: colors.info.background,
  },
  social: colors.category.rose,
});
