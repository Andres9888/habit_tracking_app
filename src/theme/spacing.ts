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
  xs: 4,     // Tight spacing, icon padding
  xxs: 4,    // Alias for xs
  sm: 8,     // Compact spacing within components
  md: 12,    // Component internal spacing
  base: 16,  // Standard spacing (most common)
  lg: 24,    // Section spacing
  xl: 32,    // Screen margins, major sections
  xxl: 48,   // Large vertical spacing (alias for 2xl)
  '2xl': 48, // Large vertical spacing
  '3xl': 64, // Page sections
} as const;

/**
 * Screen Margins
 * Consistent padding for all screens
 */
export const screenMargins = {
  horizontal: spacing.base, // 16pt on iPhone
  verticalTop: spacing.sm,  // 8pt top (avoiding safe areas)
  verticalBottom: spacing.base, // 16pt bottom
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
  card: {
    padding: spacing.base,           // 16pt all sides
    marginVertical: spacing.sm,      // 8pt vertical
    marginHorizontal: spacing.base,  // 16pt horizontal
  },
  listItem: {
    height: 72,                      // Minimum height for thumb tap
    paddingHorizontal: spacing.base, // 16pt sides
  },
  button: {
    height: 44,                      // Apple HIG minimum tap target
    paddingHorizontal: spacing.lg,   // 24pt sides for text padding
  },
  input: {
    height: 44,                      // Consistent with buttons
    paddingHorizontal: spacing.base, // 16pt sides
  },
  modal: {
    padding: spacing.lg,             // 24pt all sides
  },
  tabBar: {
    height: 49,                      // iOS standard + safe area bottom
  },
} as const;

/**
 * Border Radius
 * Consistent rounding for all components
 */
export const borderRadius = {
  small: 8,     // Buttons, tags
  medium: 12,   // Cards, inputs
  large: 16,    // Modals, sheets
  xl: 20,       // Full screen modals (top corners only)
  full: 9999,   // Circular (avatar, icon buttons) - use 50% in percentage
} as const;

/**
 * Elevation / Shadows (iOS-style, subtle)
 * React Native shadow properties
 */
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2, // Android fallback
  },
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4, // Android fallback
  },
  floatingActionButton: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6, // Android fallback
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
export const createSpacing = (
  vertical: number,
  horizontal: number
) => ({
  marginVertical: vertical,
  marginHorizontal: horizontal,
});

/**
 * Helper function to create padding shorthand
 */
export const createPadding = (
  vertical: number,
  horizontal: number
) => ({
  paddingVertical: vertical,
  paddingHorizontal: horizontal,
});
