/**
 * Typography Constants
 * Based on UX Expert typography weight adjustments
 *
 * Provides consistent font weights, sizes, and tracking across the app
 */

export type FontWeight = '400' | '500' | '600' | '700' | '800';

/**
 * Typography Weight Scale
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 800 (Extra Bold)  →  🔥 Streak Numbers (KEY METRIC)
 * 700 (Bold)        →  Headlines, Habit Names, CTAs, Labels
 * 600 (Semi-Bold)   →  Sub-headings (minimal usage)
 * 500 (Medium)      →  Captions, Helper Text
 * 400 (Normal)      →  Body text, descriptions
 */

export const FONT_WEIGHTS = {
  // Numbers & Key Metrics (maximize scannability)
  numbers: {
    fontWeight: '800' as FontWeight,
    letterSpacing: -0.5,
  },

  // Headlines (authority & impact)
  h1: {
    fontWeight: '700' as FontWeight,
    letterSpacing: -1,
  },

  h2: {
    fontWeight: '700' as FontWeight,
    letterSpacing: -0.5,
  },

  h3: {
    fontWeight: '700' as FontWeight,
    letterSpacing: -0.2,
  },

  // CTAs (confidence)
  cta: {
    fontWeight: '700' as FontWeight,
    letterSpacing: 0.5,
  },

  // Uppercase Labels (luxury)
  label: {
    fontWeight: '700' as FontWeight,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
  },

  // Subheadings (structure)
  subheading: {
    fontWeight: '600' as FontWeight,
    letterSpacing: -0.1,
  },

  // Body (readability)
  body: {
    fontWeight: '400' as FontWeight,
    letterSpacing: 0,
  },

  // Captions (subtle)
  caption: {
    fontWeight: '500' as FontWeight,
    letterSpacing: 0.1,
  },

  // Data/Dashboard (precision)
  data: {
    fontWeight: '700' as FontWeight,
    letterSpacing: 0,
    fontVariantNumeric: 'tabular-nums' as const,
  },
} as const;

/**
 * Typography Sizes
 * Based on implemented home page improvements
 */
export const FONT_SIZES = {
  // Display
  display: 32,

  // Headlines
  h1: 26,
  h2: 20,
  h3: 16,

  // Body
  body: {
    large: 16,
    medium: 15,
    small: 14,
  },

  // UI Elements
  button: {
    primary: 15,
    secondary: 14,
  },

  // Labels & Captions
  label: 11,
  caption: 13,

  // Data/Numbers
  data: {
    large: 18,
    medium: 15,
    small: 13,
  },

  // Streak Badge
  streak: 13,
} as const;

/**
 * Line Heights
 * Optimal vertical rhythm
 */
export const LINE_HEIGHTS = {
  display: 38,
  h1: 32,
  h2: 26,
  h3: 22,
  body: {
    large: 24,
    medium: 22,
    small: 20,
  },
  caption: 18,
  tight: 16,
} as const;

/**
 * Typography Presets
 * Ready-to-use combinations for common patterns
 */
export const TYPOGRAPHY_PRESETS = {
  // Hero Section
  heroTitle: {
    fontSize: FONT_SIZES.h1,
    ...FONT_WEIGHTS.h1,
    lineHeight: LINE_HEIGHTS.h1,
  },

  // Habit Names
  habitName: {
    fontSize: FONT_SIZES.h3,
    ...FONT_WEIGHTS.h3,
    lineHeight: LINE_HEIGHTS.h3,
  },

  // Streak Numbers
  streakNumber: {
    fontSize: FONT_SIZES.streak,
    ...FONT_WEIGHTS.numbers,
    lineHeight: LINE_HEIGHTS.tight,
  },

  // CTA Buttons
  ctaPrimary: {
    fontSize: FONT_SIZES.button.primary,
    ...FONT_WEIGHTS.cta,
    lineHeight: LINE_HEIGHTS.body.medium,
  },

  ctaSecondary: {
    fontSize: FONT_SIZES.button.secondary,
    ...FONT_WEIGHTS.cta,
    lineHeight: LINE_HEIGHTS.body.small,
  },

  // Uppercase Labels
  labelSmall: {
    fontSize: FONT_SIZES.label,
    ...FONT_WEIGHTS.label,
  },

  // Body Text
  body: {
    fontSize: FONT_SIZES.body.medium,
    ...FONT_WEIGHTS.body,
    lineHeight: LINE_HEIGHTS.body.medium,
  },

  bodyLarge: {
    fontSize: FONT_SIZES.body.large,
    ...FONT_WEIGHTS.body,
    lineHeight: LINE_HEIGHTS.body.large,
  },

  bodySmall: {
    fontSize: FONT_SIZES.body.small,
    ...FONT_WEIGHTS.body,
    lineHeight: LINE_HEIGHTS.body.small,
  },

  // Data/Dashboard Numbers
  dataLarge: {
    fontSize: FONT_SIZES.data.large,
    ...FONT_WEIGHTS.data,
  },

  dataMedium: {
    fontSize: FONT_SIZES.data.medium,
    ...FONT_WEIGHTS.data,
  },

  dataSmall: {
    fontSize: FONT_SIZES.data.small,
    ...FONT_WEIGHTS.data,
  },

  // Captions
  caption: {
    fontSize: FONT_SIZES.caption,
    ...FONT_WEIGHTS.caption,
    lineHeight: LINE_HEIGHTS.caption,
  },
} as const;

/**
 * Helper to convert typography preset to React Native style
 */
export function toRNStyle(preset: typeof TYPOGRAPHY_PRESETS[keyof typeof TYPOGRAPHY_PRESETS]) {
  return {
    fontSize: preset.fontSize,
    fontWeight: preset.fontWeight,
    letterSpacing: preset.letterSpacing,
    lineHeight: preset.lineHeight,
    ...(preset.fontVariantNumeric && { fontVariantNumeric: preset.fontVariantNumeric }),
    ...(preset.textTransform && { textTransform: preset.textTransform }),
  };
}

