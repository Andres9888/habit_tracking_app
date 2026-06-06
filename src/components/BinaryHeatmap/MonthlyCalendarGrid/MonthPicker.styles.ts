import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { styles as calendarStyles } from './styles';

export function useMonthPickerStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    navButton: calendarStyles.navButton,
    container: { paddingBottom: spacing.sm },
    divider: {
      backgroundColor: colors.border,
      height: 1,
      marginBottom: spacing.md,
      marginHorizontal: spacing.xs,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
    headerTitle: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.body.fontSize,
      fontWeight: fontWeights.bold,
    },
    monthBtn: {
      alignItems: 'center',
      borderRadius: borderRadius.medium,
      paddingVertical: 12,
      width: '23.5%',
    },
    monthText: {
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.bodySmall.fontSize,
      fontWeight: fontWeights.semibold,
    },
    yearLabel: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.body.fontSize,
      fontWeight: fontWeights.bold,
      minWidth: 56,
      textAlign: 'center',
    },
    yearRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    disabled: { opacity: 0.35 },
  });
}
