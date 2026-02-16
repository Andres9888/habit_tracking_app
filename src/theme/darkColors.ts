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

  /** Amber/Warning color scale for archive actions, notes, streaks */
  amber: {
    50: '#451A03',   // Dark amber background
    100: '#78350F',  // Amber surface
    200: '#92400E',  // Amber border/pressed
    500: '#F59E0B',  // Amber accent
    600: '#D97706',  // Amber button
    700: '#FCD34D',  // Amber text (light on dark)
  },

  /** Red/Danger color scale for delete toasts, error states */
  danger: {
    50: '#7F1D1D',   // Dark red background
    100: '#991B1B',  // Red surface/border
    500: '#EF4444',  // Red accent
    600: '#EF4444',  // Red button
    text: '#FCA5A5', // Red text (light on dark)
  },

  /** Purple/Violet color scale for insights, analytics, premium features */
  purple: {
    50: '#2E1065',   // Dark purple background
    text: '#C4B5FD', // Purple text (light on dark)
  },

  /** Blue/Info color scale for compliance, research, informational */
  info: {
    50: '#1E3A5F',   // Dark blue background
    100: '#1E3A8A',  // Blue surface
    border: '#1D4ED8', // Blue border
    text: '#93C5FD', // Blue text (light on dark)
  },

  /** Success/Green tints for positive states, confirmations */
  success: {
    50: '#064E3B',   // Dark green background
    100: '#065F46',  // Green surface/border
    500: '#34D399',  // Green accent
    button: '#34D399', // Green button
    text: '#6EE7B7', // Green text (light on dark)
    textDark: '#A7F3D0', // Secondary green text
  },

  /** Yellow/Tip color scale for tips, hints */
  tip: {
    50: '#422006',   // Dark yellow background
    100: '#854D0E',  // Yellow border
    border: '#92400E', // Yellow border
    text: '#FDE68A', // Yellow text (light on dark)
    textDark: '#CA8A04', // Dark tip label
  },

  /** Strength/Progress bar colors */
  strength: {
    bar: '#A3E635',      // Lime green progress
    barText: '#A3E635',  // Lime green text
  },

  /** Chip/pill selected states */
  chip: {
    selectedBg: '#F9FAFB',   // Selected chip bg (inverted)
    selectedText: '#111827',  // Selected chip text
    unselectedBg: '#1F2937',  // Unselected chip bg
    unselectedText: '#F9FAFB', // Unselected chip text
  },

  /** Emoji picker and selection states */
  selection: {
    bg: '#374151',        // Selected item background
    bgSubtle: '#1F2937',  // Unselected item background
    border: '#10b981',    // Selected item border (green accent)
  },

  /** Switch/toggle track colors */
  toggle: {
    trackOff: '#4B5563',  // Off state track
    trackOn: '#10B981',   // On state track
    thumb: '#FFFFFF',     // Thumb color
    iosBg: '#4B5563',     // iOS background
  },

  /** Overlay/backdrop */
  overlay: {
    backdrop: '#000',
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

  /** Amber/Warning color scale for archive actions, notes, streaks */
  amber: {
    50: '#FFFBEB',   // Light amber background
    100: '#fef3c7',  // Amber surface
    200: '#fde68a',  // Amber border/pressed
    500: '#f59e0b',  // Amber accent
    600: '#d97706',  // Amber button
    700: '#b45309',  // Amber text
  },

  /** Red/Danger color scale for delete toasts, error states */
  danger: {
    50: '#fee2e2',   // Light red background
    100: '#fecaca',  // Red surface/border
    500: '#dc2626',  // Red accent
    600: '#dc2626',  // Red button
    text: '#dc2626', // Red text
  },

  /** Purple/Violet color scale for insights, analytics, premium features */
  purple: {
    50: '#F5F3FF',   // Light purple background
    text: '#A78BFA', // Purple text
  },

  /** Blue/Info color scale for compliance, research, informational */
  info: {
    50: '#EFF6FF',   // Light blue background
    100: '#DBEAFE',  // Blue surface
    border: '#BFDBFE', // Blue border
    text: '#3b82f6', // Blue text
  },

  /** Success/Green tints for positive states, confirmations */
  success: {
    50: '#ECFDF5',   // Light green background
    100: '#D1FAE5',  // Green surface/border
    500: '#22c55e',  // Green accent
    button: '#22c55e', // Green button
    text: '#065F46', // Green text
    textDark: '#047857', // Secondary green text
  },

  /** Yellow/Tip color scale for tips, hints */
  tip: {
    50: '#fefce8',   // Light yellow background
    100: '#fef08a',  // Yellow border
    border: '#fef08a', // Yellow border
    text: '#713f12', // Yellow text
    textDark: '#854d0e', // Dark tip label
  },

  /** Strength/Progress bar colors */
  strength: {
    bar: '#4D7A0A',      // Dark green progress
    barText: '#4D7A0A',  // Dark green text
  },

  /** Chip/pill selected states */
  chip: {
    selectedBg: '#1c1917',   // Selected chip bg (dark)
    selectedText: '#FFFFFF',  // Selected chip text
    unselectedBg: '#FFFFFF',  // Unselected chip bg
    unselectedText: '#1c1917', // Unselected chip text
  },

  /** Emoji picker and selection states */
  selection: {
    bg: '#f5f5f4',        // Selected item background
    bgSubtle: '#fafaf9',  // Unselected item background
    border: '#10b981',    // Selected item border (green accent)
  },

  /** Switch/toggle track colors */
  toggle: {
    trackOff: '#d6d3d1',  // Off state track
    trackOn: '#10B981',   // On state track
    thumb: '#FFFFFF',     // Thumb color
    iosBg: '#d6d3d1',    // iOS background
  },

  /** Overlay/backdrop */
  overlay: {
    backdrop: '#000',
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

  /** Amber/Warning color scale */
  amber: {
    50: string;
    100: string;
    200: string;
    500: string;
    600: string;
    700: string;
  };

  /** Red/Danger color scale */
  danger: {
    50: string;
    100: string;
    500: string;
    600: string;
    text: string;
  };

  /** Purple/Violet color scale */
  purple: {
    50: string;
    text: string;
  };

  /** Blue/Info color scale */
  info: {
    50: string;
    100: string;
    border: string;
    text: string;
  };

  /** Success/Green tints */
  success: {
    50: string;
    100: string;
    500: string;
    button: string;
    text: string;
    textDark: string;
  };

  /** Yellow/Tip color scale */
  tip: {
    50: string;
    100: string;
    border: string;
    text: string;
    textDark: string;
  };

  /** Strength/Progress bar colors */
  strength: {
    bar: string;
    barText: string;
  };

  /** Chip/pill selected states */
  chip: {
    selectedBg: string;
    selectedText: string;
    unselectedBg: string;
    unselectedText: string;
  };

  /** Emoji picker and selection states */
  selection: {
    bg: string;
    bgSubtle: string;
    border: string;
  };

  /** Switch/toggle track colors */
  toggle: {
    trackOff: string;
    trackOn: string;
    thumb: string;
    iosBg: string;
  };

  /** Overlay/backdrop */
  overlay: {
    backdrop: string;
  };
}
