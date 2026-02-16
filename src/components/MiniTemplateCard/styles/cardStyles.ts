/**
 * Card layout styles for MiniTemplateCard
 */

import type { ViewStyle, TextStyle } from 'react-native';
import { shadows, borderRadius } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

export function useCardStyles(): Record<string, ViewStyle | TextStyle> {
  const { colors } = useThemeColors();

  return {
    accent: {
      borderBottomLeftRadius: borderRadius.large,
      borderTopLeftRadius: borderRadius.large,
      bottom: 0,
      left: 0,
      position: 'absolute',
      top: 0,
      width: 4,
    },
    card: {
      ...shadows.card,
      backgroundColor: colors.card,
      borderRadius: borderRadius.large,
      flexDirection: 'column',
      marginRight: 12,
      minHeight: 150,
      overflow: 'hidden',
      paddingHorizontal: 14,
      paddingLeft: 18,
      paddingVertical: 14,
      shadowOpacity: 0.08,
      width: 200,
    },
    description: {
      color: colors.text.tertiary,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 36,
    },
    glowOverlay: {
      borderRadius: borderRadius.large,
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    name: {
      color: colors.text.primary,
      fontSize: typography.body.fontSize,
      fontWeight: '700',
      lineHeight: 21,
      marginBottom: 6,
    },
  };
}

/** @deprecated Use useCardStyles() for dark mode support */
export const cardStyles = {} as Record<string, ViewStyle | TextStyle>;
