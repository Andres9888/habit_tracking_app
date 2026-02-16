/**
 * Templates Screen Styles
 *
 * Styles are organized by domain for maintainability.
 * Use createTemplateStyles(themeColors) for dark mode support.
 */

import type { SemanticColors } from '../../../theme/darkColors';

export { browseStyles, createBrowseStyles } from './browseStyles';
export { categoryStyles } from './categoryStyles';
export { controlStyles, createControlStyles } from './controlStyles';
export { customizeStyles, createCustomizeStyles } from './customizeStyles';
export { formStyles, createFormStyles } from './formStyles';
export { gridStyles } from './gridStyles';
export { layoutStyles, createLayoutStyles } from './layoutStyles';
export { previewStyles, createPreviewStyles } from './previewStyles';
export { scrollStyles } from './scrollStyles';
export { searchStyles, createSearchStyles } from './searchStyles';
export { skeletonStyles, createSkeletonStyles } from './skeletonStyles';
export { sortStyles, createSortStyles } from './sortStyles';
export { tabStyles } from './tabStyles';

// Import for combined styles
import { browseStyles } from './browseStyles';
import { categoryStyles } from './categoryStyles';
import { controlStyles } from './controlStyles';
import { customizeStyles } from './customizeStyles';
import { formStyles } from './formStyles';
import { gridStyles } from './gridStyles';
import { layoutStyles } from './layoutStyles';
import { previewStyles } from './previewStyles';
import { scrollStyles } from './scrollStyles';
import { searchStyles } from './searchStyles';
import { skeletonStyles } from './skeletonStyles';
import { sortStyles } from './sortStyles';
import { tabStyles } from './tabStyles';

import { createBrowseStyles } from './browseStyles';
import { createControlStyles } from './controlStyles';
import { createCustomizeStyles } from './customizeStyles';
import { createFormStyles } from './formStyles';
import { createLayoutStyles } from './layoutStyles';
import { createPreviewStyles } from './previewStyles';
import { createSearchStyles } from './searchStyles';
import { createSkeletonStyles } from './skeletonStyles';
import { createSortStyles } from './sortStyles';

/** @deprecated Use createTemplateStyles(themeColors) for dark mode */
export const styles = {
  ...browseStyles,
  ...categoryStyles,
  ...controlStyles,
  ...customizeStyles,
  ...formStyles,
  ...gridStyles,
  ...layoutStyles,
  ...previewStyles,
  ...scrollStyles,
  ...searchStyles,
  ...skeletonStyles,
  ...sortStyles,
  ...tabStyles,
} as const;

/** Create theme-aware template styles */
export function createTemplateStyles(tc: SemanticColors) {
  return {
    ...createBrowseStyles(tc),
    ...categoryStyles,
    ...createControlStyles(tc),
    ...createCustomizeStyles(tc),
    ...createFormStyles(tc),
    ...gridStyles,
    ...createLayoutStyles(tc),
    ...createPreviewStyles(tc),
    ...scrollStyles,
    ...createSearchStyles(tc),
    ...createSkeletonStyles(tc),
    ...createSortStyles(tc),
    ...tabStyles,
  };
}
