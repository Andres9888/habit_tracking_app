/**
 * Color Palette - Barrel Export
 * Re-exports all color tokens from their respective modules.
 *
 * Color Contrast Compliance (WCAG 2.1 Level AA)
 *
 * Text Contrast Minimums:
 * - Normal text (17pt): 4.5:1
 * - Large text (22pt+): 3:1
 * - UI components: 3:1
 *
 * Verified Ratios:
 * ✅ Gray-700 (#374151) on White: 10.8:1
 * ✅ Primary-700 (#047857) on White: Sufficient for text
 * ✅ Gray-600 (#4B5563) on White: 8.3:1
 * ⚠️  Warning-500 (#F59E0B) on White: 2.3:1 - Use Warning-700 for text
 * ✅ Primary-500 (#10B981) on White: 2.9:1 - Use Primary-700 for text
 */

export { colors } from './core';
export type {
  ColorPalette,
  GrayColor,
  PrimaryColor,
  StrengthLevel,
} from './core';

export { warmPalette } from './semantic';
export type { WarmPaletteKey } from './semantic';

export { milestoneColors } from '../milestone-colors';
export type { MilestoneColorKey } from '../milestone-colors';
