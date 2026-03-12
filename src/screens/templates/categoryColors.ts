/**
 * Templates Screen - Category Color Mappings
 */

import { CATEGORY_COLORS_DARK } from './categoryColors.dark';
import { CATEGORY_COLORS } from './categoryColors.light';
import type { CategoryColorMap } from './categoryColors.types';
import type { CategoryColorTokens } from './templates.types';
import { darkColors } from '../../theme/darkColors';

export { CATEGORY_COLORS } from './categoryColors.light';
export { CATEGORY_COLORS_DARK } from './categoryColors.dark';

export const DEFAULT_CATEGORY_COLORS: CategoryColorTokens = {
  bg: '#F3F4F6',
  bgSelected: '#374151',
  border: '#E5E7EB',
  text: '#374151',
};

export const DEFAULT_CATEGORY_COLORS_DARK: CategoryColorTokens = {
  bg: darkColors.gray[100],
  bgSelected: darkColors.primary[500],
  border: darkColors.border,
  text: darkColors.text.secondary,
};

export function getCategoryColors(isDark: boolean): CategoryColorMap {
  return isDark ? CATEGORY_COLORS_DARK : CATEGORY_COLORS;
}

export function getDefaultCategoryColors(isDark: boolean): CategoryColorTokens {
  return isDark ? DEFAULT_CATEGORY_COLORS_DARK : DEFAULT_CATEGORY_COLORS;
}
