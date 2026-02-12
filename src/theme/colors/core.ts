/**
 * Core Color Palette - Habit Tracking App
 * Based on UX Specification Section 5.1
 *
 * All colors match exact hex values from design spec
 * WCAG 2.1 Level AA compliant where applicable
 */

export const colors = {
  // Convenience aliases for common usage (defaults to light mode)
  background: '#faf9f7',

  border: '#e7e5e4',

  // Dark Mode (Future)
  dark: {
    background: '#111827',
    // Gray-800
    card: '#374151',
    // Gray-900
    surface: '#1F2937', // Gray-700 with glow
  },

  error: '#EF4444',

  // Neutral Grays (iOS-inspired)
  gray: {
    50: '#faf9f7', // Background, cards in dark mode
    100: '#f5f5f4', // Card backgrounds
    200: '#E5E7EB', // Borders, dividers
    300: '#D1D5DB', // Disabled elements
    400: '#6B7280', // Placeholder text (WCAG AA compliant)
    500: '#78716c', // Secondary text (stone-500)
    600: '#4B5563', // Body text
    700: '#374151', // Headings
    800: '#1F2937', // Very dark text
    900: '#111827', // Pure black alternative
  },

  // Red - errors, delete confirmations
  info: '#3B82F6',

  // Background & Surfaces
  light: {
    background: '#faf9f7', // Warm stone background
    card: '#ffffff', // Pure white cards for contrast
    gradientMid: '#f5f3f0', // Slightly darker warm stone for depth gradients
    surface: '#ffffff', // White surface for elevated elements
    surfaceMuted: '#fafaf9', // stone-50 for subtle sections
  },

  // Premium Colors (Monetization & Premium Features)
  premium: {
    400: '#a78bfa', // Lighter violet, hover states
    500: '#8b5cf6', // Standard violet-500
    600: '#7c3aed', // Violet-600 - primary premium color
    700: '#6d28d9', // Darker violet, pressed states
  },

  // Primary Colors (Growth & Progress)
  primary: {
    100: '#D1FAE5', // Very light emerald, muted accent backgrounds
    300: '#86EFAC', // Very light, decorative/confetti
    400: '#34D399', // Lighter, hover states
    500: '#10B981', // Emerald green - main brand color
    600: '#059669', // Darker, pressed states
    700: '#047857', // Very dark, high contrast text
  },

  // Secondary Colors (Trust & Calm)
  secondary: {
    100: '#dbeafe', // Very light blue, selected state backgrounds
    400: '#60A5FA', // Lighter, info states
    500: '#3B82F6', // Bright blue - science/analytics theme
    600: '#2563EB', // Darker, pressed
  },

  // Habit Strength Level Colors (Gradient: lime → green → teal → cyan → emerald)
  strength: {
    automatic: '#059669', // 80-100% - Emerald-600
    automaticLight: '#d1fae5', // Emerald-100
    building: '#16a34a', // 20-40% - Green-600
    buildingLight: '#dcfce7', // Green-100
    developing: '#0d9488', // 40-60% - Teal-600
    developingLight: '#ccfbf1', // Teal-100
    starting: '#65a30d', // 0-20% - Lime-600
    startingLight: '#ecfccb', // Lime-100
    strong: '#0891b2', // 60-80% - Cyan-600
    strongLight: '#cffafe', // Cyan-100
  },

  // Semantic Colors
  success: '#10B981',

  surface: '#faf9f7',

  // Text Colors
  text: {
    // Gray-400 - Placeholder, disabled text
    inverse: '#FFFFFF',
    primary: '#1F2937',
    // Gray-800 - Headings and important text
    secondary: '#78716c',
    // Gray-500 - Secondary text, labels
    tertiary: '#6B7280', // White text on dark backgrounds
  },

  // Matches primary green
  warning: {
    100: '#fef3c7', // Very light amber, suggestion backgrounds
    300: '#fcd34d', // Light amber, suggestion borders
    500: '#F59E0B', // Amber - habits at risk
    700: '#D97706', // Darker for text (better contrast)
  }, // Gray-200
} as const;

export type ColorPalette = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type GrayColor = keyof typeof colors.gray;
export type StrengthLevel = keyof typeof colors.strength;
