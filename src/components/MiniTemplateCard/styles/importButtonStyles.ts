/**
 * Import button styles for MiniTemplateCard
 */

import type { ViewStyle, TextStyle } from 'react-native';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

export function useImportButtonStyles(): Record<string, ViewStyle | TextStyle> {
  const { colors } = useThemeColors();

  return {
    checkmarkContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
    },
    importButton: {
      alignItems: 'center',
      borderRadius: 8,
      flexDirection: 'row',
      gap: 4,
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    importButtonText: {
      color: colors.text.inverse,
      fontSize: typography.caption.fontSize,
      fontWeight: '700',
    },
    importButtonWrapper: {
      bottom: 14,
      position: 'absolute',
      right: 14,
    },
  };
}

/** @deprecated Use useImportButtonStyles() for dark mode support */
export const importButtonStyles = {} as Record<string, ViewStyle | TextStyle>;
