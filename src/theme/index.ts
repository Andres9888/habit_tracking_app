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
    displayLarge: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 34,
      fontWeight: fontWeights.bold as any,
      lineHeight: 41,
      letterSpacing: 0.37,
    },
    displayMedium: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 28,
      fontWeight: fontWeights.bold as any,
      lineHeight: 34,
      letterSpacing: 0.36,
    },
    displaySmall: {
      fontFamily: fontFamilies.primary.display,
      fontSize: 22,
      fontWeight: fontWeights.semibold as any,
      lineHeight: 28,
      letterSpacing: 0.35,
    },
    headlineLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 28,
      fontWeight: fontWeights.bold as any,
      lineHeight: 34,
      letterSpacing: 0.36,
    },
    headlineMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 22,
      fontWeight: fontWeights.semibold as any,
      lineHeight: 28,
      letterSpacing: 0.35,
    },
    headlineSmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.semibold as any,
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    titleLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.semibold as any,
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    titleMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 15,
      fontWeight: fontWeights.semibold as any,
      lineHeight: 20,
      letterSpacing: -0.24,
    },
    titleSmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.semibold as any,
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    bodyLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.regular as any,
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    bodyMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 15,
      fontWeight: fontWeights.regular as any,
      lineHeight: 20,
      letterSpacing: -0.24,
    },
    bodySmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.regular as any,
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    labelLarge: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: fontWeights.semibold as any,
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    labelMedium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.medium as any,
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    labelSmall: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 10,
      fontWeight: fontWeights.medium as any,
      lineHeight: 12,
      letterSpacing: 0.12,
    },
  },
});

/**
 * Custom theme extending React Native Paper's MD3 theme
 */
export const theme: MD3Theme = {
  ...MD3LightTheme,
  fonts: customFonts,
  colors: {
    ...MD3LightTheme.colors,
    // Primary (Brand Green)
    primary: colors.primary[500],
    primaryContainer: colors.primary[400],
    onPrimary: '#FFFFFF',
    onPrimaryContainer: colors.primary[700],

    // Secondary (Science Blue)
    secondary: colors.secondary[500],
    secondaryContainer: colors.secondary[400],
    onSecondary: '#FFFFFF',
    onSecondaryContainer: colors.secondary[600],

    // Tertiary (can be used for accents)
    tertiary: colors.primary[600],
    tertiaryContainer: colors.primary[400],
    onTertiary: '#FFFFFF',
    onTertiaryContainer: colors.primary[700],

    // Error
    error: colors.error,
    errorContainer: '#FFEBEE',
    onError: '#FFFFFF',
    onErrorContainer: '#B71C1C',

    // Background & Surface
    background: colors.light.background,
    onBackground: colors.gray[900],
    surface: colors.light.surface,
    onSurface: colors.gray[900],
    surfaceVariant: colors.gray[100],
    onSurfaceVariant: colors.gray[600],
    surfaceDisabled: colors.gray[200],
    onSurfaceDisabled: colors.gray[400],

    // Outline
    outline: colors.gray[300],
    outlineVariant: colors.gray[200],

    // Inverse
    inverseSurface: colors.gray[900],
    inverseOnSurface: colors.gray[50],
    inversePrimary: colors.primary[400],

    // Shadow
    shadow: '#000000',
    scrim: '#000000',

    // Backdrop
    backdrop: 'rgba(0, 0, 0, 0.6)',

    // Elevation
    elevation: {
      level0: colors.light.background,
      level1: colors.gray[50],
      level2: colors.gray[100],
      level3: colors.gray[100],
      level4: colors.gray[100],
      level5: colors.gray[100],
    },
  },
  roundness: borderRadius.medium, // Default: 12pt
};

/**
 * Extended theme with our custom design tokens
 * Includes spacing, shadows, and component-specific values
 */
export const extendedTheme = {
  ...theme,
  custom: {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    componentSpacing,
    fontFamilies,
    fontWeights,
  },
} as const;

/**
 * Theme type for TypeScript
 */
export type AppTheme = typeof extendedTheme;

/**
 * Re-export individual modules for direct imports
 */
export { colors, typography, spacing, borderRadius, shadows, componentSpacing };

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
