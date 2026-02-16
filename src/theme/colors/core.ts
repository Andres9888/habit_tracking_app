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

  error: '#B53030', // WCAG AA 5.45:1 on #F5F1ED
  errorLight: '#FEE2E2', // Light error tint for badges/backgrounds

  // Neutral Grays (warm stone-based)
  gray: {
    50: '#FAF8F5', // Muted surfaces
    100: '#F5F1ED', // Background
    200: '#DDD8D2', // Borders, dividers
    300: '#C4BFB7', // Disabled elements (WCAG-exempt per 1.4.3)
    400: '#6E6660', // Placeholder text, tertiary — WCAG AA 4.69:1 on card
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
    400: '#7B52C4', // WCAG AA 5.46:1 with white text
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
    500: '#8B6208', // Primary streak color — WCAG AA 4.92:1 on streak.100
    600: '#936A08', // Streak badges, flames — WCAG AA 4.88:1 with white
    700: '#7D5907', // Dark gold, high-contrast text — WCAG AA 6.36:1 with white
  },

  // Habit Strength Level Colors
  strength: {
    automatic: '#22805A', // 80-100% — matches primary.600
    automaticLight: '#D4F0E2',
    building: '#16a34a',
    buildingLight: '#dcfce7',
    developing: '#0d9488',
    developingLight: '#ccfbf1',
    starting: '#4D7A0A', // WCAG AA 4.72:1 on startingLight
    startingLight: '#ecfccb',
    strong: '#0891b2',
    strongLight: '#cffafe',
  },

  success: '#15793C', // WCAG AA 4.88:1 on #F5F1ED

  // Semantic text aliases consumed across app components
  text: {
    inverse: '#FFFFFF',
    primary: '#2D2A26',
    secondary: '#6B6560',
    tertiary: '#6E6660', // WCAG AA 5.01:1 on #F5F1ED, 4.69:1 on card
  },

  surface: '#EDEAE5',

  warning: '#9A5504', // WCAG AA 5.08:1 on #F5F1ED
  warningLight: '#FEF3CD',
} as const;

export type ColorPalette = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type GrayColor = keyof typeof colors.gray;
export type StrengthLevel = keyof typeof colors.strength;
