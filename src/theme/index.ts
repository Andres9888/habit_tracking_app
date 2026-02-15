/**
 * Theme System - Habit Tracking App
 * Integrates colors, typography, and spacing with React Native Paper
 *
 * Based on UX Specification Sections 5.1, 5.2, 5.3
 */

import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { colors } from './colors';
import { typography, fontFamilies, fontWeights } from './typography';
import { spacing, borderRadius, shadows, componentSpacing } from './spacing';
import { durations, easings, springs } from './animations';
import { iconSizes } from './iconSizes';

/**
 * Custom font configuration for React Native Paper
 * Maps our typography scale to Paper's font variants
 */
const customFonts = configureFonts({
  config: {
    bodyLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 16,
      fontWeight: fontWeights.regular,
      letterSpacing: 0,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 14,
      fontWeight: fontWeights.regular,
      letterSpacing: 0,
      lineHeight: 21,
    },
    bodySmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 12,
      fontWeight: fontWeights.medium,
      letterSpacing: 0.12,
      lineHeight: 18,
    },
    displayLarge: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 38,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.95,
      lineHeight: 45,
    },
    displayMedium: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 30,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.6,
      lineHeight: 36,
    },
    displaySmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 24,
      fontWeight: fontWeights.semibold,
      letterSpacing: -0.36,
      lineHeight: 30,
    },
    headlineLarge: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 30,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.6,
      lineHeight: 36,
    },
    headlineMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 24,
      fontWeight: fontWeights.semibold,
      letterSpacing: -0.36,
      lineHeight: 30,
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
      fontSize: 16,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0.08,
      lineHeight: 24,
    },
    labelMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 12,
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
      fontSize: 16,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0,
      lineHeight: 24,
    },
    titleSmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 14,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0,
      lineHeight: 21,
    },
  },
});

/**
 * Custom theme extending React Native Paper's MD3 theme
 */
export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

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
  fonts: customFonts,
  roundness: borderRadius.medium, // Default: 12pt
};

/**
 * Extended theme with our custom design tokens
 * Includes spacing, shadows, and component-specific values
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
 * Theme type for TypeScript
 */
export type AppTheme = typeof extendedTheme;

/**
 * Re-export individual modules for direct imports
 */

/**
 * Helper hook to use theme in components
 * Usage:
 *
 * import { useAppTheme } from '@/theme';
 *
 * const MyComponent = () => {
 *   const theme = useAppTheme();
 *   return <View style={{ backgroundColor: theme.custom.colors.primary[500] }} />;
 * };
 */
import { useTheme } from 'react-native-paper';
export const useAppTheme = () => useTheme<AppTheme>();

/**
 * Default export
 */
export default extendedTheme;

export { colors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows, componentSpacing } from './spacing';
export { durations, easings, springs } from './animations';
export { iconSizes } from './iconSizes';
export { ThemeColorProvider, useThemeColors } from './ThemeContext';
export { darkColors, lightColors } from './darkColors';
export type { SemanticColors } from './darkColors';
export { useThemedStyles } from './useThemedStyles';
