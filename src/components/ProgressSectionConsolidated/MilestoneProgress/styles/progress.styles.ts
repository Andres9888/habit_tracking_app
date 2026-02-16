import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '@/theme/darkColors';

export function getProgressStyles(colors: SemanticColors) {
  return StyleSheet.create({
    badgeIcon: {
      fontSize: 17,
      marginLeft: 4,
    },
    container: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      marginTop: 12,
      padding: 12,
    },
    daysAway: {
      color: colors.text.secondary,
      fontSize: 13,
      fontWeight: '500',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    headerLeft: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerTitle: {
      color: colors.text.primary,
      fontSize: 15,
      fontWeight: '600',
    },
    milestoneName: {
      color: colors.text.secondary,
      fontSize: typography.caption.fontSize,
      marginBottom: 12,
    },
    progressBadge: {
      alignItems: 'center',
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[300],
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      height: 24,
      justifyContent: 'center',
      marginLeft: 8,
      width: 24,
    },
    progressBadgeText: {
      fontSize: typography.caption.fontSize,
    },
    progressBarContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    progressBarFill: {
      backgroundColor: colors.primary[600],
      borderRadius: borderRadius.xs,
      height: '100%',
    },
    progressBarTrack: {
      backgroundColor: colors.border,
      borderRadius: borderRadius.xs,
      flex: 1,
      height: 8,
      overflow: 'hidden',
    },
    progressLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    progressLabelText: {
      color: colors.text.secondary,
      fontSize: typography.tabBar.fontSize,
    },
  });
}
