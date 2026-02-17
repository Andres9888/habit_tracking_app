import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createCustomizeStyles = (c: SemanticColors) =>
  StyleSheet.create({
    customizeSection: {
      marginTop: 4,
    },
    customizeSubtitle: {
      backgroundColor: c.surface,
      borderRadius: 8,
      color: c.text.tertiary,
      fontSize: 13,
      fontWeight: '500',
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    customizeTitle: {
      color: c.text.primary,
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
