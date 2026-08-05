/**
 * Authentication-related constants
 *
 * Design tokens for the authentication screens including colors, spacing,
 * border radius, and animation configurations.
 */

import { colors } from '@/theme/colors';

/**
 * Color palette for authentication screens
 * References the design system color tokens for consistency.
 */
export const AUTH_COLORS = {
  /** Primary background color */
  background: colors.text.inverse,

  /** Border color */
  border: colors.gray[200],

  /** Error color (WCAG AA compliant) */
  error: colors.error,

  /** Input hint text color */
  inputHint: colors.gray[400],

  /** Primary text color */
  primary: colors.gray[900],

  /** Secondary text color */
  secondary: colors.gray[500],

  /** Shadow color */
  shadow: '#000000',

  /** Dark slate */
  slateDark: colors.gray[700],

  /** Success color */
  success: colors.primary[500],

  /** Primary text color */
  text: colors.gray[900],

  /** Muted text color */
  textMuted: colors.gray[500],
} as const;

/**
 * Spacing values in pixels
 */
export const AUTH_SPACING = {
  /** Large - 24px */
  lg: 24,

  /** Medium - 16px */
  md: 16,

  /** Small - 8px */
  sm: 8,

  /** Extra large - 32px */
  xl: 32,

  /** Extra small - 4px */
  xs: 4,
} as const;

/**
 * Border radius values in pixels
 */
export const AUTH_BORDER_RADIUS = {
  /** Large - 16px (cards, containers) */
  lg: 16,

  /** Medium - 16px (inputs, cards) */
  md: 16,

  /** Small - 12px (buttons, tags) */
  sm: 12,
  /** Extra large - 24px (rounded-3xl, sheets) */
  xl: 24,
} as const;

/**
 * Animation configuration values
 */
export const AUTH_ANIMATION = {
  /** Button press scale */
  buttonPressScale: 0.98,

  /** Focus animation duration in ms */
  focusAnimationDuration: 200,

  /** Logo breathing animation duration in ms (one direction) */
  logoBreathDuration: 1500,

  /** Logo scale maximum */
  logoScaleMax: 1.05,

  /** Modal slide animation duration in ms */
  modalSlideDuration: 300,

  /** Error shake duration in ms */
  shakeAnimationDuration: 400,
  /** Spring damping for animations */
  springDamping: 15,
  /** Spring stiffness for animations */
  springStiffness: 400,
} as const;

/**
 * Minimum touch target size in pixels (WCAG 2.1 AA compliant)
 */
export const AUTH_TOUCH_TARGET = {
  /** Minimum touch target size - 44pt */
  minSize: 44,
} as const;

/**
 * OAuth provider brand colors
 */
export const OAUTH_BRAND_COLORS = {
  apple: {
    black: '#000000',
    white: '#ffffff',
  },
  google: {
    blue: '#4285F4',
    green: '#34A853',
    red: '#EA4335',
    yellow: '#FBBC05',
  },
} as const;
