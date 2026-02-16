/**
 * Styles for ErrorFallback component
 */

import { StyleSheet } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';

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
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 20,
      maxWidth: 300,
      textAlign: 'center',
    },
    emoji: { fontSize: 48, marginBottom: 16 },
    errorMessage: {
      color: colors.status.error.text,
      fontFamily: 'monospace',
      fontSize: 13,
      marginTop: 24,
      maxWidth: 300,
    },
    headline: {
      color: colors.text.primary,
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 4,
      textAlign: 'center',
    },
    link: { padding: 8 },
    linkText: { color: colors.primary[600], fontSize: 13, fontWeight: '500' },
    logoutButton: {
      backgroundColor: colors.status.error.text,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    logoutText: { color: colors.text.inverse, fontSize: 17, fontWeight: '600' },
    safetyNote: {
      color: colors.primary[700],
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
    },
  });
};
