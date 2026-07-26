import { colors as staticColors } from '@/theme';
import type { SemanticColors } from '@/theme/darkColors';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

export function createDashboardMilestoneStyles(colors: SemanticColors) {
  return {
    milestoneAway: {
      color: colors.text.tertiary,
      fontFamily: fontFamilies.monospace,
      fontSize: 12,
    },
    milestoneAwayCurrent: {
      color: staticColors.streak[500],
      fontFamily: fontFamilies.monospace,
      fontSize: 12,
    },
    milestoneAwayDone: {
      color: staticColors.primary[600],
      fontFamily: fontFamilies.monospace,
      fontSize: 12,
    },
    milestoneCurrentDot: {
      backgroundColor: staticColors.streak[100],
      borderColor: staticColors.streak[500],
      borderRadius: borderRadius.full,
      borderWidth: 2,
      height: 10,
      width: 10,
    },
    milestoneDoneDot: {
      backgroundColor: staticColors.primary[600],
      borderRadius: borderRadius.full,
      height: 8,
      width: 8,
    },
    milestoneFutureDot: {
      backgroundColor: colors.border,
      borderRadius: borderRadius.full,
      height: 8,
      width: 8,
    },
    milestoneLabel: {
      color: colors.text.primary,
      flex: 1,
      fontSize: 13,
    },
    milestoneLabelCurrent: {
      color: staticColors.streak[500],
      flex: 1,
      fontSize: 13,
      fontWeight: fontWeights.semibold,
    },
    milestoneLabelDone: {
      color: staticColors.primary[600],
      flex: 1,
      fontSize: 13,
    },
    milestoneLabelFuture: {
      color: colors.text.tertiary,
      flex: 1,
      fontSize: 13,
    },
    milestoneRow: {
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      gap: 10,
    },
    milestonesCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      gap: 10,
      marginBottom: spacing.md,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
  };
}
