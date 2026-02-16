import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createControlStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    controlButton: {
      alignItems: 'center',
      borderColor: tc.controlBorder,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    controlButtonActive: {
      backgroundColor: tc.controlActiveBg,
      borderColor: tc.controlActiveBorder,
    },
    controlButtonText: {
      color: tc.controlActiveText,
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

/** @deprecated Use createControlStyles(themeColors) */
export const controlStyles = createControlStyles({
  controlBorder: '#e7e5e4', controlActiveBg: '#111827',
  controlActiveBorder: '#111827', controlActiveText: '#1c1917',
} as any);
