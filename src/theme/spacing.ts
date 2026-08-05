/* eslint-disable max-lines -- design-token data file; inherently long like darkColors.ts */
/**
 * Spacing System - Habit Tracking App
 * Frontend Redesign Spec 2026-02-14
 *
 * 8px Grid System — all values are multiples of 4px
 */

import { airy } from './airyScale';

/**
 * Base Spacing Scale
 */
export const spacing = {
  '2xl': 48,
  '3xl': 64,
  base: 16,
  lg: 24,
  md: 12,
  sm: 8,
  xl: 32,
  xs: 4,
} as const;

/**
 * Screen Margins
 */
export const screenMargins = {
  horizontal: spacing.base,
  verticalBottom: spacing.base,
  verticalTop: spacing.sm,
} as const;

/**
 * Component Spacing
 */
export const componentSpacing = {
  avatar: {
    size: 40,
  },
  button: {
    height: 44,
    paddingHorizontal: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: spacing.base,
  },
  iconButton: {
    size: 40,
  },
  input: {
    height: 44,
    paddingHorizontal: spacing.base,
  },
  listItem: {
    height: 72,
    paddingHorizontal: spacing.base,
  },
  modal: {
    padding: spacing.lg,
  },
  tabBar: {
    height: 49,
  },
} as const;

/**
 * Border Radius
 * Consistent rounding — warm-minimal aesthetic
 */
export const borderRadius = {
  /** Pill shape (avatar, icon buttons, pills) */
  full: 9999,

  /** Cards, containers, inputs — 16px (airy: 24px) */
  large: airy.cardRadius,
  /** Alias: cards */
  card: airy.cardRadius,

  /** Buttons, tags, interactive elements — 12px (airy: 14px) */
  medium: airy.buttonRadius,
  /** Alias: buttons */
  button: airy.buttonRadius,

  /** Chips, badges, small elements — 8px (airy: 10px) */
  small: airy.chipRadius,
  /** Alias: chips */
  chip: airy.chipRadius,

  /** Modals, bottom sheets — 24px (airy: 28px) */
  xl: airy.modalRadius,

  /** Micro-rounding (progress bars, dots) — 4px */
  xs: 4,
} as const;

/**
 * Elevation / Shadows
 * Warm-toned shadows using text.primary (#2D2A26) for tonal consistency
 * Reduced opacity for subtle layered-plane depth
 */
export const shadows = {
  /** Level 4 – alerts, overlays */
  alert: {
    elevation: 12,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
  },

  /** Level 1 – cards at rest */
  card: {
    elevation: 3,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  /**
   * Level 1.5 – cards whose fill sits close to the canvas behind them.
   *
   * `card` assumes the surface already contrasts with its background. On the
   * warm-paper surfaces (settings, analytics) the fill is only a few steps off
   * the canvas, so at 0.06 the card dissolves into the page and the border ends
   * up doing all the work. This deeper, softer shadow is what makes same-family
   * surfaces read as objects.
   */
  cardLifted: {
    elevation: 4,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },

  /** Level 2 – FAB, pressed cards */
  floatingActionButton: {
    elevation: 6,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  /** Level 3 – modals, bottom sheets */
  modal: {
    elevation: 8,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },

  /** Level 0 – subtle elements (chips, badges) */
  subtle: {
    elevation: 1,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
} as const;

/**
 * Helper Types
 */
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;

export const getSpacing = (key: Spacing): number => spacing[key];

export const createSpacing = (vertical: number, horizontal: number) => ({
  marginHorizontal: horizontal,
  marginVertical: vertical,
});

export const createPadding = (vertical: number, horizontal: number) => ({
  paddingHorizontal: horizontal,
  paddingVertical: vertical,
});
