import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';

export const DISMISS_THRESHOLD = 50;

export function useToastStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      left: 20,
      position: 'absolute',
      right: 20,
      zIndex: 9999,
    },
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
      paddingBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 14,
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: colors.danger[50],
      borderRadius: borderRadius.medium,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    itemName: {
      color: colors.text.primary,
      fontWeight: '600',
    },
    message: {
      flex: 1,
      fontSize: typography.bodySmall.fontSize,
    },
    messageText: {
      color: colors.text.secondary,
    },
    progressBar: {
      backgroundColor: colors.danger[500],
      height: '100%',
    },
    progressContainer: {
      backgroundColor: colors.danger[50],
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      height: 3,
      overflow: 'hidden',
      width: '100%',
    },
    toast: {
      backgroundColor: colors.card,
      borderColor: colors.danger[100],
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      ...shadows.alert,
      maxWidth: 400,
      overflow: 'hidden',
      shadowColor: colors.overlay.backdrop,
      width: '100%',
    },
    undoButton: {
      alignItems: 'center',
      backgroundColor: colors.danger[50],
      borderRadius: borderRadius.medium,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    undoButtonPressed: {
      backgroundColor: colors.danger[100],
    },
    undoText: {
      color: colors.danger.text,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });
}

/** @deprecated Use useToastStyles() for dark mode support */
export { useToastStyles as styles };
