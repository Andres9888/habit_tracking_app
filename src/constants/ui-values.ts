/**
 * UI Values Constants
 *
 * Centralized magic numbers and values for styling and animations.
 * This includes opacity values, scale factors, shadow opacities, and other UI-related constants.
 *
 * Animation durations reference @/theme/animations as the canonical source.
 */

import { durations } from '@/theme/animations';

// ============================================================================
// OPACITY VALUES (Used in style, shadow, and animation contexts)
// ============================================================================

export const OPACITY = {
  /** Transparent */
  transparent: 0,

  /** Very subtle, for disabled or muted elements */
  subtle: 0.2,

  /** Subdued, for secondary elements */
  subdued: 0.3,

  /** Moderate transparency for overlays and backgrounds */
  moderate: 0.4,

  /** Medium opacity for interactive states */
  medium: 0.5,

  /** Higher opacity for visible elements */
  high: 0.7,

  /** Strong opacity for important elements */
  strong: 0.8,

  /** Very strong opacity, almost opaque */
  veryStrong: 0.9,

  /** Fully opaque */
  full: 1,
} as const;

// ============================================================================
// SHADOW OPACITIES
// ============================================================================

export const SHADOW_OPACITY = {
  /** Minimal shadow (subtle elevation) */
  minimal: 0.08,

  /** Light shadow (card hover, light elevation) */
  light: 0.15,

  /** Medium shadow (UI elements) */
  medium: 0.25,

  /** Strong shadow (prominent elevation) */
  strong: 0.32,
} as const;

// ============================================================================
// SCALE VALUES (For press states, ripples, and animations)
// ============================================================================

export const SCALE = {
  /** Minimum scale for animations */
  minimum: 0.4,

  /** Very small scale for effects */
  extraSmall: 0.6,

  /** Small scale reduction for press/hover states */
  small: 0.9,

  /** Small reduction for press states */
  pressSmall: 0.94,

  /** Medium scale reduction for press states */
  pressMedium: 0.95,

  /** Slight reduction for press states */
  pressLarge: 0.97,

  /** Nearly normal scale for subtle press effects */
  nearNormal: 0.98,

  /** Normal scale (baseline) */
  normal: 1,

  /** Small expansion scale */
  expand: 1.02,

  /** Medium expansion scale */
  expandMedium: 1.5,

  /** Large expansion scale (ripple effects) */
  large: 1.8,

  /** Very large scale for animations */
  extraLarge: 2,
} as const;

// ============================================================================
// ANIMATION DURATIONS (ms)
// ============================================================================

export const ANIMATION_DURATION = {
  /** Instant/immediate (no delay) */
  instant: 0,

  /** Very short, for micro-interactions */
  veryShort: 50,

  /** Extra short, for quick feedback */
  extraShort: 80,

  /** Short duration for quick transitions — maps to durations.instant */
  short: durations.instant,

  /** Brief duration for alerts and messages — maps to durations.quick */
  brief: durations.quick,

  /** Default duration for most animations — maps to durations.standard */
  default: durations.standard,

  /** Standard duration for UI transitions */
  standard: 250,

  /** Medium duration for screen transitions — maps to durations.enter */
  medium: durations.enter,

  /** Slightly longer for emphasized animations — maps to durations.moderate */
  emphasized: durations.moderate,

  /** Long duration for complex animations */
  long: 320,

  /** Extra long for prominent animations — maps to durations.emphasis */
  extraLong: durations.emphasis,

  /** Very long for slow animations */
  veryLong: 420,

  /** Extended duration for multi-step animations */
  extended: 500,

  /** Long duration for background animations — maps to durations.complex */
  background: durations.complex,

  /** Very extended duration */
  veryExtended: 720,

  /** Sustained animation duration — maps to durations.progress */
  sustained: durations.progress,

  /** Extended sustained duration */
  extendedSustained: 960,

  /** Very long duration for slow effect animations */
  slowEffect: 1200,

  /** Long delay for initial animations — maps to durations.breathing */
  longDelay: durations.breathing,

  /** Extra long delay for celebration animations */
  celebrationDelay: 1800,

  /** Very long duration for hero animations — maps to durations.celebration */
  heroAnimation: durations.celebration,
} as const;

// ============================================================================
// ANIMATION DELAYS AND STAGGER (ms)
// ============================================================================

export const ANIMATION_DELAY = {
  /** No delay */
  none: 0,

  /** Very minimal delay */
  minimal: 50,

  /** Small delay for entrance animations */
  small: 100,

  /** Standard delay between staggered items */
  standard: 200,

  /** Longer delay before main content */
  content: 170,

  /** Delay for secondary animations */
  secondary: 280,
} as const;

// ============================================================================
// TRANSLATE/POSITION VALUES (px)
// ============================================================================

export const TRANSLATE = {
  /** Small initial offset for entrance animations */
  small: 20,

  /** Medium initial offset */
  medium: 50,

  /** Large upward translation for icon animations */
  large: 150,
} as const;

// ============================================================================
// GESTURE THRESHOLDS
// ============================================================================

export const GESTURE = {
  /** Quick tap detection threshold */
  tapDuration: 50,

  /** Bottom sheet dismiss threshold (pixels) */
  dismissThreshold: 100,

  /** Velocity threshold for swipe gestures (px/s) */
  velocityThreshold: 800,
} as const;

// ============================================================================
// SCREEN DIMENSIONS & POSITIONS
// ============================================================================

export const SCREEN = {
  /** Maximum height for bottom sheets (85% of screen height) */
  maxHeightPercent: 0.85,
} as const;

// ============================================================================
// LETTER SPACING
// ============================================================================

export const LETTER_SPACING = {
  /** Tight letter spacing for headings */
  tight: -0.76,

  /** Default letter spacing for labels */
  label: 2,
} as const;

// ============================================================================
// RIPPLE & PRESS EFFECT CONFIGURATION
// ============================================================================

export const RIPPLE_EFFECT = {
  /** Initial ripple opacity on press */
  initialOpacity: 0.26,

  /** Initial ripple scale on press */
  initialScale: 0.6,

  /** Final ripple scale when expanded */
  finalScale: 1.8,

  /** Duration for ripple scale animation */
  scaleDuration: 320,

  /** Duration for ripple opacity animation */
  opacityDuration: 320,
} as const;

// ============================================================================
// SHARED ANIMATION VALUES
// ============================================================================

export const ANIMATION_VALUES = {
  /** Standard spring damping for animations */
  springDamping: 18,

  /** Standard spring stiffness for animations (design system standard) */
  springStiffness: 150,

  /** Default timing for interactive press animations */
  pressAnimationDuration: 50,

  /** Stagger duration for list item entrance animations (matches durations.stagger) */
  staggerDuration: 60,
} as const;
