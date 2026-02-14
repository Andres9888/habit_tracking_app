/**
 * Authentication-related constants
 *
 * Design tokens for the authentication screens including colors, spacing,
 * border radius, and animation configurations.
 */

/**
 * Color palette for authentication screens
 * All colors follow the Tailwind slate palette for consistency
 */
export const AUTH_COLORS = {
  /** Primary background color */
  background: '#ffffff',

  /** Border color - stone-200 */
  border: '#e7e5e4',

  /** Error color - red-500/red-600 (WCAG AA compliant) */
  error: '#dc2626',

  /** Placeholder text color - stone-400 */
  placeholder: '#a8a29e',

  /** Primary text color - stone-900 */
  primary: '#1c1917',

  /** Secondary text color - stone-600 */
  secondary: '#57534e',

  /** Shadow color */
  shadow: '#000000',

  /** Dark slate - stone-700 */
  slateDark: '#44403c',

  /** Success color - green-500 */
  success: '#10b981',

  /** Primary text color - stone-900 */
  text: '#1c1917',

  /** Muted text color - stone-500 */
  textMuted: '#57534e',
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
  /** Large - 20px */
  lg: 20,

  /** Medium - 16px */
  md: 16,

  /** Small - 12px */
  sm: 12,
  /** Extra large - 24px (rounded-3xl) */
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
