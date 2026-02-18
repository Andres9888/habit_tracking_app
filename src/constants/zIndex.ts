/**
 * Z-Index Constants
 *
 * Consolidated z-index values used throughout the app.
 * Using a consistent scale prevents layering conflicts.
 *
 * Scale:
 * - Base: 0-10 (content, cards)
 * - Overlay: 10-100 (modals, dropdowns)
 * - Modal: 100-1000 (dialogs, sheets)
 * - Critical: 1000+ (toasts, debug overlays)
 */

// ============================================================================
// BASE LAYERS
// ============================================================================

export const BASE = {
  /** Default content layer */
  content: 0,

  /** Elevated content (cards above base) */
  elevated: 1,

  /** Floating elements above elevated */
  floating: 2,
} as const;

// ============================================================================
// OVERLAYS
// ============================================================================

export const OVERLAY = {
  /** Background overlays */
  background: 5,

  /** Dropdowns, selects */
  dropdown: 10,

  /** Sticky headers */
  sticky: 10,

  /** Tooltips */
  tooltip: 20,

  /** Inline success/error indicators */
  inline: 10,
} as const;

// ============================================================================
// MODAL LAYERS
// ============================================================================

export const MODAL = {
  /** Bottom sheets */
  sheet: 100,

  /** Sheet handle/knob */
  sheetHandle: 101,

  /** Modal containers */
  modal: 100,

  /** Modal content */
  modalContent: 110,

  /** Dialogs */
  dialog: 150,

  /** Popovers */
  popover: 200,
} as const;

// ============================================================================
// CRITICAL LAYERS
// ============================================================================

export const CRITICAL = {
  /** Toast notifications */
  toast: 1000,

  /** Delete/undo toasts */
  deleteToast: 1000,

  /** Loading overlays */
  loading: 1000,

  /** Performance dashboard */
  performance: 9999,

  /** Debug overlays */
  debug: 9999,
} as const;

// ============================================================================
// ANIMATION LAYERS
// ============================================================================

export const ANIMATION = {
  /** Animated elements that should stay below overlays */
  animated: 5,

  /** Success icons/animations */
  success: 10,

  /** Celebration confetti */
  celebration: 50,
} as const;

// ============================================================================
// EXPORT DEFAULT OBJECT
// ============================================================================

/**
 * Combined z-index constants for easy import
 */
export const Z_INDEX = {
  ...BASE,
  ...OVERLAY,
  ...MODAL,
  ...CRITICAL,
  ...ANIMATION,
} as const;

export default Z_INDEX;
