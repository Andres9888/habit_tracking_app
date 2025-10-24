/**
 * Typography System - Habit Tracking App
 * Based on UX Specification Section 5.2
 *
 * Uses SF Pro (iOS native font)
 * All sizes in points (pt) for iOS consistency
 * Supports iOS Dynamic Type (accessibility)
 */

import { TextStyle } from 'react-native';

/**
 * Font Families
 *
 * Primary: SF Pro (iOS native)
 * - SF Pro Display (headings, large text)
 * - SF Pro Text (body copy, UI elements)
 *
 * Fallback: System Font Stack
 * - iOS: SF Pro
 * - Android (future): Roboto
 *
 * Monospace (data, numbers): SF Mono
 */
export const fontFamilies = {
  primary: {
    display: 'SF Pro Display', // iOS native
    text: 'SF Pro Text',       // iOS native
  },
  monospace: 'SF Mono',
  system: '-apple-system', // Fallback to system font
} as const;

/**
 * Font Weights
 * Using iOS standard weight names and numeric values
 */
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Type Scale
 * All measurements in points (pt) for iOS
 */
export const typography: Record<string, TextStyle> = {
  // Display Large (Onboarding headlines)
  displayLarge: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 34,
    fontWeight: fontWeights.bold,
    lineHeight: 41,
    letterSpacing: 0.37,
  },

  // Heading 1 (Screen titles)
  heading1: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 28,
    fontWeight: fontWeights.bold,
    lineHeight: 34,
    letterSpacing: 0.36,
  },

  // Heading 2 (Section titles)
  heading2: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 22,
    fontWeight: fontWeights.semibold,
    lineHeight: 28,
    letterSpacing: 0.35,
  },

  // Heading 3 (Card titles, habit names)
  heading3: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
    letterSpacing: -0.41,
  },

  // Body (Primary text)
  body: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
    letterSpacing: -0.41,
  },

  // Body Small (Secondary info)
  bodySmall: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
    letterSpacing: -0.24,
  },

  // Caption (Meta info, timestamps)
  caption: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
    letterSpacing: -0.08,
  },

  // Button Text
  button: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
    letterSpacing: -0.41,
  },

  // Tab Bar Labels
  tabBar: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 10,
    fontWeight: fontWeights.medium,
    lineHeight: 12,
    letterSpacing: 0.12,
  },

  // Monospace (Numbers, percentages, data)
  monospace: {
    fontFamily: fontFamilies.monospace,
    fontSize: 17,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
    letterSpacing: 0,
  },
} as const;

/**
 * Dynamic Type Support
 *
 * iOS Dynamic Type scales text based on user accessibility settings
 * Sizes: XS, S, M (default), L, XL, XXL, XXXL (7 sizes above default)
 *
 * Implementation notes:
 * - Use scaledValue() helper for spacing that should grow with text
 * - Set maximum line height to prevent excessive spacing
 * - Test all screens at XXXL size
 * - Images/icons don't scale (maintain visual hierarchy)
 *
 * React Native Paper's Text component automatically supports Dynamic Type
 * when using the theme's typography scale
 */

export type TypographyVariant = keyof typeof typography;

/**
 * Helper function to create text styles with color
 * Usage: textStyle('heading1', colors.gray[700])
 */
export const textStyle = (
  variant: TypographyVariant,
  color?: string
): TextStyle => ({
  ...typography[variant],
  ...(color && { color }),
});
