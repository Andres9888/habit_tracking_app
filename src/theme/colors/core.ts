/**
 * Core Color Palette - Habit Tracking App
 * Frontend Redesign Spec 2026-02-14
 *
 * Warm Minimal direction — earth-toned, restrained, organic
 * Single saturated color: forest green (primary.600)
 * WCAG 2.1 Level AA compliant
 */

export const colors = {
  // Convenience aliases (light mode defaults)
  background: '#F5F1ED',

  border: '#DDD8D2',

  // Dark Mode (Future)
  dark: {
    background: '#111827',
    card: '#374151',
    surface: '#1F2937',
  },

  error: '#C93B3B',

  // Neutral Grays (warm stone-based)
  gray: {
    50: '#FAF8F5', // Muted surfaces
    100: '#F5F1ED', // Background
    200: '#DDD8D2', // Borders, dividers
    300: '#C4BFB7', // Disabled elements
    400: '#9C958D', // Placeholder text, tertiary
    500: '#6B6560', // Secondary text (5.1:1 on #F5F1ED)
    600: '#524D47', // Body text
    700: '#3D3833', // Headings
    800: '#2D2A26', // Primary text
    900: '#1A1816', // Pure black alternative
  },

  info: '#3872B8',

  // Background & Surfaces (layered planes)
  light: {
    background: '#F5F1ED', // Canvas (L0) — warm parchment
    card: '#EDEAE5', // Surface (L1) — subtle lift
    gradientMid: '#F0EDE8', // Depth gradient midpoint
    surface: '#EDEAE5', // Elevated elements (L1)
    surfaceMuted: '#FAF8F5', // Subtle section differentiation
  },

  // Premium Colors
  premium: {
    400: '#9B7AD8',
    500: '#8563C7',
    600: '#6D3AC7',
    700: '#5A2DA8',
  },

  // Primary Colors (Forest Green — single saturated color)
  primary: {
    100: '#D4F0E2', // Light tinted backgrounds
    300: '#6FCF9A', // Decorative, confetti
    400: '#3FBD7E', // Lighter, hover states
    500: '#2A9D6E', // Success indicators, focus rings
    600: '#22805A', // Buttons, CTA fills
    700: '#1B6B4A', // High-contrast text on colored surfaces
  },

  // Secondary Colors (Trust & Calm)
  secondary: {
    100: '#dbeafe',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Streak & Progress — burnished gold (accent, ≤10% visible area)
  streak: {
    100: '#FEF3CD', // Streak background tint
    300: '#E8B94D', // Light gold accents
    500: '#C4890A', // Primary streak color
    600: '#B47D0A', // Streak badges, flames
    700: '#946508', // Dark gold, high-contrast text
  },

  // Habit Strength Level Colors
  strength: {
    automatic: '#22805A', // 80-100% — matches primary.600
    automaticLight: '#D4F0E2',
    building: '#16a34a',
    buildingLight: '#dcfce7',
    developing: '#0d9488',
    developingLight: '#ccfbf1',
    starting: '#65a30d',
    startingLight: '#ecfccb',
    strong: '#0891b2',
    strongLight: '#cffafe',
  },

  success: '#22c55e',

  surface: '#EDEAE5',

  // Text Colors (semantic hierarchy)
  text: {
    disabled: '#9C958D', // gray.400 — Disabled, placeholder
    inverse: '#FFFFFF', // White text on colored backgrounds
    onDark: '#F5F1ED', // Light text on dark surfaces
    onPrimary: '#FFFFFF', // White text on primary green buttons
    primary: '#2D2A26', // gray.800 — Headings, strong emphasis
    secondary: '#524D47', // gray.600 — Body text, default
    tertiary: '#6B6560', // gray.500 — Secondary text (5.1:1 contrast)
  },

  warning: '#D97706',
  warningLight: '#FEF3CD',
} as const;

export type ColorPalette = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type GrayColor = keyof typeof colors.gray;
export type StrengthLevel = keyof typeof colors.strength;
