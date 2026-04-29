import { StyleSheet } from 'react-native';
import { lightColors } from '../../../theme/darkColors';
import type { SemanticColors } from '../../../theme/darkColors';
import { borderRadius, spacing } from '../../../theme/spacing';

export const getSkeletonStyles = (
  themeColors: Pick<SemanticColors, 'border' | 'surface'>,
) =>
  StyleSheet.create({
    skeletonBadge: {
      backgroundColor: themeColors.border,
      borderRadius: borderRadius.full,
      height: 14,
      width: 60,
    },
    skeletonBadgeRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    skeletonCard: {
      backgroundColor: themeColors.surface,
      borderRadius: borderRadius.card,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: spacing.lg,
    },
    skeletonIcon: {
      backgroundColor: themeColors.border,
      borderRadius: borderRadius.full,
      height: 48,
      width: 48,
    },
    skeletonLine: {
      backgroundColor: themeColors.border,
      borderRadius: borderRadius.small,
      height: 12,
      marginTop: 8,
      width: '60%',
    },
    skeletonLineLarge: {
      backgroundColor: themeColors.border,
      borderRadius: borderRadius.small,
      height: 16,
      marginTop: 16,
      width: '80%',
    },
    skeletonSearch: {
      backgroundColor: themeColors.border,
      borderRadius: borderRadius.full,
      height: 44,
      marginBottom: 16,
      marginHorizontal: 16,
    },
  });

export const skeletonStyles = getSkeletonStyles({
  border: lightColors.border,
  surface: lightColors.surface,
});
 
