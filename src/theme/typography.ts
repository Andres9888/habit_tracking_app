/**
 * Typography System - Habit Tracking App
 * Frontend Redesign Spec 2026-02-14
 *
 * Serif + Sans-serif pairing: Literata (display/H1) + DM Sans (all other text)
 * Monospace: JetBrains Mono
 *
 * Fallbacks: SF Pro Display / SF Pro Text (iOS), Roboto (Native Handset)
 */

import { TextStyle } from 'react-native';

/**
 * Font Families
 *
 * Primary display: Literata (serif, headings — emotional weight)
 * Primary text: DM Sans (sans-serif, body — clarity)
 * Monospace: JetBrains Mono (data, numbers)
 *
 * Fallbacks for platforms where custom fonts aren't loaded:
 * - iOS: SF Pro Display / SF Pro Text
 * - Native Handset: Roboto
 */
export const fontFamilies = {
  monospace: 'JetBrainsMono',
  primary: {
    display: 'Literata', // Serif — display/H1 headings
    text: 'DMSans', // Sans-serif — body, UI, H2/H3
  },
  serif: 'Literata', // Alias for display font
  system: '-apple-system', // Fallback to system font
} as const;

/**
 * Font Weights
 * DM Sans supports 400, 500, 600, 700
 * Literata supports 400, 500, 600, 700
 */
export const fontWeights = {
  bold: '700' as const,
  medium: '500' as const,
  regular: '400' as const,
  semibold: '600' as const,
};

/**
 * Type Scale (Design System: 34/22/17/13)
 * Display: 34, Title: 22, Body: 17, Caption: 13
 */
export const typography = {
  // Display Large (Onboarding headlines) — 34px Literata
  displayLarge: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.85,
    lineHeight: 41,
  },

  // Heading 1 (Screen titles) — 22px Literata
  heading1: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 22,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.35,
    lineHeight: 28,
  },

  // Heading 2 (Section titles) — 22px DM Sans
  heading2: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.35,
    lineHeight: 28,
  },

  // Heading 3 (Card titles, habit names) — 20px DM Sans
  heading3: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
    lineHeight: 26,
  },

  // Body (Primary text) — 17px
  body: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: 24,
  },

  // Body Small (Secondary info) — 14px
  bodySmall: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: 20,
  },

  // Body Bold (emphasized body text — habit names, rank numbers) — 17px bold
  bodyBold: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 24,
  },

  // Button Text — 17px semibold
  button: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.08,
    lineHeight: 24,
  },

  // Caption (Meta info, timestamps) — 13px
  caption: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.12,
    lineHeight: 18,
  },

  // Monospace (Numbers, percentages, data) — 16px
  monospace: {
    fontFamily: fontFamilies.monospace,
    fontSize: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: 24,
  },

  // Overline (Section headers, uppercase labels) — 12px
  overline: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: fontWeights.medium,
    letterSpacing: 1.5,
    lineHeight: 16,
    textTransform: 'uppercase',
  },

  // Tab Bar Labels — 10px
  tabBar: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 10,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.1,
    lineHeight: 12,
  },
} as const satisfies Record<string, TextStyle>;

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
