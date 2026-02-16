/**
 * Dark Mode Color Palette
 * Mirrors the light mode semantic structure with dark-appropriate values.
 */

export const darkColors = {
  background: '#111827',

  border: '#374151',

  // gray-800
  card: '#1F2937',

  // gray-800
  cardBorder: '#374151',

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

  // gray-700
  // Semantic colors stay the same but slightly adjusted for dark bg
  primary: {
    100: '#064E3B', // emerald-900
    300: '#059669',
    400: '#10B981',
    500: '#34D399', // brighter on dark
    600: '#6EE7B7',
    700: '#A7F3D0',
  },

  // gray-900
  surface: '#1F2937',

  // gray-700
  text: {
    // gray-500
    inverse: '#111827',

    primary: '#F9FAFB',

    // gray-50
    secondary: '#9CA3AF',
    // gray-400
    tertiary: '#8E95A2', // WCAG AA 4.87:1 on dark card
  },
} as const;

/**
 * Light mode semantic colors (matching existing defaults)
 */
export const lightColors = {
  background: '#F5F1ED',
  border: '#DDD8D2',
  card: '#EDEAE5',
  cardBorder: '#DDD8D2',
  gray: {
    50: '#FAF8F5',
    100: '#F5F1ED',
    200: '#DDD8D2',
    300: '#C4BFB7',
    400: '#6E6660',
    500: '#6B6560',
    600: '#524D47',
    700: '#3D3833',
    800: '#2D2A26',
    900: '#1A1816',
  },
  primary: {
    100: '#D1FAE5',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  surface: '#EDEAE5',
  text: {
    inverse: '#FFFFFF',
    primary: '#2D2A26',
    secondary: '#6B6560',
    tertiary: '#6E6660',
  },
} as const;

export interface SemanticColors {
  background: string;
  surface: string;
  card: string;
  cardBorder: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: string;
  primary: {
    100: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}
