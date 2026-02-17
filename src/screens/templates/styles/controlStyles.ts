import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createControlStyles = (c: SemanticColors) =>
  StyleSheet.create({
    controlButton: {
      alignItems: 'center',
      borderColor: c.border,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    controlButtonActive: {
      backgroundColor: c.text.primary,
      borderColor: c.text.primary,
    },
    controlButtonText: {
      color: c.text.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    controlRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    filterControlsRow: {
      flexDirection: 'row',
      gap: 12,
      paddingBottom: 12,
      paddingHorizontal: 20,
    },
  });
