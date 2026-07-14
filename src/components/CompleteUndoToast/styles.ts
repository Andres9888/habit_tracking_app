/**
 * CompleteUndoToast Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';

export function useToastStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      left: 16,
      position: 'absolute',
      right: 16,
      zIndex: 9999,
    },
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
    },
    message: {
      color: colors.text.inverse,
      flex: 1,
      fontFamily: fontFamilies.primary.text,
    },
    toast: {
      alignItems: 'center',
      backgroundColor: colors.status.success,
      borderRadius: borderRadius.card,
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
      maxWidth: 400,
      paddingHorizontal: 16,
      paddingVertical: 14,
      width: '100%',
    },
    undoButton: {
      alignItems: 'center',
      backgroundColor: colors.status.successLight,
      borderRadius: borderRadius.medium,
      flexDirection: 'row',
      gap: 6,
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    undoButtonPressed: {
      opacity: 0.8,
    },
    undoText: {
      color: colors.status.successText,
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.caption.fontSize,
      fontWeight: fontWeights.bold,
      letterSpacing: 0.3,
    },
  });
}
