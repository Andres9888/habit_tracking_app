/**
 * WelcomeScreen styles - Theme-aware hook for dark mode support
 */

import { StyleSheet, TextStyle } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '@/theme/typography';

export function useWelcomeStyles() {
  const { colors: themeColors } = useThemeColors();

  const sheet = StyleSheet.create({
    actionSection: { gap: 12 },
    container: { backgroundColor: themeColors.background, flex: 1 },
    content: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 32,
      paddingHorizontal: 24,
    },
    footer: { marginTop: 8 },
    heroSection: {
      alignItems: 'center',
      flex: 1,
      gap: 8,
      justifyContent: 'center',
      paddingBottom: 8,
    },
    subtitle: {
      ...typography.body,
      color: themeColors.text.secondary,
      marginBottom: 16,
      textAlign: 'center',
    } as TextStyle,
    title: {
      ...typography.displayLarge,
      color: themeColors.text.primary,
      textAlign: 'center',
    } as TextStyle,
    valuePropsWrap: { marginTop: 16, width: '100%' },
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
