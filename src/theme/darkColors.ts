/**
 * Dark Mode Color Palette
 * Mirrors the light mode semantic structure with dark-appropriate values.
 */

export const darkColors = {
  background: '#111827',       // gray-900
  surface: '#1F2937',          // gray-800
  card: '#1F2937',             // gray-800
  cardBorder: '#374151',       // gray-700
  text: {
    primary: '#F9FAFB',        // gray-50
    secondary: '#9CA3AF',      // gray-400
    tertiary: '#6B7280',       // gray-500
    inverse: '#111827',        // gray-900
  },
  border: '#374151',           // gray-700
  // Semantic colors stay the same but slightly adjusted for dark bg
  primary: {
    100: '#064E3B',            // emerald-900
    300: '#059669',
    400: '#10B981',
    500: '#34D399',            // brighter on dark
    600: '#6EE7B7',
    700: '#A7F3D0',
  },
  gray: {
    50: '#111827',
    100: '#1F2937',
    200: '#374151',
    300: '#4B5563',
    400: '#6B7280',
    500: '#9CA3AF',
    600: '#D1D5DB',
    700: '#E5E7EB',
    800: '#F3F4F6',
    900: '#F9FAFB',
  },
} as const;

/**
 * Light mode semantic colors (matching existing defaults)
 */
export const lightColors = {
  background: '#faf9f7',
  surface: '#ffffff',
  card: '#ffffff',
  cardBorder: '#E5E7EB',
  text: {
    primary: '#1F2937',
    secondary: '#78716c',
    tertiary: '#6B7280',
    inverse: '#FFFFFF',
  },
  border: '#e7e5e4',
  primary: {
    100: '#D1FAE5',
    300: '#86EFAC',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  gray: {
    50: '#faf9f7',
    100: '#f5f5f4',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#6B7280',
    500: '#78716c',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

export type SemanticColors = typeof lightColors;
