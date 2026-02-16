/**
 * Dark Mode Color Palette
 *
 * ## How Dark Mode Works
 *
 * 1. **Color Definitions**: This file defines `darkColors` and `lightColors` objects
 *    that mirror each other in structure but use different color values.
 *
 * 2. **Selection Logic**: `ThemeContext.tsx` reads the user's dark mode preference
 *    from Convex settings and system color scheme, then selects the appropriate palette.
 *
 * 3. **Consumption**: Components use `useThemeColors()` hook to get the active palette.
 *    The hook returns either `darkColors` or `lightColors` based on current mode.
 *
 * 4. **Semantic Structure**: Both palettes expose the same semantic tokens
 *    (`background`, `card`, `text.primary`, etc.) so components don't need to know
 *    which mode is active.
 *
 * ## Design Philosophy
 *
 * Dark mode isn't just inverted colors — it's a carefully crafted palette that:
 * - Reduces eye strain in low-light environments
 * - Maintains WCAG AA contrast ratios
 * - Preserves brand identity (green accent remains recognizable)
 * - Uses elevated surfaces (lighter grays) to show depth
 *
 * ## Color Inversions
 *
 * - **Light mode**: Dark text on light backgrounds (gray-800 on gray-100)
 * - **Dark mode**: Light text on dark backgrounds (gray-50 on gray-800)
 * - **Primary green**: Lighter/brighter in dark mode for visibility
 * - **Surfaces**: Lighter = higher elevation (matches Material Design)
 *
 * @example
 * ```tsx
 * import { useThemeColors } from '@/theme/ThemeContext';
 *
 * function MyCard() {
 *   const { colors, isDark } = useThemeColors();
 *
 *   return (
 *     <View style={{
 *       backgroundColor: colors.card,
 *       borderColor: colors.border
 *     }}>
 *       <Text style={{ color: colors.text.primary }}>
 *         Auto-adapts to dark/light mode
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */

/**
 * Dark Mode Semantic Colors
 *
 * Optimized for low-light viewing with inverted text/background hierarchy.
 * Uses gray-800 (#1F2937) as primary surface, gray-900 (#111827) as background.
 */
export const darkColors = {
  /** App canvas background — darkest layer (gray-900) */
  background: '#111827',

  /** Border color for cards and dividers (gray-700) */
  border: '#374151',

  card: '#1F2937',

  cardBorder: '#374151',

  /**
   * Gray Scale (Inverted)
   *
   * In dark mode, lower numbers = darker (opposite of light mode).
   * 50 is darkest, 900 is lightest.
   */
  gray: {
    50: '#111827', // Darkest — backgrounds
    100: '#1F2937', // Dark surfaces
    200: '#374151', // Borders, dividers
    300: '#4B5563', // Disabled elements
    400: '#6B7280', // Placeholder text
    500: '#9CA3AF', // Secondary text
    600: '#D1D5DB', // Light text
    700: '#E5E7EB', // Lighter text
    800: '#F3F4F6', // Primary text
    900: '#F9FAFB', // Lightest — high emphasis text
  },

  primary: {
    100: '#064E3B', // Darkest — emerald-900 for dark backgrounds
    300: '#059669', // Darker accent
    400: '#10B981', // Medium accent
    500: '#34D399', // Brighter — default primary in dark mode
    600: '#6EE7B7', // Lighter accent
    700: '#A7F3D0', // Lightest — high contrast on dark
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
 * Light Mode Semantic Colors
 *
 * Matches the core color palette defaults.
 * Uses warm stone tones for a calm, organic aesthetic.
 */
export const lightColors = {
  /** App canvas background — warm parchment (L0) */
  background: '#F5F1ED',

  /** Border color for cards and dividers */
  border: '#DDD8D2',

  /** Card surface — subtle lift above background (L1) */
  card: '#EDEAE5',

  /** Card border — same as general border */
  cardBorder: '#DDD8D2',

  /**
   * Gray Scale (Standard)
   *
   * Warm stone-based neutrals.
   * Lower numbers = lighter, higher numbers = darker.
   */
  gray: {
    50: '#FAF8F5', // Lightest — muted surfaces
    100: '#F5F1ED', // Background
    200: '#DDD8D2', // Borders, dividers
    300: '#C4BFB7', // Disabled elements
    400: '#6E6660', // Placeholder text, tertiary
    500: '#6B6560', // Secondary text
    600: '#524D47', // Body text
    700: '#3D3833', // Headings
    800: '#2D2A26', // Primary text
    900: '#1A1816', // Darkest — pure black alternative
  },

  /**
   * Primary Green (Forest Tones)
   *
   * Brand color — forest green.
   * Design system standard: #047857 for text, #059669 for buttons.
   */
  primary: {
    100: '#D1FAE5', // Lightest — tinted backgrounds
    300: '#6EE7B7', // Light — decorative, confetti
    400: '#34D399', // Medium — hover states
    500: '#10B981', // Default — success indicators, focus rings
    600: '#059669', // Buttons — primary CTA fills
    700: '#047857', // Darkest — high-contrast text on colored surfaces
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

  /**
   * Text Color Hierarchy
   *
   * Uses standard gray scale where darker = higher emphasis.
   */
  text: {
    /** Inverse text — white on colored backgrounds */
    inverse: '#FFFFFF',

    /** Primary text — highest emphasis (gray-800) */
    primary: '#2D2A26',

    /** Secondary text — medium emphasis (gray-500) */
    secondary: '#6B6560',

    /** Tertiary text — low emphasis (gray-400), WCAG AA compliant */
    tertiary: '#6E6660',
  },
} as const;

/**
 * Semantic Colors Interface
 *
 * Both `darkColors` and `lightColors` implement this interface,
 * ensuring structural consistency for theme switching.
 *
 * Components should only reference these semantic tokens, never raw hex values.
 */
export interface SemanticColors {
  /** App canvas background */
  background: string;
  border: string;
  card: string;

  /** Card border color */
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
