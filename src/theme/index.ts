/**
 * Theme System - Chain Day Habit Tracking App
 *
 * Central export for the complete design system integrating colors, typography,
 * spacing, animations, and the MD3-shaped base theme.
 *
 * Based on UX Specification Sections 5.1 (Colors), 5.2 (Typography), 5.3 (Spacing)
 *
 * ## Architecture Overview
 *
 * The theme system is built in layers:
 *
 * ```
 * ┌─────────────────────────────────────────────────────────┐
 * │  Components (consume via useAppTheme / useThemeColors)  │
 * └─────────────────────────────────────────────────────────┘
 *                           ▲
 *                           │
 * ┌─────────────────────────────────────────────────────────┐
 * │  ThemeContext.tsx - Dark/Light Mode Selection           │
 * │  Provides: { colors, isDark, mode }                     │
 * └─────────────────────────────────────────────────────────┘
 *                           ▲
 *                           │
 * ┌──────────────────┬──────┴────────┬─────────────────────┐
 * │  darkColors.ts   │  lightColors  │  colors/core.ts     │
 * │  (dark palette)  │  (light pal)  │  (static colors)    │
 * └──────────────────┴───────────────┴─────────────────────┘
 *                           ▲
 *                           │
 * ┌─────────────────────────────────────────────────────────┐
 * │  Design Tokens: typography, spacing, animations, icons  │
 * └─────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Usage Patterns
 *
 * ### 1. Theme-Aware Colors (Recommended)
 *
 * Use `useThemeColors()` for colors that adapt to dark/light mode:
 *
 * ```tsx
 * import { useThemeColors } from '@/theme';
 *
 * function MyCard() {
 *   const { colors, isDark } = useThemeColors();
 *
 *   return (
 *     <View style={{
 *       backgroundColor: colors.card,      // Auto-adapts
 *       borderColor: colors.border,        // Auto-adapts
 *     }}>
 *       <Text style={{ color: colors.text.primary }}>
 *         Auto-switches with theme
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 *
 * ### 2. Static Design Tokens
 *
 * For typography, spacing, animations — these don't change with theme:
 *
 * ```tsx
 * import { typography, spacing, shadows } from '@/theme';
 *
 * <Text style={[typography.heading1, { marginBottom: spacing.lg }]}>
 *   Hello World
 * </Text>
 *
 * <View style={[{ borderRadius: borderRadius.card }, shadows.card]}>
 *   Card with shadow
 * </View>
 * ```
 *
 * ### 3. Full Theme Access
 *
 * Use `useAppTheme()` for full theme access (MD3-shaped base + custom tokens):
 *
 * ```tsx
 * import { useAppTheme } from '@/theme';
 *
 * function MyButton() {
 *   const theme = useAppTheme();
 *
 *   return (
 *     <Button
 *       mode="contained"
 *       buttonColor={theme.custom.colors.primary[600]}
 *       textColor={theme.custom.colors.text.inverse}
 *       style={{
 *         borderRadius: theme.custom.borderRadius.button,
 *         ...theme.custom.shadows.card,
 *       }}
 *     >
 *       Primary CTA
 *     </Button>
 *   );
 * }
 * ```
 *
 * ## Design System Standards
 *
 * ### Typography Scale
 * - **Display Large**: 34px Literata (serif) — onboarding headlines
 * - **Heading 1**: 22px Literata (serif) — screen titles
 * - **Heading 2**: 22px DM Sans — section titles
 * - **Heading 3**: 20px DM Sans — card titles, habit names
 * - **Body**: 17px DM Sans — primary text
 * - **Body Small**: 14px DM Sans — secondary info
 * - **Caption**: 13px DM Sans — meta info, timestamps
 * - **Tab Bar**: 10px DM Sans — tab labels
 *
 * Font pairing: **Literata (display/H1)** + **DM Sans (all other text)**
 *
 * ### Spacing (8px Grid System)
 * All values are multiples of 4px:
 * - `xs`: 4px — micro spacing
 * - `sm`: 8px — tight grouping
 * - `md`: 12px — default element spacing
 * - `base`: 16px — standard padding/margin
 * - `lg`: 24px — section spacing
 * - `xl`: 32px — large gaps
 * - `2xl`: 48px — major sections
 * - `3xl`: 64px — screen-level spacing
 *
 * ### Border Radius (Warm Minimal)
 * - Cards: 16px (`borderRadius.card`)
 * - Buttons: 12px (`borderRadius.button`)
 * - Chips/badges: 8px (`borderRadius.chip`)
 * - Pills: 9999px (`borderRadius.full`)
 *
 * ### Shadows (Layered Planes)
 * Warm-toned shadows using `#2D2A26` for tonal consistency:
 * - `subtle`: Chips, badges (minimal elevation)
 * - `card`: Cards at rest
 * - `floatingActionButton`: FAB, pressed cards
 * - `modal`: Bottom sheets, modals
 * - `alert`: Top-most overlays
 *
 * ### Animations
 * Motion rules:
 * - Entry: fade + translateY, 280ms ease-out
 * - Stagger: 60ms per item, max 5 items
 * - Feedback: spring-based, ≤100ms for taps
 * - No decorative loops or idle animations
 *
 * Entrances: `FadeInDown.duration(durations.enter).easing(enterEasing)` (cubic ease-out)
 * Springs: reserved for feedback (press, celebration) — not entrances
 *
 * ## Color Naming Convention
 *
 * ### Semantic Tokens (Theme-Aware)
 * - `background`: App canvas
 * - `surface`: Elevated elements
 * - `card`: Card containers
 * - `border`: Dividers and separators
 * - `text.primary`: Highest emphasis (gray-800 light / gray-50 dark)
 * - `text.secondary`: Medium emphasis (gray-500 light / gray-500 dark)
 * - `text.tertiary`: Low emphasis (gray-400 light / gray-400 dark)
 * - `text.inverse`: Opposite theme (white light / dark dark)
 *
 * ### Static Colors (Don't Change with Theme)
 * - `primary`: Forest green (#059669 for buttons, #047857 for text)
 * - `success`: Green (#15793C) — completions, checkmarks
 * - `error`: Red (#B53030) — errors, destructive actions
 * - `warning`: Brown (#9A5504) — warnings, cautions
 * - `info`: Blue (#3872B8) — informational notices
 * - `streak`: Burnished gold (#8B6208) — chains, momentum
 * - `premium`: Purple (#7B52C4) — subscription tier
 *
 * ### Scale Numbers (50-900)
 * In **light mode**: 50 = lightest, 900 = darkest
 * In **dark mode**: Inverted (50 = darkest, 900 = lightest)
 *
 * ## Dark Mode Implementation
 *
 * 1. **User Setting**: Stored in Convex as `darkMode: 'system' | 'light' | 'dark'`
 * 2. **System Preference**: Read via `useColorScheme()` hook
 * 3. **Resolution**: `ThemeContext.tsx` combines both to select palette
 * 4. **Palette Selection**: Returns `darkColors` or `lightColors`
 * 5. **Component Usage**: Components use `useThemeColors()` — no if/else needed
 *
 * Both palettes implement the same `SemanticColors` interface, so components
 * reference semantic tokens (`colors.background`, `colors.text.primary`) that
 * automatically resolve to the correct value.
 *
 * ## WCAG Accessibility
 *
 * Target for all text colors is WCAG 2.1 Level AA:
 * - Normal text: 4.5:1 minimum contrast
 * - Large text (22pt+): 3:1 minimum contrast
 * - UI components: 3:1 minimum contrast
 *
 * Semantic colors (`error`, `warning`, `info`, `success`, `streak`, `premium`)
 * all clear AA on white. The `primary` scale does NOT: `primary[500]` is
 * 2.54:1 and `primary[600]` is 3.77:1 against white, so neither is safe behind
 * white label text. Filled CTAs use `primary[700]` (5.48:1 light / 13.83:1
 * dark). See `colors/index.ts` for the per-token table.
 *
 * ## File Organization
 *
 * ```
 * src/theme/
 * ├── ThemeContext.tsx           # Dark/light mode provider & hooks
 * ├── colors/
 * │   ├── core.ts                # All raw color values & scales
 * │   ├── semantic.ts            # Semantic aliases (warmPalette)
 * │   └── index.ts               # Barrel export + docs
 * ├── darkColors.ts              # Dark & light mode palettes
 * ├── typography.ts              # Font families, weights, text styles
 * ├── spacing.ts                 # Spacing scale, shadows, border radius
 * ├── animations.ts              # Durations, easings, spring presets
 * ├── iconSizes.ts               # Icon size tokens (10-48px)
 * ├── milestone-colors.ts        # Achievement badge colors
 * └── index.ts                   # Main export (this file)
 * ```
 */

