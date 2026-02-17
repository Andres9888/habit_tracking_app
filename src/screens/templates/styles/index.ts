/**
 * Templates Screen Styles — theme-aware
 *
 * All style modules now accept SemanticColors for dark mode support.
 * Use `useTemplatesStyles()` hook in components for automatic theme binding.
 */

import { useMemo } from 'react';
import { useThemeColors } from '@/theme/ThemeContext';
import type { SemanticColors } from '@/theme/darkColors';

// Style creators
export { createBrowseStyles } from './browseStyles';
export { createCategoryStyles } from './categoryStyles';
export { createControlStyles } from './controlStyles';
export { createCustomizeStyles } from './customizeStyles';
export { createFormStyles } from './formStyles';
export { gridStyles } from './gridStyles';
export { createLayoutStyles } from './layoutStyles';
export { createPreviewStyles } from './previewStyles';
export { createScrollStyles } from './scrollStyles';
export { createSearchStyles } from './searchStyles';
export { createSkeletonStyles } from './skeletonStyles';
export { createSortStyles } from './sortStyles';
export { tabStyles } from './tabStyles';

// Imports for combined styles
import { createBrowseStyles } from './browseStyles';
import { createCategoryStyles } from './categoryStyles';
import { createControlStyles } from './controlStyles';
import { createCustomizeStyles } from './customizeStyles';
import { createFormStyles } from './formStyles';
import { gridStyles } from './gridStyles';
import { createLayoutStyles } from './layoutStyles';
import { createPreviewStyles } from './previewStyles';
import { createScrollStyles } from './scrollStyles';
import { createSearchStyles } from './searchStyles';
import { createSkeletonStyles } from './skeletonStyles';
import { createSortStyles } from './sortStyles';
import { tabStyles } from './tabStyles';

/** Create all template styles with the given theme colors */
export function createAllStyles(c: SemanticColors) {
  return {
    ...createBrowseStyles(c),
    ...createCategoryStyles(c),
    ...createControlStyles(c),
    ...createCustomizeStyles(c),
    ...createFormStyles(c),
    ...gridStyles,
    ...createLayoutStyles(c),
    ...createPreviewStyles(c),
    ...createScrollStyles(c),
    ...createSearchStyles(c),
    ...createSkeletonStyles(c),
    ...createSortStyles(c),
    ...tabStyles,
  } as const;
}

/** Hook that returns all template styles bound to current theme */
export function useTemplatesStyles() {
  const { colors } = useThemeColors();
  return useMemo(() => createAllStyles(colors), [colors]);
}

// Use useTemplatesStyles() or createAllStyles(colors) in components
