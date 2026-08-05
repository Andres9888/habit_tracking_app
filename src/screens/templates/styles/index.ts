/**
 * Templates Screen Styles
 *
 * Styles are organized by domain for maintainability.
 * The combined `styles` export maintains backward compatibility.
 */

export { browseStyles } from './browseStyles';
export { categoryStyles } from './categoryStyles';
export { controlStyles } from './controlStyles';
export { customizeStyles } from './customizeStyles';
export { formStyles } from './formStyles';
export { gridStyles } from './gridStyles';
export { layoutStyles } from './layoutStyles';
export { previewStyles } from './previewStyles';
export { scrollStyles } from './scrollStyles';
export { searchStyles } from './searchStyles';
export { skeletonStyles } from './skeletonStyles';
export { sortStyles } from './sortStyles';
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

// Combined styles export for backward compatibility
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
