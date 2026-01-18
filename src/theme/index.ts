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

/**
 * Custom font configuration for React Native Paper
 * Maps our typography scale to Paper's font variants
 */
const customFonts = configureFonts({
  config: {
    bodyLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.regular as any,
      letterSpacing: -0.41,
      lineHeight: 22,
    },
    bodyMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 15,
      fontWeight: fontWeights.regular as any,
      letterSpacing: -0.24,
      lineHeight: 20,
    },
    displayLarge: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 34,
      fontWeight: fontWeights.bold as any,
      letterSpacing: 0.37,
      lineHeight: 41,
    },
    bodySmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.regular as any,
      letterSpacing: -0.08,
      lineHeight: 18,
    },
    displayMedium: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 28,
      fontWeight: fontWeights.bold as any,
      letterSpacing: 0.36,
      lineHeight: 34,
    },
    displaySmall: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 22,
      fontWeight: fontWeights.semibold as any,
      letterSpacing: 0.35,
      lineHeight: 28,
    },
    headlineLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 28,
      fontWeight: fontWeights.bold as any,
      letterSpacing: 0.36,
      lineHeight: 34,
    },
    headlineMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 22,
      fontWeight: fontWeights.semibold as any,
      letterSpacing: 0.35,
      lineHeight: 28,
    },
    headlineSmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.semibold as any,
      letterSpacing: -0.41,
      lineHeight: 22,
    },
    labelLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.semibold as any,
      letterSpacing: -0.41,
      lineHeight: 22,
    },
    labelMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.medium as any,
      letterSpacing: -0.08,
      lineHeight: 18,
    },
    labelSmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 10,
      fontWeight: fontWeights.medium as any,
      letterSpacing: 0.12,
      lineHeight: 12,
    },
    titleLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.semibold as any,
      letterSpacing: -0.41,
      lineHeight: 22,
    },
    titleMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 15,
      fontWeight: fontWeights.semibold as any,
      letterSpacing: -0.24,
      lineHeight: 20,
    },
    titleSmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.semibold as any,
      letterSpacing: -0.08,
      lineHeight: 18,
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

    onPrimary: '#FFFFFF',

    onPrimaryContainer: colors.primary[700],

    onSecondary: '#FFFFFF',

    // Error
    error: colors.error,

    onSecondaryContainer: colors.secondary[600],

    errorContainer: '#FFEBEE',

    onTertiary: '#FFFFFF',

    // Background & Surface
    background: colors.light.background,

    // Primary (Brand Green)
    primary: colors.primary[500],

    onBackground: colors.gray[900],

    primaryContainer: colors.primary[400],

    onError: '#FFFFFF',

    // Secondary (Science Blue)
    secondary: colors.secondary[500],

    onErrorContainer: '#B71C1C',

    secondaryContainer: colors.secondary[400],

    onSurface: colors.gray[900],

    // Tertiary (can be used for accents)
    tertiary: colors.primary[600],
    onSurfaceDisabled: colors.gray[400],
    tertiaryContainer: colors.primary[400],
    // Inverse
    inverseSurface: colors.gray[900],

    onTertiaryContainer: colors.primary[700],

    inverseOnSurface: colors.gray[50],

    inversePrimary: colors.primary[400],

    onSurfaceVariant: colors.gray[600],

    // Backdrop
    backdrop: 'rgba(0, 0, 0, 0.6)',

    // Outline
    outline: colors.gray[300],

    // Elevation
    elevation: {
      level0: colors.light.background,
      level1: colors.gray[50],
      level2: colors.gray[100],
      level3: colors.gray[100],
      level4: colors.gray[100],
      level5: colors.gray[100],
    },

    surface: colors.light.surface,

    outlineVariant: colors.gray[200],

    surfaceVariant: colors.gray[100],

    scrim: '#000000',

    surfaceDisabled: colors.gray[200],

    // Shadow
    shadow: '#000000',
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
    borderRadius,
    colors,
    componentSpacing,
    fontFamilies,
    fontWeights,
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
