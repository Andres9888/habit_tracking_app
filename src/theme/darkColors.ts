/**
 * Dark Mode Color Palette
 * Mirrors the light mode semantic structure with dark-appropriate values.
 */

export const darkColors = {
  background: '#111827',

  border: '#374151',

  card: '#1F2937',

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

  primary: {
    100: '#064E3B', // emerald-900
    300: '#059669',
    400: '#10B981',
    500: '#34D399', // brighter on dark
    600: '#6EE7B7',
    700: '#A7F3D0',
  },

  /** Status / accent semantic colors — adjusted for dark backgrounds */
  status: {
    amber: '#FCD34D', // amber-300
    amberBg: '#78350F', // amber-900
    amberMuted: '#92400E', // amber-800
    error: '#FCA5A5', // red-300
    errorBg: '#7F1D1D', // red-900
    errorMuted: '#991B1B', // red-800
    info: '#93C5FD', // blue-300
    infoBg: '#1E3A5F', // blue-900
    success: '#6EE7B7', // emerald-300
    successBg: '#064E3B', // emerald-900
    successMuted: '#065F46', // emerald-800
    violet: '#C4B5FD', // violet-300
    violetBg: '#4C1D95', // violet-900
    warning: '#FCD34D', // amber-300
    warningBg: '#78350F', // amber-900
    warningMuted: '#92400E', // amber-800
  },

  surface: '#1F2937',

  text: {
    inverse: '#111827',
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
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
    100: '#D4F0E2',
    300: '#6FCF9A',
    400: '#3FBD7E',
    500: '#2A9D6E',
    600: '#22805A',
    700: '#1B6B4A',
  },

  /** Status / accent semantic colors — standard light-mode values */
  status: {
    amber: '#F59E0B', // amber-500
    amberBg: '#FEF3C7', // amber-100
    amberMuted: '#FDE68A', // amber-200
    error: '#DC2626', // red-600
    errorBg: '#FEF2F2', // red-50
    errorMuted: '#FEE2E2', // red-100
    info: '#3B82F6', // blue-500
    infoBg: '#EFF6FF', // blue-50
    success: '#10B981', // emerald-500
    successBg: '#F0FDF4', // green-50
    successMuted: '#D1FAE5', // emerald-100
    violet: '#8B5CF6', // violet-500
    violetBg: '#EDE9FE', // violet-50
    warning: '#F59E0B', // amber-500
    warningBg: '#FFFBEB', // amber-50
    warningMuted: '#FEF3C7', // amber-100
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
  border: string;
  card: string;
  cardBorder: string;
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
  primary: {
    100: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  status: {
    amber: string;
    amberBg: string;
    amberMuted: string;
    error: string;
    errorBg: string;
    errorMuted: string;
    info: string;
    infoBg: string;
    success: string;
    successBg: string;
    successMuted: string;
    violet: string;
    violetBg: string;
    warning: string;
    warningBg: string;
    warningMuted: string;
  };
  surface: string;
  text: {
    inverse: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
}