import { colors } from './colors';
import { typography, fontFamilies, fontWeights } from './typography';
import { spacing, borderRadius, shadows, componentSpacing } from './spacing';
import { durations, easings, springs } from './animations';
import { iconSizes } from './iconSizes';

/**
 * MD3-shaped Font Configuration
 *
 * Maps our typography scale onto the Material Design 3 font-variant names.
 *
 * This used to be produced by `react-native-paper`'s `configureFonts()`, but
 * Paper was removed from the runtime bundle (see the note on `theme` below).
 * The config below already covers all 15 MD3 variants, so `configureFonts`
 * had nothing left to merge in — it is now just a plain object.
 */
const customFonts = {
  default: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.12,
    lineHeight: 18,
  },
  displayLarge: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.85,
    lineHeight: 41,
  },
  displayMedium: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 22,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.35,
    lineHeight: 28,
  },
  displaySmall: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.35,
    lineHeight: 28,
  },
  headlineLarge: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 22,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.35,
    lineHeight: 28,
  },
  headlineMedium: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.35,
    lineHeight: 28,
  },
  headlineSmall: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  labelLarge: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
  labelMedium: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.12,
    lineHeight: 18,
  },
  labelSmall: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 10,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.1,
    lineHeight: 12,
  },
  titleLarge: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  titleMedium: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
    lineHeight: 20,
  },
};

