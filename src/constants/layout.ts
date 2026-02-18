/**
 * Layout Constants
 *
 * Consolidated gap, padding, and spacing patterns for layouts.
 * These are commonly used patterns that should be centralized.
 */

import { spacing, borderRadius } from '../theme/spacing';

// ============================================================================
// GAP VALUES (spacing between elements)
// ============================================================================

export const GAP = {
  /** Extra small gap */
  extraSmall: 4,

  /** Small gap */
  small: 8,

  /** Medium gap (default) */
  medium: 12,

  /** Large gap */
  large: 16,

  /** Extra large gap */
  extraLarge: 24,

  /** Section gap */
  section: 32,
} as const;

// ============================================================================
// CARD LAYOUT PATTERNS
// ============================================================================

export const CARD_LAYOUT = {
  padding: spacing.base,
  marginHorizontal: spacing.base,
  marginVertical: spacing.sm,
  borderRadius: borderRadius.card,
} as const;

// ============================================================================
// MODAL LAYOUT PATTERNS
// ============================================================================

export const MODAL_LAYOUT = {
  padding: spacing.lg,
  borderRadius: borderRadius.xl,
} as const;

// ============================================================================
// INPUT LAYOUT PATTERNS
// ============================================================================

export const INPUT_LAYOUT = {
  paddingHorizontal: spacing.base,
  paddingVertical: spacing.md,
  height: 44,
  borderRadius: borderRadius.medium,
} as const;

// ============================================================================
// BUTTON LAYOUT PATTERNS
// ============================================================================

export const BUTTON_LAYOUT = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  height: 44,
  borderRadius: borderRadius.medium,
} as const;

// ============================================================================
// LIST ITEM PATTERNS
// ============================================================================

export const LIST_ITEM = {
  paddingHorizontal: spacing.base,
  paddingVertical: spacing.sm,
  minHeight: 72,
} as const;

// ============================================================================
// SCREEN LAYOUT PATTERNS
// ============================================================================

export const SCREEN_LAYOUT = {
  horizontalPadding: spacing.base,
  topPadding: spacing.sm,
  bottomPadding: spacing.base,
} as const;

// ============================================================================
// HERO/EMPTY STATE PATTERNS
// ============================================================================

export const HERO_LAYOUT = {
  iconSize: 48,
  paddingVertical: spacing.xl,
  gap: spacing.lg,
} as const;

// ============================================================================
// CHIP/TAG PATTERNS
// ============================================================================

export const CHIP_LAYOUT = {
  height: 36,
  paddingHorizontal: spacing.md,
  borderRadius: borderRadius.full,
  gap: spacing.xs,
} as const;

// ============================================================================
// BOTTOM SHEET PATTERNS
// ============================================================================

export const SHEET_LAYOUT = {
  handleWidth: 40,
  handleHeight: 4,
  handleBorderRadius: 2,
  paddingHorizontal: spacing.base,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
} as const;

// ============================================================================
// EXPORT DEFAULT OBJECT
// ============================================================================

/**
 * Combined layout constants for easy import
 */
export const LAYOUT = {
  GAP,
  CARD_LAYOUT,
  MODAL_LAYOUT,
  INPUT_LAYOUT,
  BUTTON_LAYOUT,
  LIST_ITEM,
  SCREEN_LAYOUT,
  HERO_LAYOUT,
  CHIP_LAYOUT,
  SHEET_LAYOUT,
} as const;

export default LAYOUT;
