/**
 * ArchiveUndoToast Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography, fontFamilies} from '../../theme/typography';
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
      backgroundColor: isDark ? '#78350F' : '#fef3c7',
      borderRadius: borderRadius.medium,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    message: {
      flex: 1,
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.bodySmall.fontSize,
    },
    messageText: {
      color: colors.text.secondary,
    },
    progressBar: {
      backgroundColor: isDark ? '#F59E0B' : '#d97706',
      height: '100%',
      width: '100%',
    },
    progressContainer: {
      backgroundColor: isDark ? '#78350F' : '#fef3c7',
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      height: 3,
      overflow: 'hidden',
      width: '100%',
    },
    toast: {
      backgroundColor: colors.card,
      borderColor: isDark ? '#92400E' : '#f5f5f4',
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
      backgroundColor: isDark ? '#78350F' : '#fef3c7',
      borderRadius: borderRadius.medium,
      flexDirection: 'row',
      gap: 6,
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    undoButtonPressed: {
      backgroundColor: isDark ? '#92400E' : '#fde68a',
    },
    undoText: {
      color: isDark ? '#FCD34D' : '#b45309',
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });
}

/** @deprecated Use useToastStyles() for dark mode support */
export { useToastStyles as styles };
