import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createCustomizeStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    customizeSection: {
      marginTop: 4,
    },
    customizeSubtitle: {
      backgroundColor: tc.customizerBg,
      borderRadius: 8,
      color: tc.customizerLabel,
      fontSize: 10,
      fontWeight: '500',
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    customizeTitle: {
      color: tc.customizerTitle,
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    customizeTitleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
      marginBottom: 4,
    },
  });

/** @deprecated Use createCustomizeStyles(themeColors) */
export const customizeStyles = createCustomizeStyles({
  customizerBg: '#f3f4f6', customizerLabel: '#78716c', customizerTitle: '#1c1917',
} as any);
