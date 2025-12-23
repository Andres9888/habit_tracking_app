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
  /** Primary text color - slate-900 */
  primary: '#0f172a',
  /** Secondary text color - slate-600 */
  secondary: '#475569',
  /** Border color - slate-200 */
  border: '#e2e8f0',
  /** Primary text color - slate-900 */
  text: '#0f172a',
  /** Muted text color - slate-500 */
  textMuted: '#64748b',
  /** Placeholder text color - slate-400 */
  placeholder: '#94a3b8',
  /** Error color - red-500/red-600 (WCAG AA compliant) */
  error: '#dc2626',
  /** Success color - green-500 */
  success: '#10b981',
  /** Dark slate - slate-700 */
  slateDark: '#334155',
  /** Shadow color */
  shadow: '#000000',
} as const;

/**
 * Spacing values in pixels
 */
export const AUTH_SPACING = {
  /** Extra small - 4px */
  xs: 4,
  /** Small - 8px */
  sm: 8,
  /** Medium - 16px */
  md: 16,
  /** Large - 24px */
  lg: 24,
  /** Extra large - 32px */
  xl: 32,
} as const;

/**
 * Border radius values in pixels
 */
export const AUTH_BORDER_RADIUS = {
  /** Small - 12px */
  sm: 12,
  /** Medium - 16px */
  md: 16,
  /** Large - 20px */
  lg: 20,
  /** Extra large - 24px (rounded-3xl) */
  xl: 24,
} as const;

/**
 * Animation configuration values
 */
export const AUTH_ANIMATION = {
  /** Logo breathing animation duration in ms (one direction) */
  logoBreathDuration: 1500,
  /** Logo scale maximum */
  logoScaleMax: 1.05,
  /** Button press scale */
  buttonPressScale: 0.98,
  /** Focus animation duration in ms */
  focusAnimationDuration: 200,
  /** Error shake duration in ms */
  shakeAnimationDuration: 400,
  /** Modal slide animation duration in ms */
  modalSlideDuration: 300,
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
  google: {
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC05',
    green: '#34A853',
  },
  apple: {
    black: '#000000',
    white: '#ffffff',
  },
} as const;
