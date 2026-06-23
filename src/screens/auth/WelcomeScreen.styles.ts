/**
 * WelcomeScreen styles - Theme-aware hook for dark mode support
 */

import { StyleSheet, TextStyle } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export function useWelcomeStyles() {
  const { colors: themeColors } = useThemeColors();

  const sheet = StyleSheet.create({
    actionSection: { gap: spacing.md },
    container: { backgroundColor: themeColors.background, flex: 1 },
    content: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    footer: { marginTop: spacing.sm },
    heroSection: {
      alignItems: 'center',
      flex: 1,
      gap: spacing.base,
      justifyContent: 'center',
      paddingBottom: spacing.lg,
    },
    subtitle: {
      color: themeColors.text.secondary,
      fontFamily: fontFamilies.primary.display,
      fontSize: 19,
      fontWeight: fontWeights.regular,
      letterSpacing: -0.2,
      lineHeight: 26,
      textAlign: 'center',
    } as TextStyle,
    title: {
      ...typography.displayLarge,
      color: themeColors.text.primary,
      textAlign: 'center',
    } as TextStyle,
  });

  return {
    ...sheet,
    gradientColors: [
      themeColors.gray[50],
      themeColors.background,
      themeColors.gray[50],
    ] as [string, string, string],
  };
}
