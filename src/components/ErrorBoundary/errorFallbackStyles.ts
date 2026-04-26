/**
 * Styles for ErrorFallback component
 */

import { StyleSheet } from 'react-native';

import { colors as themeColors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { fontWeights, typography } from '../../theme/typography';

export const useStyles = () => {
  const { colors, isDark } = useThemeColors();

  return StyleSheet.create({
    actions: { flexDirection: 'row', gap: 16, marginTop: 16 },
    container: {
      alignItems: 'center',
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    },
    description: {
      ...typography.caption,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: 20,
      maxWidth: 300,
      textAlign: 'center',
    },
    emoji: { fontSize: typography.displayLarge.fontSize, marginBottom: 16 },
    errorMessage: {
      color: isDark ? '#FCA5A5' : themeColors.error,
      fontFamily: 'monospace',
      fontSize: typography.caption.fontSize,
      marginTop: 24,
      maxWidth: 300,
    },
    headline: {
      ...typography.heading1,
      color: colors.text.primary,
      marginBottom: 4,
      textAlign: 'center',
    },
    link: { padding: 8 },
    linkText: { ...typography.caption, color: colors.primary[600] },
    logoutButton: {
      backgroundColor: isDark ? '#B91C1C' : themeColors.error,
      borderRadius: borderRadius.button,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    logoutText: { ...typography.button, color: colors.text.inverse },
    safetyNote: {
      ...typography.caption,
      color: colors.primary[700],
      fontWeight: fontWeights.semibold,
      marginBottom: 8,
    },
  });
};
