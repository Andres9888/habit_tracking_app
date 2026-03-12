import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';
import { fontFamilies } from '../../../theme/typography';

export function createErrorFallbackStyles(colors: SemanticColors) {
  return StyleSheet.create({
    button: { backgroundColor: colors.text.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
    buttonText: { color: colors.text.inverse, fontFamily: fontFamilies.primary.text, fontSize: 14, fontWeight: '600' },
    container: { alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 24 },
    content: { alignItems: 'center', maxWidth: 320 },
    emoji: { fontSize: 48, marginBottom: 16 },
    errorDetail: {
      backgroundColor: colors.card,
      borderRadius: 8,
      color: '#dc2626',
      fontFamily: 'monospace',
      fontSize: 12,
      marginBottom: 24,
      padding: 12,
      textAlign: 'center',
    },
    message: {
      color: colors.text.secondary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 8,
      textAlign: 'center',
    },
    safetyNote: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 16,
      textAlign: 'center',
    },
    supportButton: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 8 },
    supportButtonText: {
      color: colors.text.secondary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    title: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.display,
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
    },
  });
}
