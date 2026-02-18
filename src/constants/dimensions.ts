/**
 * Dimensions Constants
 *
 * Consolidated height, width, and size values used throughout the app.
 * These are commonly scattered values that should be centralized for consistency.
 */

// ============================================================================
// BUTTON DIMENSIONS
// ============================================================================

export const BUTTON = {
  /** Standard button height */
  height: 44,

  /** CTA/Large button height */
  heightLarge: 56,

  /** Small button height */
  heightSmall: 36,

  /** Icon button size */
  iconSize: 44,

  /** FAB (Floating Action Button) size */
  fabSize: 56,
} as const;

// ============================================================================
// INPUT DIMENSIONS
// ============================================================================

export const INPUT = {
  /** Standard input height */
  height: 44,

  /** Large input height (e.g., habit input) */
  heightLarge: 52,

  /** Text input minimum height */
  minHeight: 44,
} as const;

// ============================================================================
// CARD DIMENSIONS
// ============================================================================

export const CARD = {
  /** Standard card min height */
  minHeight: 72,

  /** Card padding */
  padding: 16,

  /** List item height */
  listItemHeight: 72,
} as const;

// ============================================================================
// ICON DIMENSIONS
// ============================================================================

export const ICON = {
  /** Extra small icon (inline indicators) */
  extraSmall: 10,

  /** Small icon (chevrons, metadata) */
  small: 16,

  /** Medium icon (standard actions) */
  medium: 20,

  /** Large icon (primary actions) */
  large: 24,

  /** Extra large icon (feature icons) */
  extraLarge: 32,

  /** Hero icon (empty states) */
  hero: 48,

  /** Clear button/icon in inputs */
  inputAction: 20,

  /** Divider/separator line */
  divider: 2,

  /** Grip handle */
  gripHandle: 3,
} as const;

// ============================================================================
// TOUCH TARGETS (per accessibility guidelines - min 44pt)
// ============================================================================

export const TOUCH_TARGET = {
  /** Minimum touch target */
  minimum: 44,

  /** Standard touch target */
  standard: 44,

  /** Large touch target */
  large: 56,
} as const;

// ============================================================================
// BADGE DIMENSIONS
// ============================================================================

export const BADGE = {
  /** Small badge size */
  small: 20,

  /** Medium badge size */
  medium: 24,

  /** Large badge size */
  large: 32,

  /** Badge icon size */
  icon: 12,
} as const;

// ============================================================================
// ACTION BAR DIMENSIONS
// ============================================================================

export const ACTION_BAR = {
  /** Small action button */
  buttonSmall: 32,

  /** Large action button */
  buttonLarge: 48,

  /** Icon-only button */
  iconOnly: 32,
} as const;

// ============================================================================
// PROGRESS INDICATORS
// ============================================================================

export const PROGRESS = {
  /** Progress bar height */
  barHeight: 4,

  /** Progress ring size */
  ringSize: 48,

  /** Ring stroke width */
  ringStroke: 4,
} as const;

// ============================================================================
// AVATAR DIMENSIONS
// ============================================================================

export const AVATAR = {
  /** Small avatar */
  small: 32,

  /** Medium avatar */
  medium: 40,

  /** Large avatar */
  large: 56,

  /** Extra large avatar */
  extraLarge: 80,
} as const;

// ============================================================================
// PARTICLE/CONFETTI SIZES
// ============================================================================

export const PARTICLE = {
  /** Small particle */
  small: 4,

  /** Medium particle */
  medium: 8,

  /** Large particle */
  large: 12,
} as const;
