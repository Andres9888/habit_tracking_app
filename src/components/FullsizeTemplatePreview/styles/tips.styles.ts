/**
 * Tips box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

export function useTipsStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    tipIconContainer: {
      alignItems: 'center',
      borderRadius: borderRadius.medium,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    tipItem: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    tipNumber: {
      fontSize: 13,
      fontWeight: '700',
    },
    tipsBox: {
      backgroundColor: colors.status.tips.bg,
      borderColor: colors.status.tips.border,
      borderRadius: borderRadius.large,
      borderWidth: 2,
      marginHorizontal: 20,
      marginTop: 16,
      padding: 20,
    },
    tipsDivider: {
      backgroundColor: colors.status.tips.border,
      height: 1,
      marginBottom: 12,
    },
    tipsHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    tipsLabel: {
      color: colors.status.tips.text,
      fontSize: typography.caption.fontSize,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    tipText: {
      color: colors.status.tips.text,
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
