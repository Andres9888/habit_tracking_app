/**
 * Dark Mode Color Palette — Warm Dark
 *
 * Uses warm brown-black tones that harmonize with the light mode
 * warm stone palette. Avoids cool blue-grays (Tailwind defaults)
 * to maintain consistent warmth across both modes.
 *
 * Base: warm charcoal (#1A1816) from gray.900
 * Surfaces lift with warm undertones, not blue ones.
 */

export const darkColors = {
  background: '#1A1816', // Warm charcoal (matches gray.900)

  border: '#3D3833', // Warm border (matches gray.700)

  card: '#252220', // Warm elevated surface

  cardBorder: '#3D3833',

  gray: {
    50: '#1A1816', // Inverted: darkest at 50
    100: '#252220', // Card-level surface
    200: '#3D3833', // Borders, dividers
    300: '#524D47', // Subtle separators
    400: '#6B6560', // Placeholder text
    500: '#9C958D', // Secondary text
    600: '#C4BFB7', // Body text on dark
    700: '#DDD8D2', // Headings on dark
    800: '#F5F1ED', // High-emphasis text
    900: '#FAF8F5', // Maximum contrast
  },

  primary: {
    100: '#1B3A2E', // Deep forest tint
    300: '#2A9D6E', // Matches light 500
    400: '#3FBD7E', // Same as light 400
    500: '#6FCF9A', // Brighter on dark (matches light 300)
    600: '#8EDBB2', // Light enough for dark bg text
    700: '#D4F0E2', // Maximum contrast green
  },

  surface: '#252220', // Warm elevated surface

  text: {
    inverse: '#1A1816',
    primary: '#FAF8F5', // Warm white (from gray.50)
    secondary: '#9C958D', // Warm mid-gray (from gray.400)
    tertiary: '#6B6560', // Warm dim (from gray.500)
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
    400: '#9C958D',
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
  surface: '#EDEAE5',
  text: {
    inverse: '#FFFFFF',
    primary: '#2D2A26',
    secondary: '#6B6560',
    tertiary: '#9C958D',
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
