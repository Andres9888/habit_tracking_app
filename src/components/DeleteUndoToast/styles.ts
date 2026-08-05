import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies} from '../../theme/typography';
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
      backgroundColor: colors.status.errorLight,
      borderRadius: borderRadius.medium,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    itemName: {
      color: colors.text.primary,
      fontWeight: fontWeights.semibold,
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
      backgroundColor: colors.status.error,
      height: '100%',
    },
    progressContainer: {
      backgroundColor: colors.status.errorLight,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      height: 3,
      overflow: 'hidden',
      width: '100%',
    },
    toast: {
      backgroundColor: colors.card,
      borderColor: colors.status.errorLight,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      ...shadows.alert,
      maxWidth: 400,
      overflow: 'hidden',
      width: '100%',
    },
    undoButton: {
      alignItems: 'center',
      backgroundColor: colors.status.errorLight,
      borderRadius: borderRadius.medium,
      flexDirection: 'row',
      gap: 6,
      minHeight: 44,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    undoButtonPressed: {
      opacity: 0.8,
    },
    undoText: {
      color: colors.status.errorText,
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.caption.fontSize,
      fontWeight: fontWeights.bold,
      letterSpacing: 0.3,
    },
  });
}

/** @deprecated Use useToastStyles() for dark mode support */
export { useToastStyles as styles };
