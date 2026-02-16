/**
 * Constants for ErrorMessage component
 */

/**
 * Error message styling colors - light mode
 */
export const ERROR_COLORS_LIGHT = {
  background: '#FEF2F2', // red-50
  border: '#FECACA', // red-200
  dismissText: '#DC2626', // red-600
  iconBackground: '#EF4444', // red-500
  iconText: '#FFFFFF', // white
  text: '#991B1B', // red-800
} as const;

/**
 * Error message styling colors - dark mode
 */
export const ERROR_COLORS_DARK = {
  background: 'rgba(127, 29, 29, 0.3)', // red-900/30
  border: 'rgba(220, 38, 38, 0.3)', // red-600/30
  dismissText: '#F87171', // red-400
  iconBackground: '#DC2626', // red-600
  iconText: '#FFFFFF', // white
  text: '#FCA5A5', // red-300
} as const;

/** @deprecated Use ERROR_COLORS_LIGHT or ERROR_COLORS_DARK */
export const ERROR_COLORS = ERROR_COLORS_LIGHT;
