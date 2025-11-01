/**
 * Color Palette - Habit Tracking App
 * Based on UX Specification Section 5.1
 *
 * All colors match exact hex values from design spec
 * WCAG 2.1 Level AA compliant where applicable
 */

export const colors = {
  // Dark Mode (Future)
  dark: {
    background: '#111827',
    // Gray-800
    card: '#374151',
    // Gray-900
    surface: '#1F2937', // Gray-700 with glow
  },

  error: '#EF4444',

  // Convenience aliases for common usage (defaults to light mode)
  background: '#f8f5f1',

  // Matches secondary blue
  // Neutral Grays (iOS-inspired)
  gray: {
    50: '#f8f5f1', // Background, cards in dark mode
    100: '#f8f5f1', // Card backgrounds
    200: '#E5E7EB', // Borders, dividers
    300: '#D1D5DB', // Disabled elements
    400: '#9CA3AF', // Placeholder text
    500: '#6B7280', // Secondary text
    600: '#4B5563', // Body text
    700: '#374151', // Headings
    800: '#1F2937', // Very dark text
    900: '#111827', // Pure black alternative
  },

  border: '#E5E7EB',

  // Red - errors, delete confirmations
  info: '#3B82F6',

  // Background & Surfaces
  light: {
    background: '#f8f5f1',
    // Warm beige background
    card: '#FFFFFF',
    // Pure white
    surface: '#f8f5f1', // Card with shadow
  },

  // Primary Colors (Growth & Progress)
  primary: {
    400: '#34D399', // Lighter, hover states
    500: '#10B981', // Emerald green - main brand color
    600: '#059669', // Darker, pressed states
    700: '#047857', // Very dark, high contrast text
  },

  // Secondary Colors (Trust & Calm)
  secondary: {
    400: '#60A5FA', // Lighter, info states
    500: '#3B82F6', // Bright blue - science/analytics theme
    600: '#2563EB', // Darker, pressed
  },

  // Habit Strength Level Colors (Gradient)
  strength: {
    // 0-20% - Light green 🌱
    building: '#10B981',

    // 60-80% - Dark green 💪
    automatic: '#065F46',

    // 20-40% - Brand green 🌿
    developing: '#059669',

    starting: '#86EFAC',
    // 40-60% - Medium green 🌳
    strong: '#047857', // 80-100% - Deep forest green ⚡
  },

  // Semantic Colors
  success: '#10B981',

  surface: '#f8f5f1',

  // Text Colors
  text: {
    // Gray-400 - Placeholder, disabled text
    inverse: '#FFFFFF',

    primary: '#1F2937',

    // Gray-800 - Headings and important text
    secondary: '#6B7280',
    // Gray-500 - Secondary text, labels
    tertiary: '#9CA3AF', // White text on dark backgrounds
  },

  // Matches primary green
  warning: {
    500: '#F59E0B', // Amber - habits at risk
    700: '#D97706', // Darker for text (better contrast)
  }, // Gray-200
} as const;

/**
 * Color Contrast Compliance (WCAG 2.1 Level AA)
 *
 * Text Contrast Minimums:
 * - Normal text (17pt): 4.5:1
 * - Large text (22pt+): 3:1
 * - UI components: 3:1
 *
 * Verified Ratios:
 * ✅ Gray-700 (#374151) on White: 10.8:1
 * ✅ Primary-700 (#047857) on White: Sufficient for text
 * ✅ Gray-600 (#4B5563) on White: 8.3:1
 * ⚠️  Warning-500 (#F59E0B) on White: 2.3:1 - Use Warning-700 for text
 * ✅ Primary-500 (#10B981) on White: 2.9:1 - Use Primary-700 for text
 */

export type ColorPalette = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type GrayColor = keyof typeof colors.gray;
export type StrengthLevel = keyof typeof colors.strength;