/**
 * MD3-shaped Base Theme
 *
 * Keeps the Material Design 3 token *shape* (colors / fonts / roundness) that
 * this design system was originally authored against, but no longer imports
 * `react-native-paper` to get it.
 *
 * Paper was dropped from the runtime bundle (~262KB of dead weight): the app
 * renders zero Paper components, and every value below was already overridden
 * explicitly — `...MD3LightTheme.colors` contributed nothing, since all 33 MD3
 * color tokens are assigned here. Application code reads only
 * `theme.custom.*` (see `extendedTheme`); these MD3 fields are retained purely
 * so the token shape stays stable for existing consumers and tests.
 */
export const theme = {
  animation: { scale: 1 },
  colors: {
    // Backdrop
    backdrop: 'rgba(0, 0, 0, 0.6)',

    // Background & Surface
    background: colors.light.background,

    // Elevation
    elevation: {
      level0: colors.light.background,
      level1: colors.gray[50],
      level2: colors.gray[100],
      level3: colors.gray[100],
      level4: colors.gray[100],
      level5: colors.gray[100],
    },

    // Error
    error: colors.error,

    errorContainer: '#FFEBEE',

    inverseOnSurface: colors.gray[50],

    inversePrimary: colors.primary[400],

    // Inverse
    inverseSurface: colors.gray[900],

    onBackground: colors.gray[900],

    onError: '#FFFFFF',

    onErrorContainer: '#B71C1C',

    onPrimary: '#FFFFFF',

    onPrimaryContainer: colors.primary[700],

    onSecondary: '#FFFFFF',

    onSecondaryContainer: colors.secondary[600],

    onSurface: colors.gray[900],

    onSurfaceDisabled: colors.gray[400],

    onSurfaceVariant: colors.gray[600],

    onTertiary: '#FFFFFF',

    onTertiaryContainer: colors.primary[700],

    // Outline
    outline: colors.gray[300],

    outlineVariant: colors.gray[200],

    // Primary (Brand Green)
    primary: colors.primary[500],

    primaryContainer: colors.primary[400],

    scrim: '#000000',

    // Secondary (Science Blue)
    secondary: colors.secondary[500],

    secondaryContainer: colors.secondary[400],

    // Shadow
    shadow: '#000000',

    surface: colors.light.surface,

    surfaceDisabled: colors.gray[200],

    surfaceVariant: colors.gray[100],

    // Tertiary (can be used for accents)
    tertiary: colors.primary[600],

    tertiaryContainer: colors.primary[400],
  },
  dark: false,
  fonts: customFonts,
  isV3: true,
  roundness: borderRadius.medium, // Default: 12pt
  version: 3,
};

/**
 * Extended Theme with Custom Design Tokens
 *
 * Adds our custom spacing, shadows, animations, and other tokens
 * that aren't part of the MD3-shaped base theme.
 */
export const extendedTheme = {
  ...theme,
  custom: {
    animations: {
      durations,
      easings,
      springs,
    },
    borderRadius,
    colors,
    componentSpacing,
    fontFamilies,
    fontWeights,
    iconSizes,
    shadows,
    spacing,
    typography,
  },
} as const;

/**
 * TypeScript Type for Full Theme
 *
 * Use this type when consuming the theme in components.
 */
export type AppTheme = typeof extendedTheme;

/**
 * Hook to Access Full Theme (MD3-shaped base + Custom Tokens)
 *
 * Returns the module-level `extendedTheme` directly. There is no theme
 * provider to read from — `react-native-paper`'s `useTheme()` used to supply
 * per-tree overrides, but nothing in the app ever passed a theme carrying
 * `custom` tokens, so the override path was always a no-op.
 *
 * @example
 * ```tsx
 * import { useAppTheme } from '@/theme';
 *
 * function MyComponent() {
 *   const theme = useAppTheme();
 *
 *   return (
 *     <View style={{
 *       padding: theme.custom.spacing.base,
 *       borderRadius: theme.custom.borderRadius.card,
 *       backgroundColor: theme.custom.colors.primary[600],
 *     }}>
 *       <Text style={theme.custom.typography.heading1}>
 *         Hello World
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */
export const useAppTheme = (): AppTheme => extendedTheme;

/**
 * Default Export
 */
export default extendedTheme;

/**
 * Re-Exports for Convenience
 *
 * Allows direct imports like:
 * ```
 * import { colors, typography, spacing } from '@/theme';
 * ```
 */
export { colors, withAlpha } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows, componentSpacing } from './spacing';
export { durations, easings, springs } from './animations';
export { iconSizes } from './iconSizes';
export { ThemeColorProvider, useThemeColors } from './ThemeContext';
export { darkColors, lightColors } from './darkColors';
export type { SemanticColors } from './darkColors';
