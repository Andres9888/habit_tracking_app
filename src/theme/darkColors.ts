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

  /**
   * Semantic Border Colors
   *
   * Contextual border tokens for states, feedback, and accents.
   * Dark mode uses inverted tones for contrast on dark surfaces.
   */
  borders: {
    /** Default subtle border — replaces stone-200 */
    subtle: '#4B5563',
    /** Slightly stronger subtle — replaces stone-300 */
    muted: '#4B5563',
    /** Medium emphasis — replaces stone-400 */
    medium: '#6B7280',
    /** High emphasis — replaces gray-900 */
    strong: '#E5E7EB',
    /** Selected / active item (emerald) */
    selected: '#34D399',
    /** Error state — light */
    error: '#991B1B',
    /** Error state — strong */
    errorStrong: '#F87171',
    /** Success — light background border */
    success: '#065F46',
    /** Success — strong emphasis */
    successStrong: '#34D399',
    /** Success card border (emerald-200 equivalent) */
    successCard: '#064E3B',
    /** Success light border (mint) */
    successLight: '#065F46',
    /** Warning — primary */
    warning: '#F59E0B',
    /** Warning — subtle */
    warningSubtle: '#92400E',
    /** Warning — softest */
    warningSoft: '#78350F',
    /** Tip / hint (yellow) */
    tip: '#713F12',
    /** Info (blue) */
    info: '#1E3A5F',
    /** Orange accent */
    orange: '#F97316',
    /** Orange subtle background border */
    orangeSubtle: '#7C2D12',
    /** Premium border */
    premium: '#5B21B6',
    /** Premium strong / selected */
    premiumStrong: '#8B5CF6',
    /** Purple accent */
    accent: '#A855F7',
    /** High-contrast accessibility border */
    highContrast: '#EAB308',
    /** Synced / confirmed green */
    synced: '#065F46',
    /** New record / badge amber */
    badge: '#FBBF24',
    /** Archive undo border */
    archive: '#FCD34D',
  },

  /** Card surface — elevated above background (gray-800) */
  card: '#1F2937',

  /** Card border — slightly lighter than surface (gray-700) */
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

  /**
   * Primary Green (Brighter in Dark Mode)
   *
   * Uses lighter shades to maintain visibility against dark backgrounds.
   * The scale is partially inverted to keep semantics consistent.
   */
  primary: {
    100: '#064E3B', // Darkest — emerald-900 for dark backgrounds
    300: '#059669', // Darker accent
    400: '#10B981', // Medium accent
    500: '#34D399', // Brighter — default primary in dark mode
    600: '#6EE7B7', // Lighter accent
    700: '#A7F3D0', // Lightest — high contrast on dark
  },

  /** Elevated surface — same as card (gray-800) */
  surface: '#1F2937',

  /**
   * Text Color Hierarchy
   *
   * Uses inverted gray scale where lighter = higher emphasis.
   */
  text: {
    /** Inverse text — used on light surfaces in dark mode */
    inverse: '#111827',

    /** Primary text — highest emphasis (gray-50) */
    primary: '#F9FAFB',

    /** Secondary text — medium emphasis (gray-500) */
    secondary: '#9CA3AF',

    /** Tertiary text — low emphasis, WCAG AA 4.87:1 on dark card */
    tertiary: '#8E95A2',
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

  /** Semantic Border Colors — light mode values */
  borders: {
    subtle: '#e7e5e4',
    muted: '#d6d3d1',
    medium: '#a8a29e',
    strong: '#111827',
    selected: '#10b981',
    error: '#FECACA',
    errorStrong: '#ef4444',
    success: '#bbf7d0',
    successStrong: '#10b981',
    successCard: '#a7f3d0',
    successLight: '#D1FAE5',
    warning: '#fbbf24',
    warningSubtle: '#fcd34d',
    warningSoft: '#fde68a',
    tip: '#fef08a',
    info: '#BFDBFE',
    orange: '#fb923c',
    orangeSubtle: '#FFEDD5',
    premium: '#c4b5fd',
    premiumStrong: '#6d28d9',
    accent: '#a855f7',
    highContrast: '#facc15',
    synced: '#86efac',
    badge: '#D97706',
    archive: '#f5f5f4',
  },

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

  /** Elevated surface — same as card (L1) */
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

  /** Elevated surface color */
  surface: string;

  /** Card/container background */
  card: string;

  /** Card border color */
  cardBorder: string;

  /** Text colors by emphasis level */
  text: {
    /** Highest emphasis text */
    primary: string;
    /** Medium emphasis text */
    secondary: string;
    /** Low emphasis text */
    tertiary: string;
    /** Inverse text for colored backgrounds */
    inverse: string;
  };

  /** Border color for dividers and separators */
  border: string;

  /** Semantic border colors for states, feedback, and accents */
  borders: {
    subtle: string;
    muted: string;
    medium: string;
    strong: string;
    selected: string;
    error: string;
    errorStrong: string;
    success: string;
    successStrong: string;
    successCard: string;
    successLight: string;
    warning: string;
    warningSubtle: string;
    warningSoft: string;
    tip: string;
    info: string;
    orange: string;
    orangeSubtle: string;
    premium: string;
    premiumStrong: string;
    accent: string;
    highContrast: string;
    synced: string;
    badge: string;
    archive: string;
  };

  /** Primary brand color scale */
  primary: {
    100: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };

  /** Grayscale palette */
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
