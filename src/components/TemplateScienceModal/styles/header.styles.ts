/**
 * Header styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const headerStyles = StyleSheet.create({
  headerSpacer: {
    width: 44,
  },
});

export function themedHeaderStyles(colors: SemanticColors) {
  return StyleSheet.create({
    closeButton: {
      alignItems: 'center',
      backgroundColor: colors.gray[200],
      borderRadius: 24,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    header: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderBottomColor: 'transparent',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      zIndex: 10,
    },
    headerTitle: {
      color: colors.text.primary,
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: -0.3,
      maxWidth: 200,
    },
    shareButton: {
      alignItems: 'center',
      backgroundColor: colors.gray[200],
      borderRadius: 24,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
  });
}
