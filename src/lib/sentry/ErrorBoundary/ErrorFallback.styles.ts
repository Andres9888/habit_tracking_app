import { StyleSheet } from 'react-native';
import { colors as themeColors } from '@/theme/colors';
import type { SemanticColors } from '../../../theme/darkColors';
import { fontFamilies, fontWeights } from '../../../theme/typography';

export function createErrorFallbackStyles(colors: SemanticColors) {
  return StyleSheet.create({
    button: { backgroundColor: colors.text.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
    buttonText: { color: colors.text.inverse, fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: fontWeights.semibold },
    container: { alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 24 },
    content: { alignItems: 'center', maxWidth: 320 },
    emoji: { fontSize: 34, marginBottom: 16 },
    errorDetail: {
      backgroundColor: colors.card,
      borderRadius: 8,
      color: themeColors.error,
      fontFamily: 'monospace',
      fontSize: 13,
      marginBottom: 24,
      padding: 12,
      textAlign: 'center',
    },
    message: {
      color: colors.text.secondary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 8,
      textAlign: 'center',
    },
    safetyNote: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.semibold,
      marginBottom: 16,
      textAlign: 'center',
    },
    supportButton: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 8 },
    supportButtonText: {
      color: colors.text.secondary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: fontWeights.medium,
      textDecorationLine: 'underline',
    },
    title: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.display,
      fontSize: 22,
      fontWeight: fontWeights.semibold,
      marginBottom: 8,
      textAlign: 'center',
    },
  });
}
