/**
 * ArchiveUndoToast Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';

export function useToastStyles() {
  const { colors, isDark } = useThemeColors();

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
    habitName: {
      color: colors.text.primary,
      fontWeight: '600',
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: colors.status.warning.bg,
      borderRadius: borderRadius.medium,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    message: {
      flex: 1,
      fontSize: typography.bodySmall.fontSize,
    },
    messageText: {
      color: colors.text.secondary,
    },
    progressBar: {
      backgroundColor: colors.status.warning.text,
      height: '100%',
    },
    progressContainer: {
      backgroundColor: colors.status.warning.bg,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      height: 3,
      overflow: 'hidden',
      width: '100%',
    },
    toast: {
      backgroundColor: colors.card,
      borderColor: colors.status.warning.border,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      ...shadows.alert,
      maxWidth: 400,
      overflow: 'hidden',
      shadowColor: isDark ? '#000' : '#78716c',
      width: '100%',
    },
    undoButton: {
      alignItems: 'center',
      backgroundColor: colors.status.warning.bg,
      borderRadius: borderRadius.medium,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    undoButtonPressed: {
      backgroundColor: colors.chip.selectedBorder,
    },
    undoText: {
      color: colors.status.warning.text,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });
}

/** @deprecated Use useToastStyles() for dark mode support */
export { useToastStyles as styles };
