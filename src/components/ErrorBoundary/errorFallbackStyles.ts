/**
 * Styles for ErrorFallback component
 */

import { StyleSheet } from 'react-native';

import { colors as themeColors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { fontFamilies } from '../../theme/typography';

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
      color: colors.text.secondary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 20,
      maxWidth: 300,
      textAlign: 'center',
    },
    emoji: { fontSize: 34, marginBottom: 16 },
    errorMessage: {
      color: isDark ? '#FCA5A5' : themeColors.error, // TODO: add dark-mode error text token (#FCA5A5)
      fontFamily: 'monospace',
      fontSize: 13,
      marginTop: 24,
      maxWidth: 300,
    },
    headline: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.display,
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 4,
      textAlign: 'center',
    },
    link: { padding: 8 },
    linkText: { color: colors.primary[600], fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: '500' },
    logoutButton: {
      backgroundColor: isDark ? '#B91C1C' : themeColors.error, // TODO: add dark-mode error bg token (#B91C1C)
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    logoutText: { color: colors.text.inverse, fontFamily: fontFamilies.primary.text, fontSize: 17, fontWeight: '600' },
    safetyNote: {
      color: colors.primary[700],
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
    },
  });
};
