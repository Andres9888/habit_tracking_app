/**
 * Spacing System - Habit Tracking App
 * Based on UX Specification Section 5.3
 *
 * 8pt Grid System
 * All spacing uses multiples of 4pt (we use 8pt base for consistency)
 * Measurements in points (pt) for iOS
 */

/**
 * Base Spacing Scale
 * All values are multiples of 4pt
 */
export const spacing = {
  // Large vertical spacing (alias for 2xl)
  '2xl': 48,

  // Large vertical spacing
  '3xl': 64,

  // Component internal spacing
  base: 16,

  // Standard spacing (most common)
  lg: 24,

  // Compact spacing within components
  md: 12,

  // Alias for xs
  sm: 8,

  // Section spacing
  xl: 32,

  xs: 4,
} as const;

/**
 * Screen Margins
 * Consistent padding for all screens
 */
export const screenMargins = {
  horizontal: spacing.base,
  // 8pt top (avoiding safe areas)
  verticalBottom: spacing.base,
  // 16pt on iPhone
  verticalTop: spacing.sm, // 16pt bottom
} as const;

/**
 * Safe Area Insets (iOS)
 * Dynamic values handled by react-native-safe-area-context
 *
 * Typical values:
 * - Top: Dynamic (notch on iPhone X+, status bar height)
 * - Bottom: 34pt (home indicator on iPhone X+) or 0pt (older devices)
 * - Sides: 0pt (most devices)
 *
 * Use SafeAreaView or useSafeAreaInsets() hook from
 * react-native-safe-area-context instead of hardcoding
 */

/**
 * Component Spacing
 * Predefined spacing for common components
 */
export const componentSpacing = {
  button: {
    height: 44, // Apple HIG minimum tap target
    paddingHorizontal: spacing.lg, // 24pt sides for text padding
  },
  card: {
    // 8pt vertical
    marginHorizontal: spacing.base,

    // 16pt all sides
    marginVertical: spacing.sm,
    padding: spacing.base, // 16pt horizontal
  },
  input: {
    height: 44, // Consistent with buttons
    paddingHorizontal: spacing.base, // 16pt sides
  },
  listItem: {
    height: 72, // Minimum height for thumb tap
    paddingHorizontal: spacing.base, // 16pt sides
  },
  modal: {
    padding: spacing.lg, // 24pt all sides
  },
  tabBar: {
    height: 49, // iOS standard + safe area bottom
  },
} as const;

/**
 * Border Radius
 * Consistent rounding for all components
 */
export const borderRadius = {
  /** Pill shape (avatar, icon buttons, pills) */
  full: 9999,

  /** Cards, containers, inputs — 16px */
  large: 16,
  /** Alias: cards */
  card: 16,

  /** Buttons, tags, interactive elements — 12px */
  medium: 12,
  /** Alias: buttons */
  button: 12,

  /** Chips, badges, small elements — 8px */
  small: 8,
  /** Alias: chips */
  chip: 8,

  /** Modals, bottom sheets — 24px */
  xl: 24,

  /** Micro-rounding (progress bars, dots) — 4px */
  xs: 4,
} as const;

/**
 * Elevation / Shadows (iOS-style, subtle)
 * React Native shadow properties
 */
export const shadows = {
  /** Level 0 – subtle elements (chips, badges) */
  subtle: {
    elevation: 1,
    shadowColor: '#1c1917',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  /** Level 1 – cards */
  card: {
    elevation: 3,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  /** Level 2 – raised cards, FAB */
  floatingActionButton: {
    elevation: 6,
    shadowColor: '#1c1917',
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
  },
  /** Level 3 – modals, bottom sheets */
  modal: {
    elevation: 8,
    shadowColor: '#1c1917',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  /** Level 4 – alerts, overlays (highest elevation) */
  alert: {
    elevation: 12,
    shadowColor: '#1c1917',
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
} as const;

/**
 * Helper Types
 */
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;

/**
 * Helper function to get spacing value
 * Usage: getSpacing('lg') returns 24
 */
export const getSpacing = (key: Spacing): number => spacing[key];

/**
 * Helper function to create margin/padding shorthand
 * Usage: createSpacing(16, 8) returns { marginVertical: 16, marginHorizontal: 8 }
 */
export const createSpacing = (vertical: number, horizontal: number) => ({
  marginHorizontal: horizontal,
  marginVertical: vertical,
});

/**
 * Helper function to create padding shorthand
 */
export const createPadding = (vertical: number, horizontal: number) => ({
  paddingHorizontal: horizontal,
  paddingVertical: vertical,
});
